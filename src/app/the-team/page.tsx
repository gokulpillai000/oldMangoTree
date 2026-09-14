import React from 'react';
import Image from 'next/image';
import { getTeamMembers } from '@/lib/content';
import { Users, Mail } from 'lucide-react';

export const metadata = {
  title: 'എഡിറ്റോറിയൽ ടീം | The Team - OldmanGoTree',
  description: 'Editorial board, contributing editors, and writers of OldmanGoTree.',
};

export default function TheTeamPage() {
  const team = getTeamMembers();

  return (
    <div className="space-y-12 pb-16 max-w-6xl mx-auto">
      <header className="text-center space-y-3 max-w-3xl mx-auto pt-4">
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-3.5 py-1.5 rounded-full border border-brand-200 dark:border-brand-800">
          <Users className="w-4 h-4" />
          <span>Editorial Collective | എഡിറ്റോറിയൽ സമിതി</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
          ഓൾഡ്മാൻഗോട്രീ ടീം
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base leading-relaxed">
          സ്വതന്ത്ര മാധ്യമപ്രവർത്തനത്തിനും ആഴത്തിലുള്ള ചിന്തയ്ക്കും നേതൃത്വം നൽകുന്ന എഡിറ്റർമാരും കോളമിസ്റ്റുകളും.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {team.map((member) => (
          <div
            key={member.id}
            className="group flex flex-col justify-between bg-paper-card dark:bg-paper-cardDark rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm hover:shadow-md transition-all text-center"
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-brand-500/20 group-hover:border-brand-500 transition-colors shadow-md">
                <Image
                  src={member.avatar}
                  alt={member.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                  {member.department}
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                  {member.name}
                </h2>
                {member.englishName && (
                  <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                    {member.englishName}
                  </p>
                )}
                <p className="text-xs font-bold text-brand-700 dark:text-brand-300 pt-1">
                  {member.role}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed pt-2 border-t border-neutral-100 dark:border-neutral-800 w-full">
                {member.bio}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
