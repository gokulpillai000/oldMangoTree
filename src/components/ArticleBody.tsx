'use client';

import React, { useState } from 'react';
import { ArticleReaderToolbar } from './ArticleReaderToolbar';

interface ArticleBodyProps {
  title: string;
  slug: string;
  audioNarrationUrl?: string;
  audioDurationSeconds?: number;
  contentHtml: string;
}

export function ArticleBody({
  title,
  slug,
  audioNarrationUrl,
  audioDurationSeconds,
  contentHtml,
}: ArticleBodyProps) {
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');

  const sizeClasses = {
    sm: 'text-lg sm:text-xl [&_p]:text-lg [&_p]:sm:text-xl leading-relaxed [&_p]:leading-relaxed',
    md: 'text-xl sm:text-2xl [&_p]:text-xl [&_p]:sm:text-2xl leading-relaxed [&_p]:leading-relaxed',
    lg: 'text-2xl sm:text-3xl [&_p]:text-2xl [&_p]:sm:text-3xl leading-loose [&_p]:leading-loose',
  };

  return (
    <div>
      <ArticleReaderToolbar
        title={title}
        slug={slug}
        audioNarrationUrl={audioNarrationUrl}
        audioDurationSeconds={audioDurationSeconds}
        onFontSizeChange={(size) => setFontSize(size)}
      />

      <div
        className={`prose dark:prose-invert max-w-none font-text is__text ${sizeClasses[fontSize]} space-y-4`}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
