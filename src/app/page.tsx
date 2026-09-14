import React from 'react';
import { getAllArticles, getAllIssues, getAllPodcasts, getAllSeries, getAllVideos } from '@/lib/content';
import { WidgetGrid } from '@/components/WidgetGrid';

export const revalidate = 60; // ISR for static build

export default function HomePage() {
  const articles = getAllArticles();
  const issues = getAllIssues();
  const podcasts = getAllPodcasts();
  const series = getAllSeries();
  const videos = getAllVideos();

  const featuredIssue = issues.length > 0 ? issues[0] : null;

  return (
    <div className="space-y-10">
      <WidgetGrid
        articles={articles}
        featuredIssue={featuredIssue}
        podcasts={podcasts}
        series={series}
        videos={videos}
      />
    </div>
  );
}
