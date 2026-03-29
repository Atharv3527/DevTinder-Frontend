import React from 'react';
import { motion } from 'framer-motion';

export function CardSkeleton() {
  return (
    <div className="bg-surface border border-border rounded-xl p-6 shadow-sm w-full animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-background border border-border rounded-full" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-background border border-border rounded w-1/3" />
          <div className="h-3 bg-background border border-border rounded w-1/4" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-background border border-border rounded w-full" />
        <div className="h-4 bg-background border border-border rounded w-full" />
        <div className="h-4 bg-background border border-border rounded w-5/6" />
      </div>
      <div className="flex gap-2 mt-6">
        <div className="h-8 bg-background border border-border rounded-lg w-20" />
        <div className="h-8 bg-background border border-border rounded-lg w-20" />
      </div>
    </div>
  );
}

export function ChatSkeleton() {
  return (
    <div className="flex flex-col h-full bg-surface animate-pulse">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3 w-full">
          <div className="w-10 h-10 bg-background border border-border rounded-full flex-shrink-0" />
          <div className="space-y-2 w-full">
            <div className="h-4 bg-background border border-border rounded w-32" />
            <div className="h-3 bg-background border border-border rounded w-16" />
          </div>
        </div>
      </div>
      <div className="flex-1 p-4 space-y-6">
        <div className="flex gap-3">
          <div className="w-8 h-8 bg-background rounded-full flex-shrink-0 mt-1" />
          <div className="bg-background border border-border rounded-2xl h-16 w-[60%]" />
        </div>
        <div className="flex gap-3 flex-row-reverse">
          <div className="bg-background border border-border rounded-2xl h-12 w-[40%]" />
        </div>
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 w-full animate-pulse">
      <div className="bg-surface border border-border rounded-xl h-64 overflow-hidden relative">
        <div className="h-48 bg-background border-b border-border w-full" />
        <div className="px-6 pb-6 relative z-10 flex flex-col items-start">
           <div className="w-32 h-32 bg-surface rounded-full border-4 border-surface -mt-16 mb-4" />
           <div className="h-8 bg-background border border-border rounded w-1/2 mb-2" />
           <div className="h-4 bg-background border border-border rounded w-1/3" />
        </div>
      </div>
    </div>
  );
}

export function JobCardSkeleton() {
  return (
    <div className="bg-surface border border-border rounded-xl p-6 flex flex-col h-full shadow-sm animate-pulse">
      <div className="flex justify-between items-start mb-5">
        <div className="w-14 h-14 bg-background rounded-xl flex items-center justify-center font-bold text-2xl text-primary border border-border shadow-inner group-hover:scale-110 transition-transform"></div>
        <div className="px-2.5 py-1 rounded-full bg-background border border-border w-12 h-4"></div>
      </div>
      
      <div className="mb-5 flex-grow">
        <div className="h-6 bg-background rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-background rounded w-1/2"></div>
      </div>

      <div className="space-y-5">
        <div className="flex flex-wrap gap-2">
           <div className="w-16 h-6 bg-background rounded-md border border-border"></div>
           <div className="w-20 h-6 bg-background rounded-md border border-border"></div>
        </div>
        <div className="flex items-center justify-between pt-5 border-t border-border mt-auto">
          <div className="w-24 h-5 bg-background rounded"></div>
          <div className="w-20 h-8 bg-background rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}
