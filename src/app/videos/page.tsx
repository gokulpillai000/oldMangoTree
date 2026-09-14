'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Play, Film, Clock, User, Calendar, Share2 } from 'lucide-react';

interface VideoItem {
  id: string;
  title: string;
  excerpt: string;
  youtubeId: string;
  playlist?: string;
  category: string;
  publishedAt: string;
  duration: string;
  speaker?: string;
  coverImage?: string;
  isFeatured?: boolean;
}

const videosData: VideoItem[] = [
  {
    id: 'vismayam-paleri-doc',
    title: 'വിസ്മയം പലേരി: ടി.പി. രാജീവന്റെ ഓർമ്മകളിലൂടെ പലേരിയുടെ ജീവചരിത്രം',
    excerpt: 'ഒരു നാടിന്റെ സാംസ്കാരിക-രാഷ്ട്രീയ ചരിത്രവും സാഹിത്യ പശ്ചാത്തലവും അപഗ്രഥിക്കുന്ന പ്രത്യേക വീഡിയോ പ്രോഗ്രാം.',
    youtubeId: 'dQw4w9WgXcQ',
    playlist: 'വിസ്മയം പലേരി',
    category: 'Literature',
    publishedAt: '2026-09-08T10:00:00.000Z',
    duration: '24:18',
    speaker: 'ടി.പി. രാജീവൻ / എഡിറ്റോറിയൽ ഡെസ്ക്',
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800',
    isFeatured: true,
  },
  {
    id: 'gandhi-murder-investigation-talk',
    title: 'ഗാന്ധി വധത്തിന്റെ സമഗ്ര ചരിത്രം: ആസൂത്രണവും വിചാരണയും',
    excerpt: 'കെ.ടി. കുഞ്ഞിക്കണ്ണൻ നയിക്കുന്ന സമഗ്ര ചരിത്രാന്വേഷണ ചർച്ച.',
    youtubeId: 'ysz5S6PUM-U',
    playlist: 'ഗാന്ധി വധത്തിന്റെ സമഗ്ര ചരിത്രം',
    category: 'History',
    publishedAt: '2026-09-06T15:00:00.000Z',
    duration: '38:42',
    speaker: 'കെ.ടി. കുഞ്ഞിക്കണ്ണൻ, മനില സി. മോഹൻ',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800',
    isFeatured: true,
  },
  {
    id: 'hindutva-india-panel',
    title: 'ഹിന്ദുത്വ ഇന്ത്യയുടെ പ്രതിഷ്ഠാപനം: ഭരണഘടനാ മൂല്യങ്ങൾ നേരിടുന്ന വെല്ലുവിളി',
    excerpt: 'ഇന്ത്യൻ ജനാധിപത്യം നേരിടുന്ന പ്രത്യയശാസ്ത്രപരമായ പ്രതിസന്ധികളെക്കുറിച്ചുള്ള പാനൽ ചർച്ച.',
    youtubeId: 'jNQXAC9IVRw',
    playlist: 'ഹിന്ദുത്വ ഇന്ത്യയുടെ പ്രതിഷ്ഠാപനം',
    category: 'Politics',
    publishedAt: '2026-09-04T12:00:00.000Z',
    duration: '45:10',
    speaker: 'ദാമോദർ പ്രസാദ്, കെ. കണ്ണൻ',
    coverImage: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=800',
    isFeatured: false,
  },
  {
    id: 'venu-cinema-stories',
    title: 'വേണു പറയുന്ന സിനിമാ കഥകള്‍: മലയാള സിനിമയുടെ ക്യാമറക്കണ്ണുകൾ',
    excerpt: 'പ്രശസ്ത ഛായാഗ്രാഹകൻ വേണു തന്റെ ചലച്ചിത്ര അനുഭവങ്ങളും സൗന്ദര്യശാസ്ത്രവും പങ്കുവെക്കുന്നു.',
    youtubeId: 'kJQP7kiw5Fk',
    playlist: 'വേണു പറയുന്ന സിനിമാ കഥകള്‍',
    category: 'Cinema',
    publishedAt: '2026-09-02T16:30:00.000Z',
    duration: '32:05',
    speaker: 'വേണു (ഛായാഗ്രാഹകൻ / സംവിധായകൻ)',
    coverImage: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800',
    isFeatured: false,
  },
  {
    id: 'western-ghats-ecology-doc',
    title: 'പശ്ചിമഘട്ടവും കേരളത്തിലെ പ്രകൃതിദുരന്തങ്ങളും: ഡോക്യുമെന്ററി അന്വേഷണം',
    excerpt: 'കാലാവസ്ഥാ വ്യതിയാനവും ഡാം മാനേജ്‌മെന്റും പരിശോധിക്കുന്ന ഗ്രൗണ്ട് റിപ്പോർട്ട്.',
    youtubeId: '9bZkp7q19f0',
    playlist: 'Documentaries',
    category: 'Environment',
    publishedAt: '2026-08-30T14:00:00.000Z',
    duration: '28:50',
    speaker: 'എസ്. പി. രവി',
    coverImage: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&q=80&w=800',
    isFeatured: false,
  },
  {
    id: 'grandma-stories-oral-history',
    title: 'ഗ്രാന്‍മ സ്റ്റോറീസ്: തലമുറകൾ കൈമാറിയ നാട്ടുപാട്ടുകളും കഥകളും',
    excerpt: 'മുത്തശ്ശിമാർ ഓർത്തെടുക്കുന്ന വാമൊഴി ചരിത്രവും സ്ത്രീ അനുഭവങ്ങളും.',
    youtubeId: 'L_LUpnjgPso',
    playlist: 'ഗ്രാന്‍മ സ്റ്റോറീസ്',
    category: 'Culture',
    publishedAt: '2026-08-25T11:00:00.000Z',
    duration: '19:15',
    speaker: 'എഡിറ്റോറിയൽ ടീം',
    coverImage: 'https://images.unsplash.com/photo-1516541196182-6bdb0516ed27?auto=format&fit=crop&q=80&w=800',
    isFeatured: false,
  },
  {
    id: 'editors-assembly-saniv-bhatt',
    title: 'മോദിയുടെ ജയിൽരാജ്യത്തെ 2,923 ദിവസങ്ങൾ: എഡിറ്റേഴ്സ് അസംബ്ലി ചർച്ച',
    excerpt: 'സഞ്ജീവ് ഭട്ടിന്റെ തടവറയും ഇന്ത്യൻ നിയമവ്യവസ്ഥയുടെ സമകാലിക സാഹചര്യങ്ങളും.',
    youtubeId: 'ZXsQAXx_ao0',
    playlist: 'Polarized Politics',
    category: 'Politics',
    publishedAt: '2026-08-20T18:00:00.000Z',
    duration: '41:22',
    speaker: 'മനില സി. മോഹൻ, കെ. കണ്ണൻ, ടി. ശ്രീജിത്ത്',
    coverImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800',
    isFeatured: false,
  },
];

