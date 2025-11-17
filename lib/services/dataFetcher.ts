// lib/services/dataFetcher.ts
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import { z } from 'zod';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// Schema for business data validation
const BusinessSchema = z.object({
  OBJECTID: z.number(),
  shem_esek: z.string().nullable(),
  sug_esek: z.string().nullable(),
  ktovet: z.string().nullable(),
  telephone: z.string().nullable(),
  status_esek: z.string().nullable(),
  taarich_pticha: z.string().nullable(),
  X: z.number().nullable(),
  Y: z.number().nullable(),
});

type Business = z.infer<typeof BusinessSchema>;

interface ChangeDetection {
  newBusinesses: Business[];
  closedBusinesses: Business[];
  totalActive: number;
  changes: number;
}

export class DataFetcher {
  private readonly API_URL = 'https://gisn.tel-aviv.gov.il/arcgis/rest/services/IView2/MapServer/964/query';
  
  async fetchBusinessData(): Promise<Business[]> {
    try {
      console.log('📊 Fetching Tel Aviv business data...');
      
      const response = await axios.get(this.API_URL, {
        params: {
          where: '1=1',
          outFields: '*',
          f: 'json',
          returnGeometry: true,
          spatialRel: 'esriSpatialRelIntersects',
          resultRecordCount: 5000,
        },
        timeout: 30000,
      });

      if (!response.data?.features) {
        throw new Error('Invalid response structure from API');
      }

      // Parse and validate the data
      const businesses = response.data.features.map((feature: any) => {
        try {
          return BusinessSchema.parse({
            ...feature.attributes,
            X: feature.geometry?.x,
            Y: feature.geometry?.y,
          });
        } catch (error) {
          console.warn('Failed to parse business:', feature.attributes.OBJECTID);
          return null;
        }
      }).filter(Boolean);

      console.log(`✅ Fetched ${businesses.length} businesses`);
      return businesses;
    } catch (error) {
      console.error('❌ Error fetching business data:', error);
      throw error;
    }
  }

  async detectChanges(currentData: Business[]): Promise<ChangeDetection> {
    try {
      // Fetch yesterday's data from database
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const { data: previousSnapshot } = await supabase
        .from('businesses')
        .select('*')
        .eq('is_active', true);

      const previousIds = new Set(previousSnapshot?.map(b => b.external_id) || []);
      const currentIds = new Set(currentData.map(b => String(b.OBJECTID)));

      // Find new businesses
      const newBusinesses = currentData.filter(
        business => !previousIds.has(String(business.OBJECTID))
      );

      // Find closed businesses
      const closedIds = Array.from(previousIds).filter(id => !currentIds.has(id));
      const { data: closedBusinesses } = await supabase
        .from('businesses')
        .select('*')
        .in('external_id', closedIds);

      return {
        newBusinesses,
        closedBusinesses: closedBusinesses || [],
        totalActive: currentData.length,
        changes: newBusinesses.length + closedIds.length,
      };
    } catch (error) {
      console.error('Error detecting changes:', error);
      return {
        newBusinesses: [],
        closedBusinesses: [],
        totalActive: currentData.length,
        changes: 0,
      };
    }
  }

  async saveToDatabase(businesses: Business[]): Promise<void> {
    try {
      console.log('💾 Saving to database...');
      
      // Prepare data for upsert
      const businessRecords = businesses.map(business => ({
        external_id: String(business.OBJECTID),
        name: business.shem_esek || 'Unknown',
        category: business.sug_esek,
        address: business.ktovet,
        phone: business.telephone,
        status: business.status_esek,
        opened_date: business.taarich_pticha,
        location: business.X && business.Y ? `POINT(${business.X} ${business.Y})` : null,
        last_seen: new Date().toISOString(),
        is_active: true,
        raw_data: business,
      }));

      // Batch upsert (update if exists, insert if new)
      const batchSize = 100;
      for (let i = 0; i < businessRecords.length; i += batchSize) {
        const batch = businessRecords.slice(i, i + batchSize);
        const { error } = await supabase
          .from('businesses')
          .upsert(batch, { onConflict: 'external_id' });

        if (error) {
          console.error('Error upserting batch:', error);
        }
      }

      // Mark businesses not in current data as inactive
      const activeIds = businesses.map(b => String(b.OBJECTID));
      await supabase
        .from('businesses')
        .update({ is_active: false, last_seen: new Date().toISOString() })
        .not('external_id', 'in', activeIds);

      console.log('✅ Database updated successfully');
    } catch (error) {
      console.error('❌ Error saving to database:', error);
      throw error;
    }
  }

  async generateDailyStats(): Promise<{
    total: number;
    byCategory: Record<string, number>;
    byNeighborhood: Record<string, number>;
    trends: string[];
  }> {
    const { data: businesses } = await supabase
      .from('businesses')
      .select('*')
      .eq('is_active', true);

    if (!businesses) {
      return {
        total: 0,
        byCategory: {},
        byNeighborhood: {},
        trends: [],
      };
    }

    // Calculate statistics
    const byCategory = businesses.reduce((acc, b) => {
      const category = b.category || 'Other';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Extract neighborhood from address (simplified)
    const byNeighborhood = businesses.reduce((acc, b) => {
      if (b.address) {
        // Simple extraction - can be improved with proper geocoding
        const parts = b.address.split(',');
        const neighborhood = parts[parts.length - 2]?.trim() || 'Unknown';
        acc[neighborhood] = (acc[neighborhood] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    // Identify trends
    const trends = [];
    const topCategory = Object.entries(byCategory)
      .sort(([, a], [, b]) => b - a)[0];
    if (topCategory) {
      trends.push(`Most common business type: ${topCategory[0]} (${topCategory[1]} businesses)`);
    }

    return {
      total: businesses.length,
      byCategory,
      byNeighborhood,
      trends,
    };
  }
}

// Export singleton instance
export const dataFetcher = new DataFetcher();
