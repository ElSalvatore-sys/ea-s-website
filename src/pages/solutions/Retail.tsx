import React from 'react';
import { ShoppingCart, TrendingUp, Users, Package, Brain, Smartphone } from 'lucide-react';
import { useLanguage } from '../../providers/LanguageProvider';

const Retail: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-500 to-violet-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <ShoppingCart className="h-12 w-12" />
                <h1 className="text-4xl md:text-5xl font-bold">{t('retail.hero.title')}</h1>
              </div>
              <p className="text-xl text-purple-100 mb-8">
                {t('retail.hero.subtitle')}
              </p>
              <button 
                onClick={() => {
                  const event = new CustomEvent('openBookingModal');
                  window.dispatchEvent(event);
                }}
                className="bg-white text-purple-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-purple-50 transition-colors duration-300"
              >
                {t('retail.hero.cta')}
              </button>
            </div>
            <div className="bg-white bg-opacity-10 rounded-2xl p-8 backdrop-blur-sm">
              <img 
                src="https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750" 
                alt="Modern retail store with digital displays" 
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Key Solutions */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('retail.solutions.title')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('retail.solutions.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: 'Personalized Recommendations',
                description: 'AI-powered recommendation engines that analyze customer behavior to suggest relevant products and increase sales.',
                features: ['Behavioral analysis', 'Product matching', 'Cross-selling optimization', 'Real-time personalization']
              },
              {
                icon: Package,
                title: 'Inventory Intelligence',
                description: 'Smart inventory management that predicts demand, optimizes stock levels, and reduces waste.',
                features: ['Demand forecasting', 'Stock optimization', 'Automated reordering', 'Waste reduction']
              },
              {
                icon: Users,
                title: 'Customer Service Automation',
                description: 'Intelligent chatbots and virtual assistants that provide 24/7 customer support and order assistance.',
                features: ['Automated customer support', 'Order tracking', 'FAQ automation', 'Multi-channel integration']
              },
              {
                icon: TrendingUp,
                title: 'Sales Analytics & Insights',
                description: 'Advanced analytics that provide deep insights into customer behavior, sales trends, and market opportunities.',
                features: ['Sales trend analysis', 'Customer segmentation', 'Market insights', 'Performance metrics']
              },
              {
                icon: Smartphone,
                title: 'Omnichannel Experience',
                description: 'Seamless integration across all sales channels for a unified customer experience.',
                features: ['Channel integration', 'Unified customer profiles', 'Cross-channel inventory', 'Consistent experience']
              },
              {
                icon: ShoppingCart,
                title: 'Dynamic Pricing',
                description: 'AI-driven pricing strategies that optimize revenue while maintaining competitiveness.',
                features: ['Price optimization', 'Competitor analysis', 'Demand-based pricing', 'Revenue maximization']
              }
            ].map((solution, index) => {
              const IconComponent = solution.icon;
              return (
                <div key={index} className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow duration-300">
                  <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                    <IconComponent className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{solution.title}</h3>
                  <p className="text-gray-600 mb-6">{solution.description}</p>
                  <ul className="space-y-2">
                    {solution.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-600 rounde-full"></div>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Performance Metrics */}
      <section className="py-20 bg-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('retail.results.title')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('retail.results.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                metric: '45%',
                description: 'Increase in conversion rates',
                icon: TrendingUp
              },
              {
                metric: '30%',
                description: 'Boost in average order value',
                icon: ShoppingCart
              },
              {
                metric: '60%',
                description: 'Reduction in inventory costs',
                icon: Package
              },
              {
                metric: '85%',
                description: 'Customer satisfaction improvement',
                icon: Users
              }
            ].map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-8 text-center shadow-lg">
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="text-4xl font-bold text-purple-600 mb-2">{stat.metric}</div>
                  <p className="text-gray-600">{stat.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Retail AI Use Cases</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how our AI solutions can be applied across different retail scenarios to drive growth and efficiency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: 'Fashion & Apparel',
                description: 'Style recommendations based on customer preferences, seasonal trends, and inventory availability.',
                features: ['Style matching', 'Trend analysis', 'Size recommendations', 'Virtual try-on']
              },
              {
                title: 'Electronics & Tech',
                description: 'Product comparisons, compatibility checks, and technical support automation.',
                features: ['Product comparison', 'Compatibility analysis', 'Tech support bots', 'Warranty management']
              },
              {
                title: 'Grocery & Food',
                description: 'Meal planning, dietary recommendations, and fresh inventory optimization.',
                features: ['Meal planning AI', 'Dietary analysis', 'Freshness tracking', 'Recipe suggestions']
              },
              {
                title: 'Home & Garden',
                description: 'Project recommendations, seasonal planning, and maintenance scheduling.',
                features: ['Project planning', 'Seasonal recommendations', 'Maintenance alerts', 'DIY assistance']
              }
            ].map((useCase, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{useCase.title}</h3>
                <p className="text-gray-600 mb-6">{useCase.description}</p>
                <ul className="space-y-2">
                  {useCase.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Partners */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Seamless Platform Integration</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our retail AI solutions integrate seamlessly with leading e-commerce platforms and retail management systems.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              'Shopify',
              'WooCommerce',
              'Magento',
              'Salesforce Commerce',
              'BigCommerce',
              'SAP Commerce',
              'Oracle Retail',
              'Microsoft Dynamics',
              'Lightspeed',
              'Square',
              'Stripe',
              'PayPal'
            ].map((platform, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-4 text-center hover:bg-gray-700 transition-colors duration-300">
                <span className="font-semibold text-gray-300">{platform}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-purple-500 to-violet-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">{t('retail.cta.title')}</h2>
          <p className="text-xl text-purple-100 mb-8">
            {t('retail.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => {
                const event = new CustomEvent('openBookingModal');
                window.dispatchEvent(event);
              }}
              className="bg-white text-purple-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-purple-50 transition-colors duration-300"
            >
              {t('retail.cta.demo')}
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-purple-600 transition-all duration-300">
              {t('retail.cta.guide')}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Retail;