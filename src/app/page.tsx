'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Hammer, 
  Calculator, 
  FileText, 
  Users, 
  MapPin, 
  Clock,
  ArrowRight,
  Star,
  Zap,
  Shield,
  Smartphone,
  TrendingUp,
  Award
} from 'lucide-react'

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleStartProject = () => {
    setIsLoading(true)
    // Navigate to customer wizard
    window.location.href = '/customer-wizard'
  }

  const features = [
    {
      icon: Calculator,
      title: 'Instant Estimates',
      description: 'Generate professional estimates in seconds with precise calculations',
      highlight: 'Save 2+ hours per estimate'
    },
    {
      icon: FileText,
      title: 'Smart Contracts',
      description: 'Auto-populated contracts with digital signatures and PDF export',
      highlight: 'Professional presentation'
    },
    {
      icon: Users,
      title: 'Team Coordination',
      description: 'Manage multiple crews and track project assignments',
      highlight: 'Scale your business'
    },
    {
      icon: MapPin,
      title: 'Location Tracking',
      description: 'GPS-enabled time tracking and jobsite verification',
      highlight: 'Accurate billing'
    },
    {
      icon: Clock,
      title: 'Time Management',
      description: 'Track labor hours and project timelines automatically',
      highlight: 'Boost productivity'
    },
    {
      icon: Smartphone,
      title: 'Mobile Optimized',
      description: 'Works perfectly on tablets and phones at the jobsite',
      highlight: 'Always accessible'
    }
  ]

  const floorTypes = [
    {
      name: 'Red Oak Hardwood',
      description: 'Classic American hardwood with distinctive grain patterns and warm tones',
      basePrice: '$8.50',
      gradient: 'from-amber-600 to-amber-800',
      textColor: 'text-amber-100'
    },
    {
      name: 'White Oak Premium',
      description: 'Premium hardwood with elegant light tones and superior durability',
      basePrice: '$9.25',
      gradient: 'from-stone-400 to-stone-600',
      textColor: 'text-stone-100'
    },
    {
      name: 'Commercial Linoleum',
      description: 'Durable, cost-effective flooring perfect for high-traffic areas',
      basePrice: '$4.75',
      gradient: 'from-slate-500 to-slate-700',
      textColor: 'text-slate-100'
    }
  ]

  const stats = [
    { value: '500+', label: 'Projects Completed', icon: Award },
    { value: '98%', label: 'Client Satisfaction', icon: Star },
    { value: '60%', label: 'Time Savings', icon: Zap },
    { value: '24/7', label: 'Mobile Access', icon: Shield }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-white/[0.03] bg-[radial-gradient(circle_at_center,_white_2px,_transparent_2px)] bg-[length:60px_60px]"></div>
        </div>
        
        <div className="relative py-20 sm:py-32 px-4">
          <div className="text-center max-w-6xl mx-auto">
            {/* Logo and Brand */}
            <div className="mb-12">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
                <Hammer className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-5xl sm:text-7xl font-bold text-white mb-6 tracking-tight">
                Lotus Contractor
              </h1>
              <p className="text-xl sm:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Transform your flooring business with intelligent project management, 
                instant estimates, and professional contract generation
              </p>
            </div>

            {/* Primary CTA */}
            <div className="mb-16">
              <Button 
                size="lg" 
                className="touch-target text-xl px-12 py-8 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-200"
                onClick={handleStartProject}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3" />
                    Loading...
                  </>
                ) : (
                  <>
                    Start Your Project
                    <ArrowRight className="ml-3 w-6 h-6" />
                  </>
                )}
              </Button>
              <p className="text-slate-400 mt-4 text-sm">No credit card required • Free demo available</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div 
                  key={stat.label}
                  className="text-center animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-center mb-3">
                    <stat.icon className="w-8 h-8 text-amber-400" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-slate-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Floor Types Showcase */}
      <section className="py-20 bg-white">
        <div className="text-center mb-16 px-4">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            Premium Flooring Solutions
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Professional-grade materials with transparent pricing and instant calculations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
          {floorTypes.map((floor, index) => (
            <div 
              key={floor.name}
              className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-slide-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className={`aspect-[4/3] bg-gradient-to-br ${floor.gradient} flex items-center justify-center relative`}>
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative text-center p-8">
                  <div className={`text-6xl font-bold ${floor.textColor} mb-2`}>
                    {floor.name.split(' ')[0]}
                  </div>
                  <div className={`text-xl ${floor.textColor} opacity-90`}>
                    {floor.name.split(' ').slice(1).join(' ')}
                  </div>
                </div>
              </div>
              <div className="p-8 bg-white">
                <h3 className="font-bold text-xl text-slate-900 mb-3">{floor.name}</h3>
                <p className="text-slate-600 mb-4 leading-relaxed">{floor.description}</p>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-amber-600">{floor.basePrice}<span className="text-sm text-slate-500">/sq ft</span></div>
                  <div className="text-sm text-slate-500">Starting price</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-slate-50">
        <div className="text-center mb-16 px-4">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            Everything You Need to Scale
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Comprehensive tools designed for modern flooring contractors who demand efficiency and professionalism
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start space-x-4">
                <div className="p-4 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600 mb-3 leading-relaxed">{feature.description}</p>
                  <div className="inline-flex items-center text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {feature.highlight}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mobile-First Showcase */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center mb-16 px-4">
          <h2 className="text-4xl font-bold text-white mb-6">
            Built for the Modern Jobsite
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Every feature optimized for mobile use with offline capabilities, 
            high contrast displays, and touch-first interactions
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto px-4">
          <div className="text-center group">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
              <Smartphone className="w-10 h-10 text-white" />
            </div>
            <h3 className="font-bold text-xl text-white mb-3">Touch Optimized</h3>
            <p className="text-slate-300 leading-relaxed">44px minimum touch targets with haptic feedback for perfect mobile interaction</p>
          </div>
          
          <div className="text-center group">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h3 className="font-bold text-xl text-white mb-3">Offline Ready</h3>
            <p className="text-slate-300 leading-relaxed">Progressive Web App technology ensures full functionality without internet connection</p>
          </div>
          
          <div className="text-center group">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <h3 className="font-bold text-xl text-white mb-3">Lightning Fast</h3>
            <p className="text-slate-300 leading-relaxed">Sub-3 second load times with high contrast displays for outdoor visibility</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="text-center px-4">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-12">
            Join hundreds of contractors who have streamlined their operations and increased profitability
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="touch-target text-lg px-8 py-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-xl shadow-lg"
              onClick={handleStartProject}
            >
              Start Free Demo
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="touch-target text-lg px-8 py-6 border-2 border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl"
            >
              Schedule Consultation
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 border-t border-slate-800">
        <div className="text-center px-4">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mr-3">
              <Hammer className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Lotus Contractor</span>
          </div>
          <p className="text-slate-400 mb-2">&copy; 2025 Lotus Contractor. All rights reserved.</p>
          <p className="text-slate-500 text-sm">Professional flooring contractor management platform</p>
        </div>
      </footer>
    </div>
  )
}
