import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getTemplate,
  getTemplateMetadata,
  isValidTemplateType,
  TemplateType,
} from '@/lib/templates';
import {
  sampleBusinesses,
  sampleGenerated,
  sampleTemplateData,
} from '@/lib/templates/__test__/sample-data';

interface TemplatePageProps {
  params: {
    type: string;
  };
}

export async function generateMetadata({
  params,
}: TemplatePageProps): Promise<Metadata> {
  if (!isValidTemplateType(params.type)) {
    return {
      title: 'Template Not Found',
    };
  }

  const metadata = getTemplateMetadata(params.type);

  return {
    title: `${metadata.name} Template Preview - TLV Business Pulse`,
    description: metadata.description,
  };
}

export default function TemplatePage({ params }: TemplatePageProps) {
  const templateType = params.type as TemplateType;

  // Validate template type
  if (!isValidTemplateType(templateType)) {
    notFound();
  }

  // Get the template component
  const Template = getTemplate(templateType);
  const metadata = getTemplateMetadata(templateType);

  // Get sample data for this template
  const business = sampleBusinesses[templateType] || sampleBusinesses.professional;
  const generated = sampleGenerated[templateType] || sampleGenerated.professional;
  const templateData = sampleTemplateData[templateType] || {};

  return (
    <div className="min-h-screen">
      {/* Preview Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a
              href="/templates"
              className="px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition font-medium"
            >
              ← Back to Templates
            </a>
            <div>
              <div className="text-sm opacity-75">Template Preview</div>
              <div className="font-bold text-lg">{metadata.name}</div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <div className="text-sm opacity-75">
              This is a preview with sample data
            </div>
            <a
              href="/"
              className="px-6 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-opacity-90 transition"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>

      {/* Template Preview */}
      <Template business={business} generated={generated} {...templateData} />

      {/* Footer Info */}
      <div className="bg-gray-900 text-white py-8 px-4 border-t-4 border-blue-500">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to create your website?</h3>
          <p className="text-gray-300 mb-6">
            This template can be automatically customized for your business with AI-generated
            content, colors, and imagery.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="/"
              className="px-8 py-3 bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Start Building
            </a>
            <a
              href="/templates"
              className="px-8 py-3 border-2 border-white rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition"
            >
              View All Templates
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// Generate static paths for all templates at build time
export async function generateStaticParams() {
  return [
    { type: 'restaurant' },
    { type: 'beauty' },
    { type: 'professional_services' },
    { type: 'retail' },
    { type: 'fitness' },
    { type: 'tech' },
  ];
}
