import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Briefcase, MessageSquare,
  Github, Star, ArrowRight, Globe, ShieldCheck
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 24 } },
};

const features = [
  {
    icon: Users,
    title: 'Developer Feed',
    description: 'Discover developers who match your stack and interests. Swipe through profiles in a modern, interactive feed — built for engineers, not recruiters.',
    color: 'from-violet-500/20 to-indigo-500/10',
    border: 'border-violet-500/20',
    iconColor: 'text-violet-400',
  },
  {
    icon: Briefcase,
    title: 'Job Board',
    description: 'Browse curated engineering roles across India\'s top tech companies — from startups to FAANG — filtered by your domain and location.',
    color: 'from-cyan-500/20 to-blue-500/10',
    border: 'border-cyan-500/20',
    iconColor: 'text-cyan-400',
  },
  {
    icon: MessageSquare,
    title: 'Real-time Chat',
    description: 'Connect and collaborate with developers directly. Share code snippets, discuss ideas, and build meaningful professional relationships.',
    color: 'from-emerald-500/20 to-teal-500/10',
    border: 'border-emerald-500/20',
    iconColor: 'text-emerald-400',
  },
  {
    icon: Globe,
    title: 'Community',
    description: 'Engage with a community of developers. Share projects, ask questions, get feedback, and stay updated on what the ecosystem is building.',
    color: 'from-orange-500/20 to-amber-500/10',
    border: 'border-orange-500/20',
    iconColor: 'text-orange-400',
  },
  {
    icon: Github,
    title: 'GitHub Integration',
    description: 'Automatically showcase your repositories directly on your profile. Let your work speak — no manual updates needed.',
    color: 'from-pink-500/20 to-rose-500/10',
    border: 'border-pink-500/20',
    iconColor: 'text-pink-400',
  },
  {
    icon: ShieldCheck,
    title: 'Secure by Design',
    description: 'Firebase-powered authentication with JWT-protected APIs. Your data is yours — stored securely in a production-grade PostgreSQL database.',
    color: 'from-yellow-500/20 to-lime-500/10',
    border: 'border-yellow-500/20',
    iconColor: 'text-yellow-400',
  },
];



function FeatureCard({ feature, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const Icon = feature.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, type: 'spring', stiffness: 200, damping: 20 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`relative bg-gradient-to-br ${feature.color} border ${feature.border} rounded-3xl p-6 backdrop-blur-sm group cursor-default`}
    >
      <div className={`w-11 h-11 rounded-2xl bg-surface/80 border ${feature.border} flex items-center justify-center mb-4 shadow-sm`}>
        <Icon className={`w-5 h-5 ${feature.iconColor}`} />
      </div>
      <h3 className="text-lg font-bold text-text-primary mb-2">{feature.title}</h3>
      <p className="text-sm text-text-secondary leading-relaxed">{feature.description}</p>
    </motion.div>
  );
}



export default function Home() {
  const titleText = "Where Developers Connect";
  const words = titleText.split(" ");
  const featuresRef = useRef(null);
  const featuresInView = useInView(featuresRef, { once: true, margin: '-60px' });

  return (
    <div className="w-full">

      {/* ── Hero ── */}
      <div className="relative w-full flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center overflow-x-hidden px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 flex flex-col items-center w-full"
        >

          {/* Title */}
          <motion.div variants={itemVariants} className="w-full max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-text-primary leading-tight py-2">
              {words.map((word, idx) => (
                <motion.span
                  key={idx}
                  variants={{
                    hidden: { opacity: 0, y: 24, filter: 'blur(10px)' },
                    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { delay: idx * 0.08 } },
                  }}
                  className="inline-block mr-[0.3em] last:mr-0"
                >
                  {word === 'Connect' ? (
                    <span className="bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                      {word}
                    </span>
                  ) : word}
                </motion.span>
              ))}
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto pt-5 leading-relaxed"
          >
            DevTinder is a professional platform built for developers — discover talent, find opportunities, and build your network with people who think in code.
          </motion.p>

          {/* CTA */}
          <motion.div variants={itemVariants} className="mt-10">
            <Link to="/signup">
              <motion.span
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-white px-8 py-3.5 rounded-2xl font-bold text-base transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 relative overflow-hidden group cursor-pointer"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start Building Your Profile
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-white/15 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-0" />
              </motion.span>
            </Link>
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            variants={itemVariants}
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="mt-16 flex flex-col items-center gap-2 text-text-secondary/50"
          >
            <span className="text-xs font-medium tracking-widest uppercase">Scroll to explore</span>
            <div className="w-px h-10 bg-gradient-to-b from-border to-transparent" />
          </motion.div>
        </motion.div>
      </div>



      {/* ── Features ── */}
      <div ref={featuresRef} className="w-full px-4 sm:px-8 lg:px-16 py-24 max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={featuresInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-semibold text-primary tracking-widest uppercase mb-3">Everything you need</p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-text-primary leading-tight">
            Built for the modern{' '}
            <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">developer</span>
          </h2>
          <p className="text-text-secondary mt-4 text-lg max-w-2xl mx-auto leading-relaxed">
            From finding collaborators to landing your next role — DevTinder gives you the tools to grow your career without the noise.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <FeatureCard key={i} feature={feature} index={i} />
          ))}
        </div>
      </div>

      {/* ── CTA Banner ── */}
      <div className="w-full px-4 sm:px-8 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto bg-gradient-to-br from-primary/20 via-surface to-accent/10 border border-primary/20 rounded-3xl px-8 py-14 text-center relative overflow-hidden"
        >
          {/* ambient glow */}
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-accent/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <p className="text-sm text-primary font-semibold tracking-widest uppercase mb-3">Join the community</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary mb-4">
              Your next collaboration<br />starts here
            </h2>
            <p className="text-text-secondary max-w-lg mx-auto mb-8 leading-relaxed">
              Create your developer profile, showcase your GitHub, and connect with engineers building the future.
            </p>
            <Link to="/signup">
              <motion.span
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-white px-8 py-3.5 rounded-2xl font-bold text-base shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all cursor-pointer"
              >
                Create Free Account <ArrowRight className="w-4 h-4" />
              </motion.span>
            </Link>
          </div>
        </motion.div>
      </div>

    </div>
  );
}
