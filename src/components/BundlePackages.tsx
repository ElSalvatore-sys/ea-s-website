import React, { useState } from 'react';
import { 
  Package, 
  CheckCircle, 
  Star, 
  Clock, 
  TrendingUp,
  Zap,
  Shield,
  Users,
  DollarSign,
  Percent,
  Gift
} from 'lucide-react';

interface BundlePackage {
  id: string;
  name: string;
  description: string;
  services: string[];
  originalPrice: number;
  bundlePrice: number;
  monthlyPrice?: number;
  annualDiscount?: number;
  savings: number;
  savingsPercent: number;
  popular: boolean;
  deliveryTime: string;
  features: string[];
  gradient: string;
}

const BundlePackages: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  const bundles: BundlePackage[] = [
    {
      id: 'starter-bundle',
      name: 'Digital Starter Bundle',
      description: 'Perfect package for small businesses going digital',
      services: ['Website Development', 'Basic AI Chatbot', 'SEO Setup'],
      originalPrice: 5997,
      bundlePrice: 3997,
      monthlyPrice: 199,
      annualDiscount: 20,
      savings: 2000,
      savingsPercent: 33,
      popular: false,
      deliveryTime: '3-4 weeks',
      features: [
        'Custom 5-page website',
        'Basic AI chatbot integration',
        'SEO optimization',
        'Mobile responsive design',
        '3 months support',
        'Google Analytics setup',
        'Social media integration',
        'Contact form setup'
      ],
      gradient: 'from-green-500 to-teal-600'
    },
    {
      id: 'growth-bundle',
      name: 'Growth Accelerator Bundle',
      description: 'Complete solution for scaling businesses',
      services: ['Website + Mobile App', 'Advanced AI Chatbot', 'Booking System', 'Analytics'],
      originalPrice: 14997,
      bundlePrice: 9997,
      monthlyPrice: 499,
      annualDiscount: 25,
      savings: 5000,
      savingsPercent: 33,
      popular: true,
      deliveryTime: '6-8 weeks',
      features: [
        'Custom website (15 pages)',
        'Mobile app (iOS & Android)',
        'Advanced AI chatbot with NLP',
        'Smart booking system',
        'Analytics dashboard',
        'Payment integration',
        '6 months support',
        'Staff training included',
        'API development',
        'Performance optimization'
      ],
      gradient: 'from-blue-600 to-purple-600'
    },
    {
      id: 'enterprise-bundle',
      name: 'Enterprise Transformation Bundle',
      description: 'Complete digital transformation package',
      services: ['Full Stack Development', 'AI Suite', 'Business Intelligence', 'Custom Integrations'],
      originalPrice: 34997,
      bundlePrice: 24997,
      monthlyPrice: 1249,
      annualDiscount: 30,
      savings: 10000,
      savingsPercent: 29,
      popular: false,
      deliveryTime: '10-12 weeks',
      features: [
        'Custom web application',
        'Mobile apps for all platforms',
        'Complete AI integration suite',
        'Business intelligence platform',
        'Custom booking & CRM system',
        'Multi-language support',
        '12 months priority support',
        'Dedicated project manager',
        'Advanced security features',
        'Scalable cloud architecture',
        'Third-party integrations',
        'Performance guarantees'
      ],
      gradient: 'from-purple-600 to-pink-600'
    }
  ];

  const calculatePrice = (bundle: BundlePackage) => {
    if (billingCycle === 'monthly' && bundle.monthlyPrice) {
      return bundle.monthlyPrice;
    }
    if (billingCycle === 'annual' && bundle.annualDiscount) {
      const annualPrice = bundle.bundlePrice * (1 - bundle.annualDiscount / 100);
      return Math.round(annualPrice);
    }
    return bundle.bundlePrice;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-2 rounded-full mb-4">
            <Gift className="h-5 w-5" />
            <span className="font-medium">Limited Time Offer</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Bundle & Save Up to 33%
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
            Combine multiple services for maximum value and faster implementation
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-lg ${billingCycle === 'monthly' ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className="relative w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded-full transition-colors duration-300"
            >
              <div
                className={`absolute top-1 w-6 h-6 bg-blue-600 rounded-full transition-transform duration-300 ${
                  billingCycle === 'annual' ? 'translate-x-8' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-lg ${billingCycle === 'annual' ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-500'}`}>
              Annual
              <span className="ml-2 text-green-600 dark:text-green-400 font-bold">Save up to 30%</span>
            </span>
          </div>
        </div>

        {/* Bundle Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {bundles.map((bundle) => (
            <div
              key={bundle.id}
              className={`relative bg-white dark:bg-gray-900 rounded-3xl overflow-hidden transform transition-all duration-500 hover:-translate-y-2 ${
                bundle.popular 
                  ? 'shadow-2xl scale-105 border-2 border-blue-500' 
                  : 'shadow-xl hover:shadow-2xl border border-gray-200 dark:border-gray-700'
              }`}
            >
              {/* Popular Badge */}
              {bundle.popular && (
                <div className="absolute -top-1 -right-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-16 py-2 transform rotate-45 text-sm font-bold shadow-lg">
                  BEST VALUE
                </div>
              )}

              {/* Card Header */}
              <div className={`bg-gradient-to-br ${bundle.gradient} p-8 text-white`}>
                <div className="flex items-center justify-between mb-4">
                  <Package className="h-10 w-10" />
                  <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                    Save {bundle.savingsPercent}%
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-2">{bundle.name}</h3>
                <p className="text-white/90 text-sm">{bundle.description}</p>
              </div>

              {/* Pricing */}
              <div className="p-8">
                <div className="mb-6">
                  <div className="flex items-baseline space-x-2 mb-2">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      {formatPrice(calculatePrice(bundle))}
                    </span>
                    {billingCycle === 'monthly' && bundle.monthlyPrice && (
                      <span className="text-gray-500">/month</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <span className="text-gray-500 line-through">
                      {formatPrice(bundle.originalPrice)}
                    </span>
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      You save {formatPrice(bundle.savings)}
                    </span>
                  </div>
                  {billingCycle === 'annual' && bundle.annualDiscount && (
                    <div className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                      Additional {bundle.annualDiscount}% off with annual billing
                    </div>
                  )}
                </div>

                {/* Included Services */}
                <div className="mb-6">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Included Services:
                  </div>
                  <div className="space-y-2">
                    {bundle.services.map((service, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Everything you get:
                  </div>
                  <ul className="space-y-2 max-h-48 overflow-y-auto">
                    {bundle.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Star className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Delivery Time */}
                <div className="flex items-center justify-center space-x-2 mb-6 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Delivery: {bundle.deliveryTime}
                  </span>
                </div>

                {/* CTA Button */}
                <button
                  className={`w-full py-4 rounded-full font-medium transition-all duration-300 ${
                    bundle.popular
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Get This Bundle
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Value Props */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-3xl p-8 lg:p-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">Best Value</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Save up to 33% compared to individual services
              </p>
            </div>
            <div>
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">Faster Delivery</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Bundled services are implemented together for speed
              </p>
            </div>
            <div>
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">Guaranteed Results</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                100% satisfaction guarantee or your money back
              </p>
            </div>
            <div>
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">Priority Support</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Bundle customers get priority support and updates
              </p>
            </div>
          </div>
        </div>

        {/* Limited Time Offer Banner */}
        <div className="mt-12 bg-gradient-to-r from-green-600 to-teal-600 rounded-3xl p-8 text-white text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Percent className="h-8 w-8" />
            <h3 className="text-2xl font-bold">Limited Time: Extra 10% Off All Bundles</h3>
          </div>
          <p className="text-green-100 mb-6">
            Use code <span className="font-mono bg-white/20 px-3 py-1 rounded">BUNDLE2024</span> at checkout
          </p>
          <div className="flex items-center justify-center space-x-4">
            <button className="bg-white text-green-600 px-8 py-3 rounded-full font-medium hover:bg-green-50 transition-colors">
              Claim Your Bundle Now
            </button>
            <span className="text-green-100">Offer ends in 48 hours</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BundlePackages;