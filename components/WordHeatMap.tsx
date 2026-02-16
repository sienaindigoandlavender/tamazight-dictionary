'use client';

import { useState, useEffect, useMemo } from 'react';
import { RegionalUsage, Region, SemanticShift } from '@/types';
import regionsData from '@/data/regions.json';

interface WordHeatMapProps {
  word: string;
  tifinagh: string;
  regionalUsage: RegionalUsage[];
  semanticShifts?: SemanticShift[];
  isUniversal?: boolean;
  isPanBerber?: boolean;
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

// Frequency to intensity mapping (0-100)
const frequencyIntensity: Record<RegionalUsage['frequency'], number> = {
  'very-common': 100,
  'common': 75,
  'uncommon': 50,
  'rare': 25,
  'unknown': 10,
  'not-used': 0,
};

// Frequency colors (from most intense to least)
const frequencyColors: Record<RegionalUsage['frequency'], string> = {
  'very-common': '#059669', // emerald-600
  'common': '#10b981',      // emerald-500
  'uncommon': '#6ee7b7',    // emerald-300
  'rare': '#d1fae5',        // emerald-100
  'unknown': '#f3f4f6',     // gray-100
  'not-used': '#e5e7eb',    // gray-200
};

// Status colors for border
const statusColors: Record<RegionalUsage['status'], string> = {
  'active': '#059669',
  'declining': '#f59e0b',
  'reviving': '#3b82f6',
  'archaic': '#9ca3af',
  'obsolete': '#ef4444',
};

// Region display names
const regionNames: Record<Region, string> = {
  'tachelhit': 'Tachelhit',
  'kabyle': 'Kabyle',
  'tarifit': 'Tarifit',
  'central-atlas': 'Central Atlas',
  'tuareg': 'Tuareg',
  'zenaga': 'Zenaga',
  'ghomara': 'Ghomara',
};

// Check WebGL support
function isWebGLSupported(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
  } catch {
    return false;
  }
}

// Get region info from data
function getRegionInfo(regionId: Region) {
  return regionsData.regions.find(r => r.id === regionId);
}

// Interactive Map Component
function InteractiveHeatMap({
  word,
  tifinagh,
  regionalUsage,
  semanticShifts,
}: WordHeatMapProps) {
  const [mapboxModule, setMapboxModule] = useState<typeof import('react-map-gl/mapbox') | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<RegionalUsage | null>(null);
  const [viewState, setViewState] = useState({
    latitude: 28.0,
    longitude: 0.0,
    zoom: 3,
  });

  // Load Mapbox
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css';
    document.head.appendChild(link);

    import('react-map-gl/mapbox').then(mod => setMapboxModule(mod));

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Build usage map for quick lookup
  const usageByRegion = useMemo(() => {
    const map = new Map<Region, RegionalUsage>();
    regionalUsage.forEach(usage => map.set(usage.region, usage));
    return map;
  }, [regionalUsage]);

  // Get semantic shift for a region
  const getSemanticShift = (region: Region): SemanticShift | undefined => {
    return semanticShifts?.find(s => s.inRegion === region);
  };

  if (!mapboxModule) {
    return (
      <div className="h-[400px] bg-muted/10 flex items-center justify-center">
        <div className="text-center">
          <div className="tifinagh text-3xl mb-2 animate-pulse">{tifinagh}</div>
          <p className="text-sm text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  const { default: MapGL, Marker, NavigationControl } = mapboxModule;

  return (
    <div className="relative h-[400px] border border-foreground/10">
      <MapGL
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/light-v11"
        minZoom={2}
        maxZoom={8}
      >
        <NavigationControl position="top-right" showCompass={false} />

        {/* Render region markers */}
        {regionsData.regions.map(region => {
          const usage = usageByRegion.get(region.id as Region);
          const frequency = usage?.frequency || 'unknown';
          const intensity = frequencyIntensity[frequency];
          const color = frequencyColors[frequency];
          const hasSemanticShift = !!getSemanticShift(region.id as Region);

          // Calculate marker size based on intensity
          const size = 20 + (intensity / 100) * 30;

          return (
            <Marker
              key={region.id}
              latitude={region.coordinates.lat}
              longitude={region.coordinates.lng}
              anchor="center"
            >
              <div
                className="relative cursor-pointer transition-all duration-200 hover:scale-110"
                style={{ width: size, height: size }}
                onMouseEnter={() => usage && setHoveredRegion(usage)}
                onMouseLeave={() => setHoveredRegion(null)}
              >
                {/* Main circle */}
                <div
                  className="absolute inset-0 rounded-full transition-all"
                  style={{
                    backgroundColor: color,
                    opacity: frequency === 'not-used' ? 0.3 : 0.85,
                    border: usage ? `2px solid ${statusColors[usage.status]}` : '2px solid #9ca3af',
                  }}
                />

                {/* Semantic shift indicator */}
                {hasSemanticShift && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border border-white" />
                )}

                {/* Center dot */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: frequency === 'not-used' ? '#9ca3af' : 'white' }}
                  />
                </div>
              </div>
            </Marker>
          );
        })}
      </MapGL>

      {/* Hover tooltip */}
      {hoveredRegion && (
        <div className="absolute top-4 left-4 bg-background/95 backdrop-blur-sm border border-foreground/10 p-4 max-w-xs z-10">
          <RegionTooltip
            usage={hoveredRegion}
            semanticShift={getSemanticShift(hoveredRegion.region)}
          />
        </div>
      )}

      {/* Legend */}
      <HeatMapLegend />

      {/* Word label */}
      <div className="absolute top-4 right-16 bg-background/95 backdrop-blur-sm border border-foreground/10 px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="tifinagh text-lg">{tifinagh}</span>
          <span className="font-serif">{word}</span>
        </div>
      </div>
    </div>
  );
}

