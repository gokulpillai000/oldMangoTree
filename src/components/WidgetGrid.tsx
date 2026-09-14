'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Article, IssuePacket, Podcast, Series, Video } from '@/lib/content';
import { formatDate } from '@/lib/format';
import { useAudio } from './AudioContext';
import { Play, Lock, BookOpen, Volume2, ArrowRight, Radio, Film, Trophy, Users, Calendar, Layers, TrendingUp } from 'lucide-react';

interface WidgetGridProps {
  articles: Article[];
  featuredIssue?: IssuePacket | null;
  podcasts?: Podcast[];
  series?: Series[];
  videos?: Video[];
}

export function WidgetGrid({ articles, featuredIssue, podcasts, series, videos }: WidgetGridProps) {
  const { playTrack } = useAudio();

  if (!articles || articles.length === 0) {
    return (
      <div className="py-12 text-center text-neutral-500">
        No articles published yet.
      </div>
    );
  }

  // Segment articles for Truecopy Think thematic sections
  const leadArticle = articles[0];
  const stackedArticles = articles.slice(1, 4);

  const sportsArticles = articles.filter(
    (a) => a.category === 'sports' || a.tags?.some((t) => ['sports', 'football'].includes(t.toLowerCase()))
  );

  const cinemaArticles = articles.filter(
    (a) => a.category === 'cinema' || a.tags?.some((t) => ['cinema', 'movies', 'culture'].includes(t.toLowerCase()))
  );

  const editorsAssemblyArticles = articles.filter(
    (a) => a.tags?.some((t) => t.toLowerCase() === 'editors assembly') || (a.category === 'politics' && a.slug !== leadArticle.slug)
  );

  const packetArticles = featuredIssue
    ? articles.filter((a) => a.webzineIssue === featuredIssue.id)
    : [];

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* 1. Featured Webzine Packet Hero Banner */}
      {featuredIssue && (
        <section className="relative overflow-hidden rounded-2xl bg-neutral-900 dark:bg-neutral-950 border border-neutral-800 text-white p-5 sm:p-8 shadow-md">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-neutral-300 bg-neutral-800 border border-neutral-700 uppercase tracking-widest">
                <BookOpen className="w-3.5 h-3.5 text-brand-400" />
                <span>Webzine Packet</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                {featuredIssue.title} — {featuredIssue.theme}
              </h1>
              <p className="text-neutral-300 text-sm sm:text-base max-w-2xl leading-relaxed">
                ആഴത്തിലുള്ള രാഷ്ട്രീയ, പാരിസ്ഥിതിക, സാംസ്കാരിക വിശകലനങ്ങളും ലേഖനങ്ങളും ഓഡിയോ ആഖ്യാനങ്ങളും അടങ്ങിയ ഡിജിറ്റൽ പാക്കറ്റ്.
              </p>
            </div>

            <Link
              href={`/magazine/${featuredIssue.id}`}
              className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-700 hover:bg-brand-600 text-white font-serif font-bold text-sm sm:text-base shadow-sm transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>Explore Packet</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}

      {/* 2. Lead 2-Column Split Section (Truecopy Think Signature Lead Layout) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Column: Major Lead Story (7 cols) */}
        <div className="lg:col-span-7 bg-paper-card dark:bg-paper-cardDark rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm hover:shadow-lg transition-shadow group flex flex-col justify-between">
          <div>
            <div className="relative h-60 sm:h-80 md:h-96 w-full overflow-hidden">
              <Image
                src={leadArticle.coverImage}
                alt={leadArticle.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                priority
              />
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider bg-brand-600 text-white shadow">
                {leadArticle.category}
              </span>
              {leadArticle.isPremium && (
                <span className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-neutral-900/90 text-neutral-100 border border-neutral-700/80 backdrop-blur-sm shadow-sm">
                  <Lock className="w-3 h-3 text-brand-400" /> Premium
                </span>
              )}
            </div>

            <div className="p-5 sm:p-6 space-y-3">
              <Link href={`/articles/${leadArticle.slug}`} className="block">
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-neutral-50 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors leading-snug">
                  {leadArticle.title}
                </h2>
              </Link>
              <p className="text-neutral-600 dark:text-neutral-300 text-base sm:text-lg line-clamp-3 leading-relaxed font-sans">
                {leadArticle.excerpt}
              </p>
            </div>
          </div>

          <div className="p-5 sm:p-6 pt-0 border-t border-neutral-100 dark:border-neutral-800/80 mt-2 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-4 pt-3">
              <div className="space-y-0.5">
                <p className="font-serif text-base sm:text-lg font-bold text-neutral-800 dark:text-neutral-200 line-clamp-1">
                  {leadArticle.authorNames || 'Editorial Desk'}
                </p>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                  <span>{formatDate(leadArticle.publishedAt)}</span>
                  <span>•</span>
                  <span>{leadArticle.readTimeMinutes || 6} min read</span>
                </div>
              </div>

              {leadArticle.audioNarrationUrl && (
                <button
                  onClick={() =>
                    playTrack({
                      title: leadArticle.title,
                      url: leadArticle.audioNarrationUrl!,
                      durationSeconds: leadArticle.audioDurationSeconds,
                      articleSlug: leadArticle.slug,
                    })
                  }
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold shadow transition-all shrink-0"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>കേൾക്കാം</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: 3 Stacked Trending Stories (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-200 dark:border-neutral-800">
            <TrendingUp className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <h3 className="font-serif text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-50">
              Trending Stories / ശ്രദ്ധേയമായവ
            </h3>
          </div>

          <div className="space-y-4">
            {stackedArticles.map((art) => (
              <article
                key={art.slug}
                className="flex items-center gap-3.5 sm:gap-4 p-3.5 rounded-xl bg-paper-card dark:bg-paper-cardDark border border-neutral-200 dark:border-neutral-800 hover:shadow-md transition-shadow group"
              >
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-lg overflow-hidden shrink-0">
                  <Image
                    src={art.coverImage}
                    alt={art.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-black/75 text-white">
                    {art.category}
                  </span>
                </div>

                <div className="flex-1 min-w-0 space-y-1.5">
                  <Link href={`/articles/${art.slug}`}>
                    <h4 className="font-serif text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-50 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2 leading-snug">
                      {art.title}
                    </h4>
                  </Link>
                  <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 line-clamp-1">
                    {art.authorNames}
                  </p>
                  <p className="text-xs text-neutral-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(art.publishedAt)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Webzine Packet Showcase Section (Truecopy Think Signature 'webzine' Block) */}
      {featuredIssue && packetArticles.length > 0 && (
        <section className="space-y-6 pt-4">
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-600" />
              <h2 className="font-sans text-2xl sm:text-3xl font-light lowercase tracking-wider text-neutral-900 dark:text-neutral-50">
                webzine <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-brand-600 ml-2 px-2.5 py-0.5 bg-brand-50 dark:bg-brand-950 rounded">Packet {featuredIssue.issueNumber}</span>
              </h2>
            </div>
            <Link
              href="/magazine"
              className="text-xs sm:text-sm font-bold text-neutral-500 hover:text-brand-600 dark:hover:text-brand-400 flex items-center gap-1 uppercase tracking-wider"
            >
              <span>Archives</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packetArticles.slice(0, 3).map((art) => (
              <article
                key={art.slug}
                className="group flex flex-col justify-between bg-paper-card dark:bg-paper-cardDark rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="relative h-44 w-full overflow-hidden">
                    <Image
                      src={art.coverImage}
                      alt={art.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/75 text-white">
                      {art.category}
                    </span>
                  </div>

                  <div className="p-5 space-y-2">
                    <Link href={`/articles/${art.slug}`}>
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-50 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2 leading-snug">
                        {art.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                      {art.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-neutral-100 dark:border-neutral-800 mt-2 space-y-1.5 text-xs sm:text-sm">
                  <p className="font-serif font-bold text-neutral-800 dark:text-neutral-200 line-clamp-1">
                    {art.authorNames}
                  </p>
                  <div className="flex items-center justify-between text-neutral-500 text-xs">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(art.publishedAt)}
                    </span>
                    <Link
                      href={`/articles/${art.slug}`}
                      className="font-bold text-brand-600 dark:text-brand-400 hover:underline"
                    >
                      വായിക്കാം →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* 4. Think Football / Sports Block */}
      {sportsArticles.length > 0 && (
        <section className="space-y-6 pt-4">
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-brand-700 dark:text-brand-400" />
              <h2 className="font-sans text-2xl sm:text-3xl font-light lowercase tracking-wider text-neutral-900 dark:text-neutral-50">
                think football <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-brand-700 dark:text-brand-300 ml-2 px-2.5 py-0.5 bg-brand-50 dark:bg-brand-950/50 rounded">Sports</span>
              </h2>
            </div>
            <Link
              href="/sports"
              className="text-xs sm:text-sm font-bold text-neutral-500 hover:text-brand-600 dark:hover:text-brand-400 flex items-center gap-1 uppercase tracking-wider"
            >
              <span>Show More</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sportsArticles.slice(0, 2).map((art) => (
              <article
                key={art.slug}
                className="group flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-paper-card dark:bg-paper-cardDark border border-neutral-200 dark:border-neutral-800 hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-[16/10] sm:aspect-[4/3] sm:w-52 w-full rounded-xl overflow-hidden shrink-0">
                  <Image
                    src={art.coverImage}
                    alt={art.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="flex flex-col justify-between flex-1 py-1 space-y-2">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-400">
                      Football / Sports
                    </span>
                    <Link href={`/articles/${art.slug}`}>
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-50 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2 leading-snug mt-1">
                        {art.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 mt-1 leading-relaxed">
                      {art.excerpt}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-1 text-xs sm:text-sm">
                    <p className="font-serif font-bold text-neutral-800 dark:text-neutral-200 line-clamp-1">
                      {art.authorNames}
                    </p>
                    <div className="flex items-center justify-between text-neutral-500 text-xs">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(art.publishedAt)}
                      </span>
                      <Link
                        href={`/articles/${art.slug}`}
                        className="font-bold text-brand-600 dark:text-brand-400 hover:underline"
                      >
                        Read Analysis →
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* 5. Cinema & Film Studies Block */}
      {cinemaArticles.length > 0 && (
        <section className="space-y-6 pt-4">
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <Film className="w-5 h-5 text-indigo-600" />
              <h2 className="font-sans text-2xl sm:text-3xl font-light lowercase tracking-wider text-neutral-900 dark:text-neutral-50">
                cinema <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-indigo-600 ml-2 px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-950 rounded">Film Studies</span>
              </h2>
            </div>
            <Link
              href="/cinema"
              className="text-xs sm:text-sm font-bold text-neutral-500 hover:text-brand-600 dark:hover:text-brand-400 flex items-center gap-1 uppercase tracking-wider"
            >
              <span>Show More</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cinemaArticles.slice(0, 2).map((art) => (
              <article
                key={art.slug}
                className="group flex flex-col justify-between bg-paper-card dark:bg-paper-cardDark rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={art.coverImage}
                    alt={art.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-xs uppercase font-bold text-amber-300">Film Review &amp; Aesthetics</span>
                    <Link href={`/articles/${art.slug}`}>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold hover:underline leading-snug mt-0.5">
                        {art.title}
                      </h3>
                    </Link>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <p className="text-sm text-neutral-600 dark:text-neutral-300 line-clamp-2 leading-relaxed">
                    {art.excerpt}
                  </p>
                  <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-0.5 text-xs sm:text-sm">
                    <p className="font-serif font-bold text-neutral-800 dark:text-neutral-200 line-clamp-1">
                      {art.authorNames}
                    </p>
                    <p className="text-xs text-neutral-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(art.publishedAt)} • {art.readTimeMinutes || 5} min read
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* 6. Editors Assembly Section */}
      {editorsAssemblyArticles.length > 0 && (
        <section className="space-y-6 pt-4">
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-rose-600" />
              <h2 className="font-sans text-2xl sm:text-3xl font-light lowercase tracking-wider text-neutral-900 dark:text-neutral-50">
                editors assembly <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-rose-600 ml-2 px-2.5 py-0.5 bg-rose-50 dark:bg-rose-950 rounded">Dialogue</span>
              </h2>
            </div>
            <Link
              href="/search?q=Editors%20Assembly"
              className="text-xs sm:text-sm font-bold text-neutral-500 hover:text-brand-600 dark:hover:text-brand-400 flex items-center gap-1 uppercase tracking-wider"
            >
              <span>All Panels</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {editorsAssemblyArticles.slice(0, 2).map((art) => (
              <article
                key={art.slug}
                className="group flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-paper-card dark:bg-paper-cardDark border border-neutral-200 dark:border-neutral-800 hover:shadow-md transition-shadow"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                      Editorial Panel
                    </span>
                    <span className="text-xs sm:text-sm text-neutral-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(art.publishedAt)}
                    </span>
                  </div>

                  <Link href={`/articles/${art.slug}`}>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-50 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors leading-snug">
                      {art.title}
                    </h3>
                  </Link>

                  <p className="text-sm font-semibold text-rose-700 dark:text-rose-300 line-clamp-1">
                    {art.authorNames}
                  </p>

                  <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 line-clamp-2 leading-relaxed">
                    {art.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between mt-3 text-xs sm:text-sm">
                  <span className="text-neutral-500 font-medium">സംവാദം കേൾക്കാം / വായിക്കാം</span>
                  <Link
                    href={`/articles/${art.slug}`}
                    className="font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
                  >
                    <span>Read Debate</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* 7. Audio Hub / Podcasts Section */}
      {podcasts && podcasts.length > 0 && (
        <section className="bg-paper-card dark:bg-paper-cardDark rounded-2xl p-4 sm:p-6 md:p-8 border border-neutral-200 dark:border-neutral-800 space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-brand-600" />
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                പോഡ്കാസ്റ്റുകൾ &amp; ഓഡിയോ സ്ട്രീമിംഗ്
              </h2>
            </div>
            <Link
              href="/podcasts"
              className="text-xs sm:text-sm font-bold text-brand-600 dark:text-brand-400 hover:underline uppercase tracking-wider"
            >
              All Episodes →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {podcasts.map((pod) => (
              <div
                key={pod.id}
                className="flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 hover:shadow-sm transition-all"
              >
                <div className="relative w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-xl overflow-hidden shrink-0">
                  <Image src={pod.coverImage} alt={pod.title} fill className="object-cover" />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100 truncate">
                    {pod.title}
                  </h3>
                  <p className="text-sm text-neutral-500 truncate">{pod.excerpt}</p>
                  <p className="text-xs text-brand-600 dark:text-brand-400 font-medium">
                    {Math.floor(pod.durationSeconds / 60)} minutes
                  </p>
                </div>
                <button
                  onClick={() =>
                    playTrack({
                      title: pod.title,
                      url: pod.audioUrl,
                      durationSeconds: pod.durationSeconds,
                    })
                  }
                  className="p-3 sm:p-3.5 rounded-full bg-brand-600 text-white hover:bg-brand-500 shrink-0 shadow hover:scale-105 transition-all"
                  aria-label={`Play ${pod.title}`}
                >
                  <Play className="w-4 h-4 ml-0.5" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. Special Series Spotlight (Truecopy Think Signature) */}
      {series && series.length > 0 && (
        <section className="bg-paper-card dark:bg-paper-cardDark rounded-2xl p-4 sm:p-6 md:p-8 border border-neutral-200 dark:border-neutral-800 space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-brand-600" />
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                പ്രത്യേക പരമ്പരകൾ (Special Series)
              </h2>
            </div>
            <Link
              href="/series"
              className="text-xs sm:text-sm font-bold text-brand-600 dark:text-brand-400 hover:underline uppercase tracking-wider flex items-center gap-1"
            >
              <span>All Series</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {series.slice(0, 3).map((s) => (
              <article
                key={s.slug}
                className="group flex flex-col justify-between bg-neutral-50 dark:bg-neutral-900/60 rounded-xl border border-neutral-200/60 dark:border-neutral-800 overflow-hidden hover:shadow-md transition-all"
              >
                <div>
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-900">
                    <Image
                      src={s.coverImage}
                      alt={s.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-brand-600 text-white shadow">
                        {s.totalEpisodes} Episodes
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <p className="text-xs font-bold text-brand-700 dark:text-brand-300">
                      {s.authorName}
                    </p>
                    <Link href={`/series/${s.slug}`}>
                      <h3 className="font-serif text-lg font-bold text-neutral-900 dark:text-neutral-50 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2 leading-snug">
                        {s.title}
                      </h3>
                    </Link>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">
                      {s.description}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <Link
                    href={`/series/${s.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
                  >
                    <span>പരമ്പര വായിക്കുക</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* 8. Videos & Documentaries Portal Preview */}
      {videos && videos.length > 0 && (
        <section className="bg-neutral-950 text-white rounded-2xl p-4 sm:p-6 md:p-8 border border-neutral-800 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <Film className="w-5 h-5 text-brand-500" />
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">
                വീഡിയോകൾ &amp; ഡോക്യുമെന്ററികൾ (Videos)
              </h2>
            </div>
            <Link
              href="/videos"
              className="text-xs sm:text-sm font-bold text-brand-400 hover:underline uppercase tracking-wider flex items-center gap-1"
            >
              <span>Watch All Videos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.slice(0, 3).map((vid) => (
              <Link
                key={vid.id}
                href="/videos"
                className="group flex flex-col justify-between bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 hover:border-neutral-700 transition-all hover:scale-[1.02]"
              >
                <div>
                  <div className="relative aspect-video w-full overflow-hidden bg-black">
                    {vid.coverImage && (
                      <Image
                        src={vid.coverImage}
                        alt={vid.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                      />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10">
                      <div className="w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-4 h-4 fill-white ml-0.5" />
                      </div>
                    </div>
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[11px] font-bold bg-black/80 text-white">
                      {vid.duration}
                    </span>
                  </div>

                  <div className="p-4 space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-brand-400">
                      {vid.playlist || vid.category}
                    </span>
                    <h3 className="font-serif text-base font-bold text-neutral-100 group-hover:text-brand-400 transition-colors line-clamp-2 leading-snug">
                      {vid.title}
                    </h3>
                  </div>
                </div>

                <div className="p-4 pt-0 text-xs text-neutral-400">
                  <span>{vid.speaker}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 9. Truecopy Think Signature "Show More / Latest Feed" Bar */}
      <div className="flex justify-center sm:justify-end pt-4 pb-2">
        <Link
          href="/latest"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-serif font-bold text-sm sm:text-base hover:bg-brand-600 dark:hover:bg-brand-500 dark:hover:text-white shadow-md hover:shadow-lg transition-all"
        >
          <span>കൂടുതൽ വായനകൾ (Show More Stories)</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