export default function VideosPage() {
  const [activeVideo, setActiveVideo] = useState<VideoItem>(videosData[0]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>('All');

  const playlists = ['All', ...new Set(videosData.map((v) => v.playlist).filter(Boolean))] as string[];

  const filteredVideos =
    selectedPlaylist === 'All'
      ? videosData
      : videosData.filter((v) => v.playlist === selectedPlaylist);

  return (
    <div className="space-y-10 pb-16">
      {/* Portal Header */}
      <header className="border-b border-neutral-200 dark:border-neutral-800 pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
          <Film className="w-4 h-4" />
          <span>Videos &amp; Documentaries | വീഡിയോകള്‍</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
          വീഡിയോ എസ്സേകളും സംവാദങ്ങളും
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base max-w-3xl leading-relaxed">
          ഡോക്യുമെന്ററികൾ, എഡിറ്റോറിയൽ ചർച്ചകൾ, സിനിമ വിശകലനങ്ങൾ, വാമൊഴി ചരിത്രങ്ങൾ എന്നിവ ഉൾക്കൊള്ളുന്ന സമഗ്ര വീഡിയോ പ്ലാറ്റ്‌ഫോം.
        </p>
      </header>

      {/* Featured Video Active Player Dock */}
      <div className="bg-neutral-950 rounded-2xl overflow-hidden shadow-2xl border border-neutral-800 text-white">
        <div className="relative aspect-video w-full bg-black">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?autoplay=0&rel=0`}
            title={activeVideo.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>

        <div className="p-4 sm:p-6 md:p-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-full font-bold bg-brand-600 text-white">
                {activeVideo.category}
              </span>
              {activeVideo.playlist && (
                <span className="px-2.5 py-1 rounded-full bg-neutral-800 text-neutral-300 font-medium">
                  {activeVideo.playlist}
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 text-xs text-neutral-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-neutral-400" />
                {activeVideo.duration}
              </span>
            </div>
          </div>

          <h2 className="font-serif text-xl sm:text-3xl font-bold leading-snug">
            {activeVideo.title}
          </h2>

          <p className="text-neutral-300 text-sm sm:text-base leading-relaxed max-w-4xl">
            {activeVideo.excerpt}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-neutral-800 text-xs text-neutral-400">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-brand-400" />
              <span className="font-semibold text-neutral-200">
                {activeVideo.speaker}
              </span>
            </div>
            <span>Now Playing</span>
          </div>
        </div>
      </div>

      {/* Playlist / Category Filter Tabs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-2xl font-bold text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
            <Film className="w-5 h-5 text-brand-600" />
            <span>പ്ലേലിസ്റ്റുകൾ (Playlists &amp; Series)</span>
          </h3>
          <span className="text-xs text-neutral-500 font-bold">
            {filteredVideos.length} Videos
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none overscroll-x-contain pb-2">
          {playlists.map((pl) => (
            <button
              key={pl}
              onClick={() => setSelectedPlaylist(pl)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                selectedPlaylist === pl
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-neutral-100 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              {pl === 'All' ? 'എല്ലാ വീഡിയോകളും (All)' : pl}
            </button>
          ))}
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => {
          const isSelected = activeVideo.id === video.id;
          return (
            <div
              key={video.id}
              onClick={() => {
                setActiveVideo(video);
                window.scrollTo({ top: 120, behavior: 'smooth' });
              }}
              className={`group cursor-pointer flex flex-col justify-between bg-paper-card dark:bg-paper-cardDark rounded-xl border overflow-hidden shadow-sm hover:shadow-md transition-all ${
                isSelected
                  ? 'border-brand-600 ring-2 ring-brand-600/30 dark:border-brand-500'
                  : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300'
              }`}
            >
              <div>
                <div className="relative aspect-video w-full overflow-hidden bg-neutral-900">
                  {video.coverImage ? (
                    <Image
                      src={video.coverImage}
                      alt={video.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                      <Film className="w-10 h-10 text-neutral-600" />
                    </div>
                  )}

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-brand-600/90 group-hover:bg-brand-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </div>

                  {/* Duration Badge */}
                  <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded text-[11px] font-bold bg-black/80 text-white backdrop-blur-sm">
                    {video.duration}
                  </span>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                      {video.playlist || video.category}
                    </span>
                  </div>

                  <h4 className="font-serif text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-50 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2 leading-snug">
                    {video.title}
                  </h4>

                  <p className="text-neutral-500 dark:text-neutral-400 text-xs line-clamp-2 leading-relaxed">
                    {video.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-neutral-100 dark:border-neutral-800/80 mt-2 flex items-center justify-between text-xs text-neutral-500">
                <span className="line-clamp-1 font-medium text-neutral-700 dark:text-neutral-300">
                  {video.speaker}
                </span>
                {isSelected && (
                  <span className="text-brand-600 dark:text-brand-400 font-bold shrink-0">
                    Playing
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