// Static fallback for browsers without WebGL
function StaticHeatMap({ word, tifinagh, regionalUsage, semanticShifts }: WordHeatMapProps) {
  const [selectedRegion, setSelectedRegion] = useState<RegionalUsage | null>(null);

  // Build usage map
  const usageByRegion = useMemo(() => {
    const map = new Map<Region, RegionalUsage>();
    regionalUsage.forEach(usage => map.set(usage.region, usage));
    return map;
  }, [regionalUsage]);

  const getSemanticShift = (region: Region): SemanticShift | undefined => {
    return semanticShifts?.find(s => s.inRegion === region);
  };

  return (
    <div className="border border-foreground/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="tifinagh text-xl">{tifinagh}</span>
          <span className="font-serif text-lg">{word}</span>
        </div>
        <span className="text-xs text-muted-foreground">Regional Distribution</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
        {regionsData.regions.map(region => {
          const usage = usageByRegion.get(region.id as Region);
          const frequency = usage?.frequency || 'unknown';
          const color = frequencyColors[frequency];
          const hasSemanticShift = !!getSemanticShift(region.id as Region);
          const isSelected = selectedRegion?.region === region.id;

          return (
            <button
              key={region.id}
              onClick={() => setSelectedRegion(usage || null)}
              className={`relative p-3 text-left transition-all ${
                isSelected ? 'ring-2 ring-foreground' : ''
              }`}
              style={{
                backgroundColor: color,
                opacity: frequency === 'not-used' ? 0.5 : 1,
              }}
            >
              {hasSemanticShift && (
                <div className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full" />
              )}
              <span className="tifinagh text-sm block mb-1" style={{
                color: frequency === 'very-common' || frequency === 'common' ? 'white' : '#374151'
              }}>
                {region.nameTifinagh}
              </span>
              <span className="text-xs font-medium" style={{
                color: frequency === 'very-common' || frequency === 'common' ? 'white' : '#374151'
              }}>
                {region.name}
              </span>
              {usage && (
                <span className="text-[10px] block mt-1 capitalize" style={{
                  color: frequency === 'very-common' || frequency === 'common' ? 'rgba(255,255,255,0.8)' : '#6b7280'
                }}>
                  {usage.frequency.replace('-', ' ')}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected region details */}
      {selectedRegion && (
        <div className="border-t border-foreground/10 pt-4">
          <RegionTooltip
            usage={selectedRegion}
            semanticShift={getSemanticShift(selectedRegion.region)}
          />
        </div>
      )}

      {/* Legend */}
      <div className="border-t border-foreground/10 pt-4 mt-4">
        <HeatMapLegend inline />
      </div>
    </div>
  );
}

// Region tooltip/details component
function RegionTooltip({
  usage,
  semanticShift
}: {
  usage: RegionalUsage;
  semanticShift?: SemanticShift;
}) {
  const regionInfo = getRegionInfo(usage.region);

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        {regionInfo && (
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: regionInfo.color }}
          />
        )}
        <h4 className="font-serif text-lg">{regionNames[usage.region]}</h4>
      </div>

      <div className="space-y-2 text-sm">
        {/* Frequency and status */}
        <div className="flex flex-wrap gap-2">
          <span
            className="text-xs px-2 py-0.5 capitalize"
            style={{
              backgroundColor: frequencyColors[usage.frequency],
              color: usage.frequency === 'very-common' || usage.frequency === 'common' ? 'white' : '#374151'
            }}
          >
            {usage.frequency.replace('-', ' ')}
          </span>
          <span
            className="text-xs px-2 py-0.5 border capitalize"
            style={{ borderColor: statusColors[usage.status], color: statusColors[usage.status] }}
          >
            {usage.status}
          </span>
          {usage.confidence && (
            <span className="text-xs px-2 py-0.5 bg-foreground/5 text-muted-foreground">
              {usage.confidence} confidence
            </span>
          )}
        </div>

        {/* Generational use */}
        {usage.generationalUse && (
          <p className="text-muted-foreground">
            <span className="text-xs uppercase tracking-widest mr-2">Usage:</span>
            <span className="capitalize">{usage.generationalUse.replace('-', ' ')}</span>
          </p>
        )}

        {/* Local form if different */}
        {usage.localForm && (
          <p className="text-muted-foreground">
            <span className="text-xs uppercase tracking-widest mr-2">Local form:</span>
            <span className="font-medium text-foreground">{usage.localForm}</span>
            {usage.localTifinagh && (
              <span className="tifinagh ml-2">{usage.localTifinagh}</span>
            )}
          </p>
        )}

        {/* Local meanings */}
        {usage.localMeanings && usage.localMeanings.length > 0 && (
          <div>
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Local meanings:</span>
            <p className="mt-1">{usage.localMeanings.join(', ')}</p>
          </div>
        )}

        {/* Semantic notes */}
        {usage.semanticNotes && (
          <p className="text-muted-foreground italic">{usage.semanticNotes}</p>
        )}

        {/* Semantic shift info */}
        {semanticShift && (
          <div className="mt-3 p-2 bg-amber-50 border border-amber-200">
            <div className="flex items-center gap-1 mb-1">
              <div className="w-2 h-2 bg-amber-500 rounded-full" />
              <span className="text-xs uppercase tracking-widest text-amber-700">Semantic Shift</span>
            </div>
            <p className="text-sm text-amber-800">
              <span className="line-through opacity-60">{semanticShift.originalMeaning}</span>
              <span className="mx-2">→</span>
              <span className="font-medium">{semanticShift.shiftedMeaning}</span>
            </p>
            {semanticShift.notes && (
              <p className="text-xs text-amber-700 mt-1">{semanticShift.notes}</p>
            )}
          </div>
        )}

        {/* Verification info */}
        {usage.lastVerified && (
          <p className="text-xs text-muted-foreground">
            Last verified: {new Date(usage.lastVerified).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
}

// Heat map legend
function HeatMapLegend({ inline }: { inline?: boolean }) {
  const frequencies: RegionalUsage['frequency'][] = [
    'very-common', 'common', 'uncommon', 'rare', 'unknown'
  ];

  if (inline) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs text-muted-foreground uppercase tracking-widest">Frequency:</span>
        {frequencies.map(freq => (
          <div key={freq} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: frequencyColors[freq] }}
            />
            <span className="text-xs capitalize">{freq.replace('-', ' ')}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur-sm border border-foreground/10 p-3">
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">
        Usage Frequency
      </span>
      <div className="space-y-1">
        {frequencies.map(freq => (
          <div key={freq} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: frequencyColors[freq] }}
            />
            <span className="text-xs capitalize">{freq.replace('-', ' ')}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-foreground/10 mt-2 pt-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-amber-500 rounded-full" />
          <span className="text-[10px] text-muted-foreground">Semantic shift</span>
        </div>
      </div>
    </div>
  );
}

// Main component with WebGL detection
export default function WordHeatMap(props: WordHeatMapProps) {
  const [supportsWebGL, setSupportsWebGL] = useState<boolean | null>(null);

  useEffect(() => {
    setSupportsWebGL(isWebGLSupported());
  }, []);

  // Don't render if no regional data
  if (!props.regionalUsage || props.regionalUsage.length === 0) {
    return null;
  }

  // Loading state
  if (supportsWebGL === null) {
    return (
      <div className="h-[400px] bg-muted/10 flex items-center justify-center">
        <div className="text-center">
          <div className="tifinagh text-3xl mb-2 animate-pulse">{props.tifinagh}</div>
          <p className="text-sm text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  // Use static fallback if WebGL not supported
  if (!supportsWebGL) {
    return <StaticHeatMap {...props} />;
  }

  return <InteractiveHeatMap {...props} />;
}
