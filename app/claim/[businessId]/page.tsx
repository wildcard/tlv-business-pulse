'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

type Step = 'verify' | 'account' | 'customize' | 'complete';

interface ClaimFlowProps {
  params: {
    businessId: string;
  };
}

export default function ClaimBusinessPage({ params }: ClaimFlowProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>('verify');
  const [verificationType, setVerificationType] = useState<'phone' | 'email'>('phone');
  const [verificationCode, setVerificationCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock business data
  const businessData = {
    name: 'Sabich King',
    address: '23 Herzl Street, Florentin, Tel Aviv',
    category: 'Fast Food Restaurant',
    registeredPhone: '+972-52-***-**34',
    registeredEmail: 'he***@sa*****.com',
  };

  const steps = [
    { id: 'verify' as Step, name: 'Verify Ownership', number: 1 },
    { id: 'account' as Step, name: 'Create Account', number: 2 },
    { id: 'customize' as Step, name: 'Customize', number: 3 },
    { id: 'complete' as Step, name: 'Complete', number: 4 },
  ];

  const getCurrentStepIndex = () => steps.findIndex(s => s.id === currentStep);

  const handleSendCode = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    alert(`Verification code sent to your ${verificationType}`);
  };

  const handleVerifyCode = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    if (verificationCode.length === 6) {
      setCurrentStep('account');
    } else {
      alert('Invalid code');
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Claim Your Business
              </h1>
              <p className="text-gray-600">
                Follow these steps to claim and customize your website
              </p>
            </div>

            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex-1 relative">
                    <div className="flex items-center">
                      {/* Step Circle */}
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full font-bold z-10 ${
                          index <= getCurrentStepIndex()
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-300 text-gray-600'
                        }`}
                      >
                        {index < getCurrentStepIndex() ? (
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          step.number
                        )}
                      </div>

                      {/* Line */}
                      {index < steps.length - 1 && (
                        <div
                          className={`flex-1 h-1 mx-2 ${
                            index < getCurrentStepIndex() ? 'bg-primary-600' : 'bg-gray-300'
                          }`}
                        />
                      )}
                    </div>

                    {/* Step Name */}
                    <div
                      className={`mt-2 text-xs font-medium ${
                        index <= getCurrentStepIndex() ? 'text-primary-600' : 'text-gray-500'
                      }`}
                    >
                      {step.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Business Info Card */}
            <Card padding="lg" className="mb-8">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{businessData.name}</h2>
                  <p className="text-gray-600 mb-1">{businessData.address}</p>
                  <Badge variant="primary">{businessData.category}</Badge>
                </div>
                <a href={`/business/${params.businessId}`} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">
                    Preview Website
                  </Button>
                </a>
              </div>
            </Card>

            {/* Step Content */}
            {currentStep === 'verify' && (
              <VerifyStep
                businessData={businessData}
                verificationType={verificationType}
                setVerificationType={setVerificationType}
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
                email={email}
                setEmail={setEmail}
                verificationCode={verificationCode}
                setVerificationCode={setVerificationCode}
                loading={loading}
                onSendCode={handleSendCode}
                onVerify={handleVerifyCode}
              />
            )}

            {currentStep === 'account' && (
              <AccountStep onNext={() => setCurrentStep('customize')} />
            )}

            {currentStep === 'customize' && (
              <CustomizeStep onNext={() => setCurrentStep('complete')} />
            )}

            {currentStep === 'complete' && (
              <CompleteStep businessId={params.businessId} />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function VerifyStep({
  businessData,
  verificationType,
  setVerificationType,
  phoneNumber,
  setPhoneNumber,
  email,
  setEmail,
  verificationCode,
  setVerificationCode,
  loading,
  onSendCode,
  onVerify,
}: any) {
  const [codeSent, setCodeSent] = useState(false);

  return (
    <Card padding="lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Verify Your Ownership</h2>
      <p className="text-gray-600 mb-6">
        To claim this business, we need to verify you're the owner. Choose your verification method:
      </p>

      {/* Verification Type Selection */}
      {!codeSent && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => setVerificationType('phone')}
              className={`p-6 border-2 rounded-lg text-left transition-all ${
                verificationType === 'phone'
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start">
                <svg className="w-6 h-6 text-primary-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Phone Verification</h3>
                  <p className="text-sm text-gray-600">
                    We'll send a code to {businessData.registeredPhone}
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setVerificationType('email')}
              className={`p-6 border-2 rounded-lg text-left transition-all ${
                verificationType === 'email'
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start">
                <svg className="w-6 h-6 text-primary-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Email Verification</h3>
                  <p className="text-sm text-gray-600">
                    We'll send a code to {businessData.registeredEmail}
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* Phone/Email Input */}
          <div className="mb-6">
            {verificationType === 'phone' ? (
              <Input
                label="Enter your phone number"
                type="tel"
                placeholder="+972-XX-XXX-XXXX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                fullWidth
                helperText="Must match the registered phone number"
              />
            ) : (
              <Input
                label="Enter your email address"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                helperText="Must match the registered email address"
              />
            )}
          </div>

          <Button
            variant="primary"
            fullWidth
            loading={loading}
            onClick={() => {
              onSendCode();
              setCodeSent(true);
            }}
          >
            Send Verification Code
          </Button>
        </>
      )}

      {/* Code Verification */}
      {codeSent && (
        <>
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800">
              Verification code sent to your {verificationType}. Please check and enter it below.
            </p>
          </div>

          <Input
            label="Verification Code"
            placeholder="Enter 6-digit code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            fullWidth
            maxLength={6}
            className="text-center text-2xl tracking-widest"
          />

          <div className="mt-6 flex gap-3">
            <Button variant="outline" fullWidth onClick={() => setCodeSent(false)}>
              Resend Code
            </Button>
            <Button
              variant="primary"
              fullWidth
              loading={loading}
              onClick={onVerify}
              disabled={verificationCode.length !== 6}
            >
              Verify & Continue
            </Button>
          </div>
        </>
      )}
    </Card>
  );
}

function AccountStep({ onNext }: { onNext: () => void }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <Card padding="lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Create Your Account</h2>
      <p className="text-gray-600 mb-6">
        Set up your account credentials to manage your business website.
      </p>

      <div className="space-y-4 mb-6">
        <Input
          label="Full Name"
          placeholder="John Doe"
          fullWidth
        />
        <Input
          label="Password"
          type="password"
          placeholder="Create a strong password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          helperText="Minimum 8 characters"
        />
        <Input
          label="Confirm Password"
          type="password"
          placeholder="Repeat your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          fullWidth
        />
      </div>

      <label className="flex items-center mb-6">
        <input type="checkbox" className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" />
        <span className="ml-2 text-sm text-gray-700">
          I agree to the <a href="/terms" className="text-primary-600 hover:underline">Terms of Service</a> and <a href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</a>
        </span>
      </label>

      <Button variant="primary" fullWidth onClick={onNext}>
        Create Account & Continue
      </Button>
    </Card>
  );
}

function CustomizeStep({ onNext }: { onNext: () => void }) {
  return (
    <Card padding="lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Customization</h2>
      <p className="text-gray-600 mb-6">
        Let's add some personal touches to your website. You can always change these later.
      </p>

      <div className="space-y-6 mb-6">
        {/* Upload Photo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add Your First Photo
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-600 transition-colors cursor-pointer">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <p className="text-gray-600">Click to upload or drag and drop</p>
            <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 10MB</p>
          </div>
        </div>

        {/* Color Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Choose Your Brand Color (Optional)
          </label>
          <div className="flex gap-3">
            {['#2563eb', '#7c3aed', '#10b981', '#f59e0b', '#ef4444', '#6b7280'].map((color) => (
              <button
                key={color}
                className="w-12 h-12 rounded-lg border-2 border-gray-200 hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" fullWidth>
          Skip for Now
        </Button>
        <Button variant="primary" fullWidth onClick={onNext}>
          Save & Continue
        </Button>
      </div>
    </Card>
  );
}

function CompleteStep({ businessId }: { businessId: string }) {
  return (
    <Card padding="lg" className="text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </div>

      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Congratulations!
      </h2>
      <p className="text-gray-600 mb-8 text-lg">
        Your business website is now live and ready to attract customers.
      </p>

      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h3 className="font-semibold text-gray-900 mb-3">What's Next?</h3>
        <ul className="text-left space-y-2 text-gray-600">
          <li className="flex items-start">
            <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Add more photos and details to your website
          </li>
          <li className="flex items-start">
            <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Share your website link with customers
          </li>
          <li className="flex items-start">
            <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Track your website performance in analytics
          </li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <a href={`/business/${businessId}`} target="_blank" rel="noopener noreferrer" className="flex-1">
          <Button variant="outline" fullWidth>
            View Your Website
          </Button>
        </a>
        <a href="/dashboard/business" className="flex-1">
          <Button variant="primary" fullWidth>
            Go to Dashboard
          </Button>
        </a>
      </div>
    </Card>
  );
}
