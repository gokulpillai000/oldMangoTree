'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PenTool, Calendar, Lock, CheckCircle2, AlertCircle, ArrowLeft, Send, Tag, Folder, FileText, BookOpen, ExternalLink, KeyRound, ArrowRight } from 'lucide-react';
import { POPULAR_TAG_SUGGESTIONS, determineCategoryFromTags } from '@/lib/categoryMapper';
import { formatDate } from '@/lib/format';
import { getStoredSession, setStoredSession, getAuthHeaders, clientAuthenticate } from '@/lib/clientAuth';

export default function EditorialDeskPage() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // In-place direct login state for unauthenticated users
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Editorial Desk State
  const [activeTab, setActiveTab] = useState<'editor' | 'published'>('editor');
  const [recentArticles, setRecentArticles] = useState<any[]>([]);
  const [lastPublishedSlug, setLastPublishedSlug] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [webzineIssue, setWebzineIssue] = useState('packet-2');
  const [scheduledTime, setScheduledTime] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Kerala', 'Politics']);
  const [customTagInput, setCustomTagInput] = useState('');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80');
  const [htmlContent, setHtmlContent] = useState('');
  const [isPremium, setIsPremium] = useState(false);

  const [publishing, setPublishing] = useState(false);
  const [resultMsg, setResultMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadArticles = () => {
    fetch('/api/publish', {
      headers: getAuthHeaders(),
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.articles) {
          setRecentArticles(data.articles);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    // 1. Instantly check localStorage for zero-delay mobile recovery
    const stored = getStoredSession();
    if (stored) {
      setSession(stored);
      setLoading(false);
      loadArticles();
    }

    // 2. Sync with server
    fetch('/api/auth', {
      headers: getAuthHeaders(),
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.session) {
          setSession(data.session);
          setStoredSession(data.session);
          loadArticles();
        } else if (!stored) {
          setSession(null);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDirectLogin = async (e?: React.FormEvent, customEmail?: string, customPassword?: string) => {
    if (e) e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    const submitEmail = (customEmail || loginEmail).trim();
    const submitPass = customPassword || loginPassword;

    try {
      let sessionData = null;

      try {
        const res = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            action: 'signin',
            email: submitEmail,
            password: submitPass,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data && data.session) {
            sessionData = data.session;
          }
        }
      } catch (networkErr) {
        // Static hosting mode
      }

      if (!sessionData) {
        const fallback = clientAuthenticate(submitEmail, submitPass);
        if ('error' in fallback) {
          throw new Error(fallback.error);
        }
        sessionData = fallback;
      }

      setStoredSession(sessionData);
      setSession(sessionData);
      loadArticles();
    } catch (err: any) {
      setLoginError(err.message || 'An error occurred during sign in');
    } finally {
      setLoginLoading(false);
    }
  };

  const autoCategory = determineCategoryFromTags(selectedTags);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleAddCustomTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (customTagInput.trim()) {
        const newTag = customTagInput.trim().replace(/^#/, '');
        if (!selectedTags.includes(newTag)) {
          setSelectedTags([...selectedTags, newTag]);
        }
        setCustomTagInput('');
      }
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !htmlContent) {
      setResultMsg({ type: 'error', text: 'Please fill in both the article title and content body.' });
      return;
    }

    setPublishing(true);
    setResultMsg(null);

    try {
      const publishedAt = scheduledTime ? new Date(scheduledTime).toISOString() : new Date().toISOString();

      const payload = {
        title,
        excerpt,
        category: autoCategory,
        webzineIssue,
        tags: selectedTags,
        coverImage,
        htmlContent,
        isPremium,
        publishedAt,
      };

      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to publish article');
      }

      setResultMsg({
        type: 'success',
        text: data.message || 'Article published successfully!',
      });

      if (data.article && data.article.slug) {
        setLastPublishedSlug(data.article.slug);
      }

      // Reset form
      setTitle('');
      setExcerpt('');
      setHtmlContent('');
      setScheduledTime('');

      // Refresh published articles catalog
      loadArticles();
    } catch (err: any) {
      setResultMsg({ type: 'error', text: err.message || 'An error occurred' });
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-neutral-500">
        Loading Editorial Desk...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-md mx-auto py-10 sm:py-16 px-4 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 flex items-center justify-center mx-auto shadow">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-50">
            Editorial Desk / ഡെസ്ക്
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm">
            Sign in to access publishing, scheduling, and magazine issue management tools.
          </p>
        </div>

        {/* 1-Tap Quick Login Presets for Mobile */}
        <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 space-y-2.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            1-Tap Quick Sign In:
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              disabled={loginLoading}
              onClick={() => handleDirectLogin(undefined, 'gokulpillai000@gmail.com', 'editorial123')}
              className="flex-1 px-3.5 py-2.5 text-xs font-semibold text-left rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-brand-500 hover:text-brand-600 transition-all flex items-center justify-between shadow-xs"
            >
              <span>Gokul (Publisher)</span>
              <span className="text-[10px] text-brand-600 font-bold">Sign In →</span>
            </button>
            <button
              type="button"
              disabled={loginLoading}
              onClick={() => handleDirectLogin(undefined, 'editor@oldmangotree.media', 'editor123')}
              className="flex-1 px-3.5 py-2.5 text-xs font-semibold text-left rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-brand-500 hover:text-brand-600 transition-all flex items-center justify-between shadow-xs"
            >
              <span>Kamalram (Editor)</span>
              <span className="text-[10px] text-brand-600 font-bold">Sign In →</span>
            </button>
          </div>
        </div>

        {loginError && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs text-center font-medium">
            {loginError}
          </div>
        )}

        <form onSubmit={handleDirectLogin} className="bg-paper-card dark:bg-paper-cardDark p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-md space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="editor@oldmangotree.media"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              autoComplete="email"
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              autoComplete="current-password"
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <button
            type="submit"
            disabled={loginLoading}
            className="w-full py-3 rounded-xl bg-brand-700 hover:bg-brand-600 active:scale-[0.99] text-white font-bold text-sm shadow transition-all flex items-center justify-center gap-2"
          >
            {loginLoading ? 'Signing In...' : 'Sign In to Editorial Desk →'}
          </button>
        </form>

        <div className="text-center">
          <Link
            href="/"
            className="text-xs font-semibold text-neutral-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
          >
            ← Return to Webzine Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-serif font-bold uppercase tracking-wider bg-brand-50 dark:bg-brand-950/60 text-brand-800 dark:text-brand-300 border border-brand-200 dark:border-brand-900 flex items-center gap-1.5">
              <PenTool className="w-3.5 h-3.5 text-brand-700 dark:text-brand-400" /> Editorial Desk / ഡെസ്ക്
            </span>
            <span className="text-xs text-neutral-500">Welcome, {session.name}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-50">
            Article &amp; Webzine Editor
          </h1>
        </div>
        <Link
          href="/"
          className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Webzine
        </Link>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('editor')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'editor'
              ? 'bg-brand-700 text-white shadow'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Write Story</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('published')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'published'
              ? 'bg-brand-700 text-white shadow'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Published Articles ({recentArticles.length})</span>
        </button>
      </div>

      {/* Result Alert with direct Live Article Link */}
      {resultMsg && (
        <div
          className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm font-medium ${
            resultMsg.type === 'success'
              ? 'bg-neutral-50 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100'
              : 'bg-red-50 dark:bg-red-950/60 border-red-300 dark:border-red-800 text-red-800 dark:text-red-200'
          }`}
        >
          <div className="flex items-center gap-3">
            {resultMsg.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-brand-700 dark:text-brand-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <span>{resultMsg.text}</span>
          </div>

          {resultMsg.type === 'success' && lastPublishedSlug && (
            <Link
              href={`/articles/${lastPublishedSlug}`}
              target="_blank"
              className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-700 hover:bg-brand-600 text-white font-bold text-xs shadow transition-colors"
            >
              <span>View Article Live</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      )}

      {/* Tab 1: Article Editor Form */}
      {activeTab === 'editor' && (
        <div className="space-y-8">
          <form onSubmit={handlePublish} className="bg-paper-card dark:bg-paper-cardDark p-6 sm:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xl space-y-6">
            <div className="space-y-5">
              {/* Article Title */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. വികസന നയങ്ങളും ആധുനിക കേരളീയ ചിന്തകളും"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-base font-serif font-bold text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {/* Excerpt / Summary */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                  Article Summary / Excerpt
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief summary or introductory dek for cards and social previews..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {/* Tag Suggestions & Category Auto-Mapping */}
              <div className="space-y-2 p-4 rounded-xl bg-neutral-100/70 dark:bg-neutral-900/50 border border-neutral-200/80 dark:border-neutral-800">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-brand-600" /> Topic Tags (Select or add tags)
                  </label>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-900 flex items-center gap-1">
                    <Folder className="w-3 h-3 text-brand-600" /> Section: <strong className="capitalize">{autoCategory}</strong>
                  </span>
                </div>

                {/* Suggestions Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {POPULAR_TAG_SUGGESTIONS.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-brand-600 text-white shadow-xs font-bold'
                            : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 hover:border-brand-400'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {tag}
                      </button>
                    );
                  })}
                </div>

                {/* Selected Tags & Custom Tag Input */}
                <div className="pt-2 flex flex-wrap items-center gap-2">
                  {selectedTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-semibold border border-brand-200 dark:border-brand-800"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className="hover:text-red-500 font-bold ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    placeholder="Type custom tag & press Enter..."
                    value={customTagInput}
                    onChange={(e) => setCustomTagInput(e.target.value)}
                    onKeyDown={handleAddCustomTag}
                    className="px-3 py-1 text-xs rounded-md bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-brand-600" /> Schedule Publishing Date &amp; Time
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <p className="text-[11px] text-neutral-400">Leave empty to publish immediately.</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                    Magazine Issue Assignment
                  </label>
                  <select
                    value={webzineIssue}
                    onChange={(e) => setWebzineIssue(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="packet-2">Packet 2 (Latest Issue)</option>
                    <option value="packet-1">Packet 1 (Inaugural Issue)</option>
                    <option value="">Standalone Article (No Packet)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                  Cover Image Link
                </label>
                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                  Article Content *
                </label>
                <textarea
                  rows={9}
                  required
                  placeholder="Write or paste your article content here..."
                  value={htmlContent}
                  onChange={(e) => setHtmlContent(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isPremiumCheck"
                  checked={isPremium}
                  onChange={(e) => setIsPremium(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-600 accent-brand-600 focus:ring-brand-500"
                />
                <label htmlFor="isPremiumCheck" className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                  Mark as Premium / Member Exclusive Article
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={publishing}
              className="w-full py-3.5 rounded-xl bg-brand-700 hover:bg-brand-600 active:scale-[0.99] text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {publishing ? (
                'Publishing Article...'
              ) : (
                <>
                  <Send className="w-4 h-4" /> Publish Article →
                </>
              )}
            </button>
          </form>

          {/* Quick List of Recent Stories */}
          {recentArticles.length > 0 && (
            <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-lg font-bold text-neutral-900 dark:text-neutral-50">
                  Recently Published Stories
                </h2>
                <button
                  type="button"
                  onClick={() => setActiveTab('published')}
                  className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
                >
                  View All ({recentArticles.length}) →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {recentArticles.slice(0, 4).map((art) => (
                  <div
                    key={art.slug}
                    className="p-3.5 rounded-xl bg-paper-card dark:bg-paper-cardDark border border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600">
                          {art.category}
                        </span>
                        {art.webzineIssue && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 uppercase">
                            {art.webzineIssue}
                          </span>
                        )}
                      </div>
                      <Link
                        href={`/articles/${art.slug}`}
                        target="_blank"
                        className="font-serif text-sm font-bold text-neutral-900 dark:text-neutral-100 hover:text-brand-600 transition-colors truncate block"
                      >
                        {art.title}
                      </Link>
                      <p className="text-[11px] text-neutral-400">{formatDate(art.publishedAt)}</p>
                    </div>
                    <Link
                      href={`/articles/${art.slug}`}
                      target="_blank"
                      className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-brand-600 hover:text-white text-neutral-600 dark:text-neutral-300 transition-colors shrink-0"
                      title="View Article Live"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Full Published & Scheduled Stories Catalog */}
      {activeTab === 'published' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
            <div>
              <h2 className="font-serif text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                Published &amp; Scheduled Articles
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                All articles created in your webzine CMS with live view links.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('editor')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-700 hover:bg-brand-600 text-white text-xs font-bold shadow transition-colors"
            >
              <Send className="w-3.5 h-3.5" /> + Write New Story
            </button>
          </div>

          <div className="space-y-3">
            {recentArticles.map((art) => {
              const isScheduled = new Date(art.publishedAt).getTime() > Date.now();
              return (
                <div
                  key={art.slug}
                  className="p-5 rounded-2xl bg-paper-card dark:bg-paper-cardDark border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300">
                        {art.category}
                      </span>
                      {art.webzineIssue && (
                        <span className="px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                          {art.webzineIssue.replace('-', ' ')}
                        </span>
                      )}
                      {isScheduled ? (
                        <span className="px-2.5 py-0.5 rounded-full font-bold text-[11px] bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                          Scheduled for {formatDate(art.publishedAt)}
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full font-bold text-[11px] bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5 border border-neutral-300 dark:border-neutral-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-600" /> Live on Site
                        </span>
                      )}
                    </div>

                    <Link href={`/articles/${art.slug}`} target="_blank" className="block">
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-50 hover:text-brand-600 transition-colors line-clamp-1">
                        {art.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-neutral-500 flex flex-wrap items-center gap-2">
                      <span>Published: {formatDate(art.publishedAt)}</span>
                      <span>•</span>
                      <span>Link: /articles/{art.slug}</span>
                    </p>
                  </div>

                  <Link
                    href={`/articles/${art.slug}`}
                    target="_blank"
                    className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 rounded-xl bg-neutral-100 hover:bg-brand-600 text-neutral-800 hover:text-white dark:bg-neutral-800 dark:hover:bg-brand-600 dark:text-neutral-200 dark:hover:text-white text-xs font-bold transition-colors shadow-sm"
                  >
                    <span>View Article</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
