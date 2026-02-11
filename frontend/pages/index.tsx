import { useRouter } from 'next/router';
import { Shield, Lock, Zap, Globe, CheckCircle, Star, ArrowRight } from 'lucide-react';

export default function Landing() {
  const router = useRouter();

  const handleLaunchWallet = () => {
    const token = localStorage.getItem('token');
    if (token) {
      // Already logged in, go to dashboard
      router.push('/dashboard');
    } else {
      // Not logged in, go to login page
      router.push('/login');
    }
  };

  const features = [
    {
      icon: Shield,
      title: 'Bank-Level Security',
      description: 'Your assets are protected with military-grade encryption and multi-layer security protocols.'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Experience instant transactions with our optimized blockchain infrastructure worldwide.'
    },
    {
      icon: Lock,
      title: 'Verified Transfers',
      description: 'Every external transaction is verified by our security team before processing.'
    },
    {
      icon: Globe,
      title: 'Multi-Currency Support',
      description: 'Trade Bitcoin, Ethereum, USDT, BNB, Polygon and more - all in one secure wallet.'
    }
  ];

  const testimonials = [
    {
      name: 'Arjun Krishnan',
      role: 'Crypto Investor',
      image: '👩‍💼',
      rating: 5,
      text: 'The security features are outstanding! I feel completely safe storing my crypto here. The Verified Transfers feature gives me peace of mind.'
    },
    {
      name: 'Vikram Singh',
      role: 'Day Trader',
      image: '👨‍💻',
      rating: 5,
      text: 'Best wallet I\'ve used. Transactions are instant, the interface is clean, and the real-time price tracking helps me make quick decisions.'
    },
    {
      name: 'Priya Ramachandran',
      role: 'Business Owner',
      image: '👩‍🦰',
      rating: 5,
      text: 'Finally, a wallet that prioritizes security without compromising on speed. The 99.9% success rate speaks for itself!'
    }
  ];

  const stats = [
    { value: '99.9%', label: 'Success Rate' },
    { value: '50K+', label: 'Active Users' },
    { value: '$2B+', label: 'Secured Assets' },
    { value: '24/7', label: 'Support' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-gray-900 to-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-purple-500/10"></div>
        
        {/* Navigation */}
        <nav className="relative z-10 flex items-center justify-between px-6 py-6">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Novatrixa Logo" className="w-12 h-12 rounded-full" />
            <span className="text-white text-2xl font-bold">Novatrixa</span>
          </div>
          <button
            onClick={handleLaunchWallet}
            className="text-primary hover:text-primary/80 font-semibold"
          >
            Sign In
          </button>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Your Crypto,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">
              Secured & Simple
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Experience the most secure and user-friendly cryptocurrency wallet. Trade, swap, and manage your digital assets with confidence.
          </p>
          
          <button
            onClick={handleLaunchWallet}
            className="bg-primary text-black px-10 py-5 rounded-full text-lg font-bold hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/30 hover:shadow-primary/50 inline-flex items-center gap-3 group"
          >
            Launch Wallet
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-4xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-white text-center mb-4">
          Why Choose Novatrixa?
        </h2>
        <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
          Built with cutting-edge technology and designed for both beginners and professionals
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-card border border-gray-800 rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-gradient-to-r from-primary/5 to-purple-500/5 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Security You Can Trust
              </h2>
              <div className="space-y-4">
                {[
                  'End-to-end encryption for all transactions',
                  'Multi-signature wallet protection',
                  'Real-time fraud detection system',
                  'Admin verification for external transfers',
                  'Cold storage for maximum security',
                  '24/7 security monitoring'
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-3xl p-8 backdrop-blur-sm border border-primary/30">
                <div className="bg-card rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Transaction Status</span>
                    <span className="text-primary text-sm font-semibold">Verified ✓</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-green-500 w-full animate-pulse"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div>
                      <div className="text-gray-500 text-xs mb-1">Encryption</div>
                      <div className="text-white font-semibold">256-bit</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs mb-1">Security Score</div>
                      <div className="text-primary font-semibold">A+</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-white text-center mb-4">
          Trusted by Thousands
        </h2>
        <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
          See what our users have to say about their experience
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="bg-card border border-gray-800 rounded-2xl p-6 hover:border-primary/50 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-purple-500 rounded-full flex items-center justify-center text-2xl">
                  {testimonial.image}
                </div>
                <div>
                  <div className="text-white font-semibold">{testimonial.name}</div>
                  <div className="text-gray-500 text-sm">{testimonial.role}</div>
                </div>
              </div>
              <div className="flex gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">{testimonial.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            Join thousands of users who trust Novatrixa for their crypto needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/signup')}
              className="bg-primary text-black px-10 py-5 rounded-full text-lg font-bold hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/30"
            >
              Create Free Account
            </button>
            <button
              onClick={handleLaunchWallet}
              className="bg-transparent border-2 border-primary text-primary px-10 py-5 rounded-full text-lg font-bold hover:bg-primary/10 transition-all duration-300"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Novatrixa Logo" className="w-10 h-10 rounded-full" />
              <span className="text-white text-xl font-bold">Novatrixa Wallet</span>
            </div>
            <div className="text-gray-500 text-sm">
              © 2026 Novatrixa. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
