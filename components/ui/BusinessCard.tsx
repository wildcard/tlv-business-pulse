import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from './Badge';
import { Card } from './Card';

interface BusinessCardProps {
  slug: string;
  name: string;
  category: string;
  address: string;
  imageUrl?: string;
  verified?: boolean;
  description?: string;
  tags?: string[];
}

export const BusinessCard: React.FC<BusinessCardProps> = ({
  slug,
  name,
  category,
  address,
  imageUrl,
  verified = false,
  description,
  tags = [],
}) => {
  return (
    <Link href={`/business/${slug}`}>
      <Card hover padding="none" className="overflow-hidden h-full">
        {/* Image */}
        <div className="relative h-48 bg-gray-200">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-secondary-100">
              <span className="text-4xl">{getCategoryIcon(category)}</span>
            </div>
          )}
          {verified && (
            <div className="absolute top-3 right-3">
              <Badge variant="verified" icon={
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              }>
                Verified
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{name}</h3>
          </div>

          <Badge variant="primary" size="sm" className="mb-2">
            {category}
          </Badge>

          {description && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {description}
            </p>
          )}

          <div className="flex items-start text-sm text-gray-500 mb-3">
            <svg className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="line-clamp-1">{address}</span>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="default" size="sm">
                  {tag}
                </Badge>
              ))}
              {tags.length > 3 && (
                <Badge variant="default" size="sm">
                  +{tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 pb-4">
          <div className="text-primary-600 font-semibold text-sm flex items-center">
            View Website
            <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Card>
    </Link>
  );
};

function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    'restaurant': '🍽️',
    'cafe': '☕',
    'salon': '💇',
    'tech': '💻',
    'retail': '🛍️',
    'fitness': '💪',
    'health': '🏥',
    'education': '📚',
    'entertainment': '🎭',
    'service': '🔧',
  };

  const key = Object.keys(icons).find(k => category.toLowerCase().includes(k));
  return key ? icons[key] : '🏢';
}
