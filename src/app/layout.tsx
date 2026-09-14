import React from 'react';
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { AudioProvider } from '@/components/AudioContext';
import { AudioPlayer } from '@/components/AudioPlayer';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'OldmanGoTree — Mobile-First Database-Less Media & Webzine Platform',
  description: 'Flat-file digital webzine, long-form articles, issue packets, and audio streaming.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preload" href="/fonts/DzainTrueCopy-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/DzainTrueCopy-Bold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        <AudioProvider>
          <div className="flex flex-col min-h-screen pb-32 md:pb-24">
            <Header />
            <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
              {children}
            </main>
            <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-paper-card dark:bg-paper-cardDark py-12 mb-14 md:mb-0 transition-colors">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  {/* Brand & Slogan */}
                  <div className="md:col-span-4 space-y-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-brand-700 flex items-center justify-center text-white font-serif text-base font-bold shadow-sm">
                        OM
                      </div>
                      <span className="font-serif text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                        oldman<span className="text-brand-600 dark:text-brand-400">go</span>tree
                      </span>
                    </div>
                    <p className="font-serif text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                      Readers are Thinkers | വായിക്കുന്നവരാണ് ചിന്തിക്കുന്നവർ
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-sm">
                      സ്വതന്ത്രവും നിർഭയവുമായ ഡിജിറ്റൽ മാധ്യമ സംരംഭം. ആഴത്തിലുള്ള വിശകലനങ്ങൾ, സാഹിത്യം, രാഷ്ട്രീയം, പോഡ്‌കാസ്റ്റുകൾ, അന്വേഷണാത്മക വീഡിയോകൾ.
                    </p>
                  </div>

                  {/* Main Departments */}
                  <div className="md:col-span-4 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                      Departments &amp; Media | വിഭാഗങ്ങൾ
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                      <a href="/politics" className="hover:text-brand-600 transition-colors">Politics (രാഷ്ട്രീയം)</a>
                      <a href="/literature" className="hover:text-brand-600 transition-colors">Literature (സാഹിത്യം)</a>
                      <a href="/videos" className="hover:text-brand-600 transition-colors">Videos (വീഡിയോകൾ)</a>
                      <a href="/series" className="hover:text-brand-600 transition-colors">Series (പരമ്പരകൾ)</a>
                      <a href="/magazine" className="hover:text-brand-600 transition-colors">Webzine Packets</a>
                      <a href="/podcasts" className="hover:text-brand-600 transition-colors">Audio Hub (ഓഡിയോ)</a>
                      <a href="/media" className="hover:text-brand-600 transition-colors">Media (മാധ്യമം)</a>
                      <a href="/entertainment" className="hover:text-brand-600 transition-colors">Entertainment</a>
                      <a href="/cinema" className="hover:text-brand-600 transition-colors">Cinema &amp; Film Studies</a>
                      <a href="/sports" className="hover:text-brand-600 transition-colors">Sports &amp; Football</a>
                    </div>
                  </div>

                  {/* Policies & Institutional Links */}
                  <div className="md:col-span-4 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                      Information &amp; Policies
                    </h4>
                    <div className="flex flex-col space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400">
                      <a href="/pages/about-us" className="hover:text-brand-600 transition-colors">About Us (ഞങ്ങളെക്കുറിച്ച്)</a>
                      <a href="/the-team" className="hover:text-brand-600 transition-colors">The Team (എഡിറ്റോറിയൽ സമിതി)</a>
                      <a href="/pages/contact-us" className="hover:text-brand-600 transition-colors">Contact Us (ബന്ധപ്പെടുക)</a>
                      <a href="/pages/grievance-redressal" className="hover:text-brand-600 transition-colors">Grievance Redressal (പരാതി പരിഹാരം)</a>
                      <a href="/pages/privacy-policy" className="hover:text-brand-600 transition-colors">Privacy Policy (സ്വകാര്യതാ നയം)</a>
                      <a href="/pages/terms-of-use" className="hover:text-brand-600 transition-colors">Terms of Use (ഉപയോഗ നിബന്ധനകൾ)</a>
                      <a href="/pages/refund-policy" className="hover:text-brand-600 transition-colors">Refund Policy (റീഫണ്ട് നയം)</a>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
                  <p>© {new Date().getFullYear()} OldmanGoTree Media. All rights reserved.</p>
                  <p className="text-[11px] text-neutral-400">
                    Compliant with Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021
                  </p>
                </div>
              </div>
            </footer>
          </div>
          <AudioPlayer />
          <BottomNav />
        </AudioProvider>
      </body>
    </html>
  );
}
