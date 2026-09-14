'use client';

import React, { useState, useEffect } from 'react';
import { Share2, Check, Copy, MessageCircle, Twitter, Facebook } from 'lucide-react';

interface SocialShareBarProps {
  title: string;
  slug: string;
}

export function SocialShareBar({ title, slug }: SocialShareBarProps) {
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState('');

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const handleCopy = async () => {
    const shareUrl = url || `${window.location.origin}/articles/${slug}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleNativeShare = async () => {
    const shareUrl = url || `${window.location.origin}/articles/${slug}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url: shareUrl,
        });
      } catch {
        // User canceled share
      }
    } else {
      handleCopy();
    }
  };

  const shareUrl = encodeURIComponent(url || `https://oldmangotree.media/articles/${slug}`);
  const shareText = encodeURIComponent(`${title} — OldmanGoTree`);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-3 px-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-medium">
      <span className="text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5 font-semibold">
        <Share2 className="w-3.5 h-3.5 text-brand-600" /> പങ്കുവെക്കാം / Share:
      </span>

      <div className="flex items-center gap-2">
        {/* WhatsApp */}
        <a
          href={`https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on WhatsApp"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">WhatsApp</span>
        </a>

        {/* X / Twitter */}
        <a
          href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on X"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 transition-colors"
        >
          <Twitter className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">X</span>
        </a>

        {/* Facebook */}
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Facebook"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 dark:text-blue-400 transition-colors"
        >
          <Facebook className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Facebook</span>
        </a>

        {/* Copy Link / Native Share */}
        <button
          onClick={handleNativeShare}
          aria-label="Copy article link"
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-colors ${
            copied
              ? 'bg-brand-600 text-white'
              : 'bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-white" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Link</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
