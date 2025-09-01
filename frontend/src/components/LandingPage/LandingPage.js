import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { t } from '../../utils/i18n';
import './LandingPage.css';

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: '💰',
      title: 'Expense Tracking',
      description: 'Easily log and categorize your expenses. Get detailed insights into where your money goes with smart categorization.'
    },
    {
      icon: '🔔',
      title: 'Budget Alerts',
      description: 'Set spending limits and get instant notifications when you\'re approaching or exceeding your budget categories.'
    },
    {
      icon: '📈',
      title: 'Visual Analytics',
      description: 'Beautiful charts and graphs help you understand your spending patterns and identify areas for improvement.'
    }
  ];

  const scrollToSection = (sectionId) => {
    // Sanitize input to prevent code injection
    const allowedSections = ['features', 'testimonials'];
    if (allowedSections.includes(sectionId)) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="landing-container min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Navigation */}
      <nav className={`${scrolled ? 'bg-white/95 shadow-lg' : 'bg-white/80'} backdrop-blur-sm border-b border-secondary-200 sticky top-0 z-50 transition-all duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-primary-600">FinanceTracker</h1>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <button onClick={() => scrollToSection('features')} className="text-secondary-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Features
                </button>
                <button onClick={() => scrollToSection('testimonials')} className="text-secondary-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Reviews
                </button>
                <Link to="/login" className="text-secondary-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  {t('Login')}
                </Link>
                <Link to="/register" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors transform hover:scale-105">
                  Get Started
                </Link>
              </div>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-secondary-600 hover:text-primary-600 p-2 rounded-md transition-colors"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-secondary-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button onClick={() => { scrollToSection('features'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-secondary-600 hover:text-primary-600 transition-colors">
                Features
              </button>
              <button onClick={() => { scrollToSection('testimonials'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-secondary-600 hover:text-primary-600 transition-colors">
                Reviews
              </button>
              <Link to="/login" className="block px-3 py-2 text-secondary-600 hover:text-primary-600 transition-colors">
                {t('Login')}
              </Link>
              <Link to="/register" className="block px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-secondary-900 mb-6 animate-fade-in">
              {t('Take Control of Your Finances') || 'Take Control of Your'}
              <span className="text-primary-600 block">Financial Future</span>
            </h1>
            <p className="text-xl text-secondary-600 mb-8 max-w-3xl mx-auto">
              Track expenses, set budgets, and visualize your spending patterns with our intuitive personal finance tracker. 
              Make smarter financial decisions with real-time insights and alerts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/register" 
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1"
              >
                Start Budgeting Now
              </Link>
              <Link 
                to="/login" 
                className="border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
        
        {/* Hero Image Placeholder */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="aspect-video bg-gradient-to-r from-primary-100 to-secondary-100 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">📊</div>
                <p className="text-secondary-600 text-lg">Interactive Dashboard Preview</p>
                <p className="text-secondary-500 text-sm">Beautiful charts and analytics at your fingertips</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Everything You Need to Master Your Finances
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Powerful features designed to help you track, analyze, and optimize your spending habits.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`text-center p-6 rounded-xl transition-all duration-500 transform hover:scale-105 cursor-pointer ${
                  activeFeature === index ? 'bg-primary-50 shadow-lg' : 'hover:bg-secondary-50'
                }`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 ${
                  activeFeature === index ? 'bg-primary-200 scale-110' : 'bg-primary-100'
                }`}>
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">{feature.title}</h3>
                <p className="text-secondary-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshots Section */}
      <section className="py-24 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              See It In Action
            </h2>
            <p className="text-xl text-secondary-600">
              Clean, intuitive interface that makes managing your finances effortless.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="aspect-video bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl flex items-center justify-center mb-4">
                <div className="text-center">
                  <div className="text-4xl mb-2">📱</div>
                  <p className="text-secondary-600">Dashboard View</p>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">Overview Dashboard</h3>
              <p className="text-secondary-600">Get a quick snapshot of your financial health with key metrics and recent transactions.</p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="aspect-video bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl flex items-center justify-center mb-4">
                <div className="text-center">
                  <div className="text-4xl mb-2">📊</div>
                  <p className="text-secondary-600">Analytics View</p>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">Detailed Analytics</h3>
              <p className="text-secondary-600">Dive deep into your spending patterns with interactive charts and reports.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-secondary-600">
              Join thousands of users who have transformed their financial lives.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Small Business Owner',
                quote: 'This app helped me finally get control of my business expenses. The budget alerts are a game-changer!',
                rating: 5
              },
              {
                name: 'Mike Chen',
                role: 'Software Developer', 
                quote: 'The visual analytics are incredible. I can see exactly where my money goes and make better decisions.',
                rating: 5
              },
              {
                name: 'Emily Rodriguez',
                role: 'Graduate Student',
                quote: 'Perfect for managing my student budget. Simple to use but powerful enough for all my needs.',
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-secondary-50 rounded-2xl p-6 hover:bg-secondary-100 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-lg">👤</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-secondary-900">{testimonial.name}</h4>
                    <p className="text-secondary-600 text-sm">{testimonial.role}</p>
                    <div className="flex mt-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-sm">★</span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-secondary-700 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Financial Life?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have already taken control of their finances. 
            Start your journey to financial freedom today.
          </p>
          <Link 
            to="/register" 
            className="bg-white text-primary-600 hover:bg-secondary-50 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl inline-block transform hover:scale-105 hover:-translate-y-1"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold text-primary-400 mb-4">FinanceTracker</h3>
              <p className="text-secondary-300 mb-4">
                Your personal finance companion. Track expenses, set budgets, and achieve your financial goals with ease.
              </p>
              <div className="flex space-x-4">
                <button 
                  onClick={() => window.open('https://github.com', '_blank')}
                  className="text-secondary-300 hover:text-primary-400 transition-all duration-300 transform hover:scale-110"
                >
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </button>
                <button 
                  onClick={() => window.location.href = 'mailto:contact@financetracker.com'}
                  className="text-secondary-300 hover:text-primary-400 transition-all duration-300 transform hover:scale-110"
                >
                  <span className="sr-only">Email</span>
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><button onClick={() => scrollToSection('features')} className="text-secondary-300 hover:text-primary-400 transition-colors">Features</button></li>
                <li><button onClick={() => alert('Pricing coming soon!')} className="text-secondary-300 hover:text-primary-400 transition-colors">Pricing</button></li>
                <li><button onClick={() => alert('Security info: We use industry-standard encryption and security practices.')} className="text-secondary-300 hover:text-primary-400 transition-colors">Security</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><button onClick={() => alert('Help Center coming soon!')} className="text-secondary-300 hover:text-primary-400 transition-colors">Help Center</button></li>
                <li><button onClick={() => window.location.href = 'mailto:support@financetracker.com'} className="text-secondary-300 hover:text-primary-400 transition-colors">Contact Us</button></li>
                <li><button onClick={() => alert('Privacy Policy: We respect your privacy and protect your data.')} className="text-secondary-300 hover:text-primary-400 transition-colors">Privacy Policy</button></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-secondary-700 mt-8 pt-8 text-center">
            <p className="text-secondary-400">
              © 2024 FinanceTracker. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

