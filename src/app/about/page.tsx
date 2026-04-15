'use client';

import { motion } from 'motion/react';
import { Leaf, Target, Users, ShieldCheck, Globe, Mail, MapPin, Phone } from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { label: 'Active Members', value: '50K+', icon: <Users className="text-emerald-500" /> },
    { label: 'Ideas Shared', value: '200K+', icon: <Leaf className="text-emerald-500" /> },
    { label: 'Countries', value: '120+', icon: <Globe className="text-emerald-500" /> },
    { label: 'Projects Funded', value: '15K+', icon: <Target className="text-emerald-500" /> },
  ];

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen pt-28">
      {/* Hero Section */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-emerald-50 dark:bg-emerald-950/20 -z-10 skew-y-3 origin-top-right"></div>
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-6 tracking-tighter">
              Our Mission is <span className="text-emerald-600">Sustainability</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto font-medium leading-relaxed">
              EcoSpark Hub is a global community dedicated to sharing, supporting, and implementing innovative ideas that protect our planet and ensure a greener future for everyone.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 dark:bg-gray-900 p-8 rounded-[32px] border border-gray-100 dark:border-gray-800 text-center"
            >
              <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                {stat.icon}
              </div>
              <div className="text-4xl font-black text-gray-900 dark:text-white mb-1 tracking-tighter">{stat.value}</div>
              <div className="text-xs font-black uppercase tracking-widest text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 px-6 bg-emerald-900 text-white rounded-[60px] mx-6 mb-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-black mb-8 tracking-tighter">Why We Started EcoSpark?</h2>
            <div className="space-y-6 text-emerald-100/80 font-medium leading-relaxed">
              <p>
                EcoSpark Hub was born out of a simple realization: thousands of brilliant environmental ideas never see the light of day because creators lack the platform to share them or the community to support them.
              </p>
              <p>
                We wanted to bridge that gap. By creating a space where anyone can post a sustainability project, get feedback, and even find funding, we are accelerating the transition to a sustainable world.
              </p>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://picsum.photos/seed/eco/800/600" 
              alt="Eco Community" 
              className="rounded-[48px] shadow-2xl border-4 border-emerald-800"
            />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4 tracking-tighter">Get In Touch</h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Have questions or want to collaborate? We&apos;d love to hear from you.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <Mail />, title: 'Email Us', detail: 'hello@ecospark.com' },
            { icon: <Phone />, title: 'Call Us', detail: '+1 (234) 567-890' },
            { icon: <MapPin />, title: 'Visit Us', detail: 'Green Valley, Eco City, 12345' },
          ].map((item, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 p-10 rounded-[40px] border border-gray-100 dark:border-gray-800 text-center hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/30 rounded-3xl flex items-center justify-center text-emerald-600 mx-auto mb-6">
                {item.icon}
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">{item.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 font-medium">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}