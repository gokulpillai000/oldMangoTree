import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getAllSeries, getSeriesBySlug } from '@/lib/content';
import { formatDate } from '@/lib/format';
import { Layers, ArrowLeft, BookOpen, Calendar, CheckCircle2 } from 'lucide-react';

interface SeriesPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  const series = getAllSeries();
  return series.map((s) => ({
    slug: s.slug,
  }));
}

export default function SeriesDetailPage({ params }: SeriesPageProps) {
  const series = getSeriesBySlug(params.slug);

  if (!series) {
    notFound();
  }

  return (
    <div className="space-y-12 pb-16 max-w-5xl mx-auto">
      {/* Back Button */}
      <div className="pt-2">
        <Link
          href="/series"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>എല്ലാ പരമ്പരകളും (All Series)</span>
        </Link>
      </div>

      {/* Series Hero Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start bg-paper-card dark:bg-paper-cardDark p-5 sm:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
        <div className="md:col-span-5 relative aspect-[4/3] md:aspect-square w-full rounded-xl overflow-hidden shadow-md">
          <Image
            src={series.coverImage}
            alt={series.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="md:col-span-7 space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
              {series.totalEpisodes} അധ്യായങ്ങൾ (Episodes)
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-neutral-50 leading-tight">
            {series.title}
          </h1>

          {series.subtitle && (
            <p className="text-base sm:text-lg font-medium text-brand-700 dark:text-brand-400">
              {series.subtitle}
            </p>
          )}

          <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 border-t border-b border-neutral-100 dark:border-neutral-800 py-3">
            <span className="font-bold text-neutral-900 dark:text-neutral-200">
              രചന:
            </span>
            <span>{series.authorName}</span>
          </div>

          <p className="text-neutral-600 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
            {series.description}
          </p>
        </div>
      </div>

      {/* Episodes Table of Contents */}
      <div className="space-y-6">
        <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
            <Layers className="w-6 h-6 text-brand-600" />
            <span>അധ്യായങ്ങൾ (Episodes Directory)</span>
          </h2>
          <p className="text-neutral-500 text-sm mt-1">
            ക്രമപ്രകാരം വായിക്കാൻ താഴെയുള്ള അധ്യായങ്ങളിൽ ക്ലിക്ക് ചെയ്യുക
          </p>
        </div>

        <div className="space-y-4">
          {series.episodes.map((episode) => (
            <div
              key={episode.slug}
              className="group p-5 sm:p-6 bg-paper-card dark:bg-paper-cardDark rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-brand-500/50 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-serif font-bold text-sm sm:text-base flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  {episode.episodeNumber}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                      Episode {episode.episodeNumber}
                    </span>
                    <span className="text-neutral-300 dark:text-neutral-700">•</span>
                    <span className="text-xs text-neutral-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(episode.publishedAt)}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {episode.title}
                  </h3>
                  {episode.excerpt && (
                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                      {episode.excerpt}
                    </p>
                  )}
                </div>
              </div>

              <div className="shrink-0 w-full sm:w-auto">
                <Link
                  href={`/articles/${episode.slug}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-brand-600 hover:text-white dark:hover:bg-brand-600 text-neutral-900 dark:text-neutral-100 text-xs sm:text-sm font-bold transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>വായിക്കുക</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
