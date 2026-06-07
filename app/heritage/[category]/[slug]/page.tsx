import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { getSpecimenBySlug } from '@/lib/archive';

interface SpecimenPageProps {
  params: {
    category: string;
    slug: string;
  };
}

export default function SpecimenRecordPage({ params }: SpecimenPageProps) {
  const { category, slug } = params;
  
  // Look up the matching markdown record via our utility parsing engine
  const specimen = getSpecimenBySlug(category, slug);

  if (!specimen) {
    notFound();
  }

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12 bg-[#F9F9F7] min-h-screen text-[#1C1C1A]">
      {/* Breadcrumb Navigation */}
      <div className="mb-12">
        <Link 
          href="/heritage" 
          className="inline-flex items-center text-xs font-mono uppercase tracking-wider text-[#767670] hover:text-[#1C1C1A] transition-colors"
        >
          <ChevronLeft size={14} className="mr-1" /> Back to Catalog
        </Link>
      </div>

      {/* Main Structural Layout Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        
        {/* LEFT COLUMN: Narrative & Prose Descriptions (7 Columns) */}
        <div className="lg:col-span-7 flex flex-col space-y-8">
          <div>
            <span className="text-xs font-mono text-[#767670] uppercase tracking-widest">{specimen.classification}</span>
            <h1 className="text-4xl sm:text-5xl font-serif mt-2 mb-1 tracking-tight leading-none">
              {specimen.title}
            </h1>
            <p className="text-xl font-sans text-[#767670] tracking-wide">{specimen.tifinagh}</p>
          </div>

          {/* Master Visual Specimen Container */}
          <div className="aspect-[4/5] w-full bg-[#F1F1EE] border border-[#E4E4E0] flex items-center justify-center grayscale">
            <span className="text-xs font-mono text-[#767670] uppercase tracking-widest">
              Visual Document {specimen.catalogId}
            </span>
          </div>

          {/* Core Descriptive Text Block */}
          <article className="prose prose-neutral font-sans text-base leading-relaxed text-[#1C1C1A] space-y-6 max-w-none
            prose-headings:font-serif prose-headings:font-normal prose-headings:mt-8 prose-headings:mb-4
            prose-h3:text-xl prose-h3:border-b prose-h3:border-[#E4E4E0] prose-h3:pb-2">
            {specimen.content.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('### ')) {
                return <h3 key={idx}>{paragraph.replace('### ', '')}</h3>;
              }
              return <p key={idx} className="whitespace-pre-line">{paragraph}</p>;
            })}
          </article>
        </div>

        {/* RIGHT COLUMN: The Metadata Ledger Card (5 Columns) */}
        <div className="lg:col-span-5">
          <div className="sticky top-8 border border-[#E4E4E0] bg-[#F1F1EE] p-6 sm:p-8 rounded-sm font-mono text-xs space-y-6">
            <div className="border-b border-[#E4E4E0] pb-4">
              <span className="text-[#767670] uppercase tracking-wider block mb-1">Catalog Reference</span>
              <span className="text-base font-normal text-[#1C1C1A]">{specimen.catalogId}</span>
            </div>

            <div className="grid grid-cols-1 gap-y-4">
              <div>
                <span className="text-[#767670] uppercase tracking-wider block">Classification</span>
                <span className="text-[#1C1C1A] mt-0.5 block font-sans text-sm">{specimen.classification}</span>
              </div>

              <div>
                <span className="text-[#767670] uppercase tracking-wider block">Material Composition</span>
                <span className="text-[#1C1C1A] mt-0.5 block font-sans text-sm">{specimen.medium}</span>
              </div>

              <div>
                <span className="text-[#767670] uppercase tracking-wider block">Macro Region</span>
                <span className="text-[#1C1C1A] mt-0.5 block font-sans text-sm">{specimen.region}</span>
              </div>

              <div>
                <span className="text-[#767670] uppercase tracking-wider block">Tribal Provenance / Point of Origin</span>
                <span className="text-[#1C1C1A] mt-0.5 block font-sans text-sm">{specimen.provenance}</span>
              </div>

              <div>
                <span className="text-[#767670] uppercase tracking-wider block">Estimated Production Era</span>
                <span className="text-[#1C1C1A] mt-0.5 block font-sans text-sm">{specimen.era}</span>
              </div>
            </div>

            <div className="border-t border-[#E4E4E0] pt-6 text-[10px] text-[#767670] leading-normal uppercase tracking-wider">
              Permanent Record Archive Entry. Intangible & Material Heritage Vault.
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
