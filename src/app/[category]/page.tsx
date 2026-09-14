import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getArticlesByCategory, getAllCategories } from '@/lib/content';
import { formatDate } from '@/lib/format';
import { Lock } from 'lucide-react';

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((cat) => ({
    category: cat.slug,
  }));
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { category } = params;
  const categories = getAllCategories();
  const catObj = categories.find((c) => c.slug === category);

  if (!catObj) {
    notFound();
  }

  const articles = getArticlesByCategory(category);

  return (
    <div className="space-y-8">
      <header className="border-b border-neutral-200 dark:border-neutral-800 pb-6 space-y-2">
        <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
          Category Feed
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-neutral-900 dark:text-neutral-50">
          {catObj.name}
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base max-w-2xl leading-relaxed">
          {catObj.description}
        </p>
      </header>

      {articles.length === 0 ? (
        <div className="py-12 text-center text-neutral-500">
          No articles published in this category yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <article
              key={article.slug}
              className="group flex flex-col justify-between bg-paper-card dark:bg-paper-cardDark rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={article.coverImage}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {article.isPremium && (
                    <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded text-[11px] font-serif font-bold uppercase tracking-wider bg-neutral-900/90 text-neutral-100 border border-neutral-700/80 backdrop-blur-sm flex items-center gap-1 shadow">
                      <Lock className="w-3 h-3 text-brand-300" /> Member
                    </span>
                  )}
                </div>

                <div className="p-5 space-y-3">
                  <Link href={`/articles/${article.slug}`}>
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-50 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2 leading-snug">
                      {article.title}
                    </h2>
                  </Link>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-neutral-100 dark:border-neutral-800 mt-4 space-y-1.5 text-xs sm:text-sm">
                <p className="font-serif text-base font-bold text-neutral-800 dark:text-neutral-200 line-clamp-1">
                  {article.authorNames}
                </p>
                <div className="flex items-center justify-between text-neutral-500 text-xs">
                  <span>{formatDate(article.publishedAt)}</span>
                  <span>{article.readTimeMinutes || 5} min read</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
