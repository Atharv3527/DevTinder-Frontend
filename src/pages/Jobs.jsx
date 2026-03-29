import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { JobCardSkeleton } from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';

const API = import.meta.env.VITE_API_URL || 'https://devtinder-1-euv2.onrender.com';
const DOMAINS = ['All Domains', 'Frontend Developer', 'Backend Developer', 'MERN Stack Developer', 'DevOps Engineer', 'UI/UX Designer', 'Java Fullstack Developer', 'Database Developer', '.NET Developer'];
const LOCATIONS = ['All India', 'Pune', 'Mumbai', 'Bangalore', 'Gurgaon'];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 25 } },
};

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [domain, setDomain] = useState('All Domains');
  const [location, setLocation] = useState('All India');
  const [showFilters, setShowFilters] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    setError(false);
    try {
      const query = new URLSearchParams();
      if (domain !== 'All Domains') query.append('role', domain);
      if (location !== 'All India') query.append('location', location);
      
      const response = await fetch(`${API}/api/jobs?${query.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch jobs");
      const result = await response.json();
      
      setJobs(result.data || []);
    } catch (err) {
      console.error(err);
      setError(true);
      setJobs([]);
    } finally {
      // Simulate slight delay to let skeletons gracefully show off their premium look
      setTimeout(() => setLoading(false), 400);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [domain, location]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-[1280px] w-full px-4 sm:px-6 mx-auto space-y-6 pb-12"
    >
      {/* HEADER & CONTROLS */}
      <motion.div variants={cardVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center bg-surface border border-border p-5 rounded-xl shadow-sm gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary tracking-tight">Tech Market Openings</h2>
          <p className="text-sm text-text-secondary mt-1 max-w-lg">Discover the best remote and localized opportunities curated from top real-time external providers.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
           <motion.button 
            onClick={() => setShowFilters(!showFilters)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex-1 md:flex-none border px-4 py-2.5 rounded-lg text-sm font-medium transition-colors focus:outline-none flex justify-center items-center gap-2 ${showFilters ? 'bg-primary/10 border-primary/50 text-primary' : 'bg-background border-border text-text-secondary hover:text-text-primary hover:border-text-secondary'}`}
           >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
            Filters { (domain !== 'All Domains' || location !== 'All India') && <span className="w-2 h-2 rounded-full bg-primary inline-block"></span> }
           </motion.button>
           <motion.a 
            href="#" // Disabled for scope requirements
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 md:flex-none bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm shadow-primary/20 flex justify-center items-center gap-2"
           >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Post a Job
           </motion.a>
        </div>
      </motion.div>

      {/* FILTER PANEL */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0, scaleY: 0.9 }}
            animate={{ opacity: 1, height: 'auto', scaleY: 1 }}
            exit={{ opacity: 0, height: 0, scaleY: 0.9 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 200, damping: 25 }}
            className="overflow-hidden transform-gpu origin-top"
          >
            <div className="bg-surface border border-border p-6 rounded-xl shadow-sm mb-6 flex flex-col md:flex-row gap-8">
              {/* Domain Filter */}
              <div className="flex-1 space-y-3">
                <label className="text-sm font-semibold text-text-primary uppercase tracking-wider text-opacity-80">Domain / Role</label>
                <div className="flex flex-wrap gap-2">
                  {DOMAINS.map(d => (
                    <button
                      key={d}
                      onClick={() => setDomain(d)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${domain === d ? 'bg-primary border-primary text-white shadow-md shadow-primary/20' : 'bg-background border-border text-text-secondary hover:border-text-primary hover:text-text-primary'}`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Filter */}
              <div className="flex-1 space-y-3">
                <label className="text-sm font-semibold text-text-primary uppercase tracking-wider text-opacity-80">Location</label>
                <div className="flex flex-wrap gap-2">
                  {LOCATIONS.map(l => (
                    <button
                      key={l}
                      onClick={() => setLocation(l)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${location === l ? 'bg-primary border-primary text-white shadow-md shadow-primary/20' : 'bg-background border-border text-text-secondary hover:border-text-primary hover:text-text-primary'}`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ERROR OR EMPTY STATE */}
      {!loading && (error || jobs.length === 0) && (
        <motion.div variants={cardVariants} className="pt-10 pb-20">
             <EmptyState
                icon={<svg className="w-12 h-12 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                title={error ? "Error Loading Jobs" : "No exact matches"}
                description={error ? "There was a problem communicating with the job API backend." : "Try adjusting your filters to discover more open roles."}
             />
        </motion.div>
      )}

      {/* JOBS GRID */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode='popLayout'>
            {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                    <motion.div key={`skel-${i}`} layout initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                        <JobCardSkeleton />
                    </motion.div>
                ))
            ) : (
                jobs.map((job) => (
                    <motion.div 
                      layout
                      layoutId={job.id}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, scale: 0.9 }}
                      key={job.id}
                      whileHover={{ y: -8, scale: 1.02, boxShadow: '0 10px 40px -10px rgba(99, 102, 241, 0.15)' }}
                      className="bg-surface border border-border rounded-xl p-6 flex flex-col h-full shadow-sm transition-colors cursor-pointer group hover:border-primary/40 relative overflow-hidden"
                    >
                      {/* Premium Subtle Glow Behind Company Initial */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-primary/10 transition-colors pointer-events-none"></div>

                      <div className="flex justify-between items-start mb-5 relative z-10">
                        <div className="w-14 h-14 bg-background rounded-xl flex items-center justify-center font-extrabold text-2xl text-primary border border-border shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                          {job.companyLogo ? (
                            <img src={job.companyLogo} alt={job.companyName} className="w-full h-full rounded-xl object-contain p-1" />
                          ) : (
                            job.companyName.charAt(0)
                          )}
                        </div>
                        {/* Status chip for premium look instead of archaic bookmark icon */}
                        <div className="px-2.5 py-1 rounded-full border border-green-500/20 bg-green-500/10 text-green-500 text-[10px] font-bold tracking-widest uppercase">
                            Open
                        </div>
                      </div>
                      
                      <div className="mb-5 flex-grow relative z-10">
                        <h3 className="font-bold text-lg text-text-primary group-hover:text-primary transition-colors leading-tight mb-2 tracking-tight line-clamp-2">{job.jobTitle}</h3>
                        <p className="text-sm text-text-secondary flex flex-wrap items-center gap-1.5 font-medium">
                          <span className="text-text-primary/80">{job.companyName}</span>
                          <span className="w-1 h-1 bg-text-secondary rounded-full"></span>
                          <span className="flex items-center gap-1"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>{job.location}</span>
                        </p>
                      </div>

                      <div className="space-y-5 relative z-10">
                        {/* Domain/Employment type tags */}
                        <div className="flex flex-wrap gap-2">
                           <span className="px-2.5 py-1 bg-background text-text-primary rounded-md text-xs font-semibold border border-border group-hover:border-primary/20 transition-colors">
                              {job.employmentType}
                           </span>
                           {job.techStack && job.techStack.length > 0 && job.techStack.slice(0, 2).map(tech => (
                              <span key={tech} className="px-2.5 py-1 bg-background text-text-secondary rounded-md text-xs font-medium border border-border">
                                 {tech}
                              </span>
                           ))}
                        </div>
                        <div className="flex items-center justify-between pt-5 border-t border-border mt-auto">
                          <span className="font-bold text-text-primary text-sm tracking-wide">{job.salary}</span>
                          <motion.a 
                            href={job.applyLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            whileHover={{ x: 5 }} 
                            whileTap={{ scale: 0.9 }}
                            className="text-sm font-bold text-primary hover:text-primary-hover transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-primary/10"
                          >
                            Apply Now
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </motion.a>
                        </div>
                      </div>
                    </motion.div>
                ))
            )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
