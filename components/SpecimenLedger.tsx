'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LayoutGrid, List } from 'lucide-react';
import type { ArchiveSpecimen } from '@/lib/archive';

interface SpecimenLedgerProps {
  specimens: ArchiveSpecimen[];
}

export default function SpecimenLedger({ specimens }: SpecimenLedgerProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'ledger'>('grid');

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Archive Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#E4E4E0] pb-6 mb-12">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#767670]">Collection Catalog</span>
          <h2 className="text-3xl font-serif mt-1 text-[#1C1C1A]">Material & Ephemeral Heritage</h2>
        </div>
        
        {/* Toggle Mode */}
        <div className="flex items-center space-x-4 mt-4 sm:mt-0 border border-[#E4E4E0] rounded p-1 bg-[#F1F1EE]">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded transition-colors ${viewMode === 'grid' ? 'bg-white text-[#1C1C1A] shadow-sm' : 'text-[#767670] hover:text-[#1C1C1A]'}`}
            title="Grid Specimen View"
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => setViewMode('ledger')}
            className={`p-1.5 rounded transition-colors ${viewMode === 'ledger' ? 'bg-white text-[#1C1C1A] shadow-sm' : 'text-[#767670] hover:text-[#1C1C1A]'}`}
            title="Clinical Ledger View"
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {specimens.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-[#E4E4E0] rounded">
          <p className="text-sm font-mono text-[#767670]">No specimens indexed in this collection segment.</p>
        </div>
      ) : viewMode === 'grid' ? (
        /* Visual Display Option */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {specimens.map((item) => (
            <Link 
              key={item.catalogId} 
              href={`/heritage/${item.category}/${item.slug}`}
              className="group flex flex-col space-y-4"
            >
              <div className="aspect-[4/5] w-full bg-[#F1F1EE] border border-[#E4E4E0] flex items-center justify-center overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                <span className="text-[10px] font-mono text-[#767670] tracking-widest uppercase">{item.catalogId}</span>
              </div>
              
              <div className="flex flex-col space-y-1">
                <div className="flex justify-between items-baseline">
                  <span className="text-[10px] font-mono tracking-wider text-[#767670] uppercase">{item.classification}</span>
                  <span className="text-xs font-mono text-[#767670]">{item.catalogId}</span>
                </div>
                <h3 className="text-lg font-serif text-[#1C1C1A] group-hover:underline decoration-1 underline-offset-4">
                  {item.title} <span className="text-sm font-normal text-[#767670] ml-1 font-sans">{item.tifinagh}</span>
                </h3>
                <p className="text-xs text-[#767670] font-sans truncate">{item.provenance} — {item.era}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        /* Document Ledger List Option */
        <div className="overflow-x-auto border border-[#E4E4E0] bg-white">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="bg-[#F1F1EE] border-b border-[#E4E4E0] text-[#767670] uppercase tracking-wider">
                <th className="p-4 font-normal">ID</th>
                <th className="p-4 font-normal">Classification</th>
                <th className="p-4 font-normal">Designation</th>
                <th className="p-4 font-normal">Provenance / Origin</th>
                <th className="p-4 font-normal">Era</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E4E0] text-[#1C1C1A]">
              {specimens.map((item) => (
                <tr key={item.catalogId} className="hover:bg-[#F1F1EE] transition-colors group">
                  <td className="p-4 text-[#767670] font-mono whitespace-nowrap">{item.catalogId}</td>
                  <td className="p-4 text-[#767670] whitespace-nowrap">{item.classification}</td>
                  <td className="p-4 font-serif text-sm">
                    <Link href={`/heritage/${item.category}/${item.slug}`} className="hover:underline text-[#1C1C1A]">
                      {item.title} <span className="text-xs text-[#767670] font-sans ml-1">{item.tifinagh}</span>
                    </Link>
                  </td>
                  <td className="p-4 whitespace-nowrap">{item.provenance}</td>
                  <td className="p-4 text-[#767670] whitespace-nowrap">{item.era}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
