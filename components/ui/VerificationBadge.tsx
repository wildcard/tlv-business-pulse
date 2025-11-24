'use client';

import React, { useState } from 'react';
import { Badge } from './Badge';
import { Modal } from './Modal';
import { Card } from './Card';

interface VerificationBadgeProps {
  verified: boolean;
  licenseNumber?: string;
  dataSources?: string[];
  lastVerified?: Date;
  onReportIncorrect?: () => void;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  verified,
  licenseNumber,
  dataSources = [],
  lastVerified,
  onReportIncorrect,
}) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="inline-flex items-center"
      >
        <Badge
          variant={verified ? 'verified' : 'default'}
          icon={
            verified ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : null
          }
        >
          {verified ? 'Verified Business' : 'Unverified'}
        </Badge>
      </button>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Business Verification"
        size="lg"
      >
        <div className="space-y-6">
          {verified ? (
            <>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-gray-900 mb-1">This business is verified</h4>
                  <p className="text-gray-600">
                    We've confirmed this business exists and the information is accurate based on official sources.
                  </p>
                </div>
              </div>

              {licenseNumber && (
                <Card padding="md">
                  <div className="text-sm">
                    <div className="font-semibold text-gray-700 mb-1">Business License Number</div>
                    <div className="text-gray-900 font-mono">{licenseNumber}</div>
                  </div>
                </Card>
              )}

              {dataSources.length > 0 && (
                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">Data Sources</h5>
                  <ul className="space-y-2">
                    {dataSources.map((source, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{source}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {lastVerified && (
                <div className="text-sm text-gray-600">
                  Last verified: {lastVerified.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 mb-2">How We Verify</h5>
                <p className="text-sm text-gray-600">
                  We cross-reference data from Tel Aviv Municipality business registry, government databases,
                  and other official sources to ensure accuracy. Our AI system automatically updates this
                  information regularly.
                </p>
              </div>

              {onReportIncorrect && (
                <button
                  onClick={onReportIncorrect}
                  className="text-red-600 hover:text-red-700 font-medium text-sm"
                >
                  Report incorrect information
                </button>
              )}
            </>
          ) : (
            <div>
              <p className="text-gray-600 mb-4">
                This business has not yet been verified through our official sources. This doesn't mean
                the business is illegitimate - it may be new or pending verification.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  If you own this business, you can claim it and verify your information to display
                  the verified badge.
                </p>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};
