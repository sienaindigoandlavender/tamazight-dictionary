import React from 'react';
import { getAllSpecimens } from '@/lib/archive';
import SpecimenLedger from '@/components/SpecimenLedger';

export const dynamic = 'force-static';

export default function HeritageArchiveIndex() {
  // Fetch our structured flat-file database records natively
  const specimens = getAllSpecimens();

  return (
    <main className="min-h-screen bg-[#F9F9F7]">
      {/* Visual Workspace Hero Wrapper */}
      <div className="w-full bg-[#F1F1EE] border-b border-[#E4E4E0] py-20 px-4 sm:px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-[#767670]">
            Tamazgha Cultural Repository
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif text-[#1C1C1A] tracking-tight">
            The Heritage Index
          </h1>
          <p className="text-sm sm:text-base font-sans text-[#767670] max-w-xl mx-auto leading-relaxed">
            An immutable, digital ledger archiving the tangible artifacts, visual semiotics, and material culture configurations of the Amazigh civilizations.
          </p>
        </div>
      </div>

      {/* Interactive Specimen Ledger Grid / List Component */}
      <section className="py-6">
        <SpecimenLedger specimens={specimens} />
      </section>
    </main>
  );
}
