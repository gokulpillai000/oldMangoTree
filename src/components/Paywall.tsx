'use client';

import React, { useState } from 'react';
import { Lock, CheckCircle2 } from 'lucide-react';

interface PaywallProps {
  articleTitle: string;
  onUnlockSuccess?: () => void;
}

export function Paywall({ articleTitle, onUnlockSuccess }: PaywallProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handleUnlockDemo = () => {
    setIsUnlocked(true);
    if (onUnlockSuccess) onUnlockSuccess();
  };

  if (isUnlocked) return null;

  return (
    <div className="relative my-8 rounded-2xl overflow-hidden border border-neutral-300 dark:border-neutral-800 bg-paper-card dark:bg-paper-cardDark p-5 sm:p-8 text-center shadow-sm">
      <div className="max-w-xl mx-auto space-y-6">
        <div className="w-14 h-14 rounded-full bg-brand-700 text-white flex items-center justify-center mx-auto shadow-md">
          <Lock className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-serif font-bold uppercase tracking-wider bg-brand-50 dark:bg-brand-950/60 text-brand-800 dark:text-brand-200 border border-brand-200 dark:border-brand-900">
            <Lock className="w-3.5 h-3.5 text-brand-700 dark:text-brand-300" /> Webzine Subscriber Content
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-50">
            Subscribe to Read Full Article
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            “{articleTitle}” is exclusive to OldmanGoTree digital subscribers &amp; packet pass holders.
          </p>
        </div>

        <div className="bg-neutral-50 dark:bg-neutral-900 p-4 rounded-xl text-left space-y-2.5 text-xs text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-brand-700 dark:text-brand-400 shrink-0" />
            <span>Unlimited access to all current and upcoming webzine issues</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-brand-700 dark:text-brand-400 shrink-0" />
            <span>High-quality audio narrations and podcast archive</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-brand-700 dark:text-brand-400 shrink-0" />
            <span>Ultra-fast, ad-free reading experience</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleUnlockDemo}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-700 hover:bg-brand-600 text-white font-bold text-sm shadow transition-colors"
          >
            Unlock with Member Pass (Demo)
          </button>
          <button
            onClick={handleUnlockDemo}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-semibold text-sm transition-colors"
          >
            Sign In with Memberstack
          </button>
        </div>
      </div>
    </div>
  );
}
