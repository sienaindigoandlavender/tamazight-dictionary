'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { RegionInfo, DictionaryEntry } from '@/types';

interface LanguageMapProps {
  regions: RegionInfo[];
  entries?: DictionaryEntry[];
  selectedRegion?: string | null;
  onRegionSelect?: (regionId: string | null) => void;
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

// Check if WebGL is supported
function isWebGLSupported(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return gl instanceof WebGLRenderingContext;
  } catch {
    return false;
  }
}

// Static fallback map for browsers without WebGL
function StaticMapFallback({
  regions,
  selectedRegion,
  onRegionSelect
}: {
  regions: RegionInfo[];
  selectedRegion?: string | null;
  onRegionSelect?: (regionId: string | null) => void;
}) {
  return (
    <div className="absolute inset-0 bg-[#f5f5f3] flex items-center justify-center">
      {/* Simple visual representation */}
      <div className="absolute inset-0 opacity-10">
        <svg viewBox="0 0 800 600" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          {/* Simplified North Africa outline */}
          <path
            d="M50,200 Q200,180 350,200 Q500,150 650,180 Q750,200 780,250 L780,400 Q600,380 400,400 Q200,420 50,380 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-foreground/20"
          />
        </svg>
      </div>

      {/* Region markers positioned roughly */}
      <div className="relative w-full max-w-3xl mx-auto p-8">
        <p className="text-center text-sm text-muted-foreground mb-8">
          Interactive map requires WebGL. Showing static view.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {regions.map(region => (
            <button
              key={region.id}
              onClick={() => onRegionSelect?.(region.id)}
              className={`text-left p-4 border transition-all ${
                selectedRegion === region.id
                  ? 'border-foreground bg-foreground/5'
                  : 'border-foreground/10 hover:border-foreground/30'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: region.color }}
                />
                <span className="tifinagh text-sm">{region.nameTifinagh}</span>
              </div>
              <h3 className="font-serif text-lg">{region.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">{region.speakers}</p>
              {region.status === 'active' ? (
                <Link
                  href={`/map/${region.id}`}
                  className="text-xs text-foreground hover:underline mt-2 inline-block"
                  onClick={e => e.stopPropagation()}
                >
                  Explore
                </Link>
              ) : (
                <span className="text-xs text-muted-foreground mt-2 inline-block">Coming soon</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Interactive Mapbox map
function InteractiveMap({
  regions,
  entries = [],
  selectedRegion,
  onRegionSelect
}: LanguageMapProps) {
  const [Map, setMap] = useState<typeof import('react-map-gl/mapbox') | null>(null);
  const [popupInfo, setPopupInfo] = useState<RegionInfo | null>(null);
  const [viewState, setViewState] = useState({
    latitude: 28.0,
    longitude: 0.0,
    zoom: 3.5,
  });

  // Dynamically import react-map-gl and CSS
  useEffect(() => {
    // Load CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css';
    document.head.appendChild(link);

    // Load map module
    import('react-map-gl/mapbox').then(mod => {
      setMap(mod);
    });

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const regionWordCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    entries.forEach(entry => {
      counts[entry.region] = (counts[entry.region] || 0) + 1;
    });
    return counts;
  }, [entries]);

  const handleMarkerClick = useCallback((region: RegionInfo) => {
    setPopupInfo(region);
    if (onRegionSelect) {
      onRegionSelect(region.id);
    }
  }, [onRegionSelect]);

  const getMarkerSize = (region: RegionInfo) => {
    const baseSize = 24;
    const scale = Math.log10(region.speakersNumeric) / 7;
    return baseSize + scale * 24;
  };

  if (!Map) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-muted/10">
        <div className="text-center">
          <div className="tifinagh text-4xl mb-4 animate-pulse">ⵜⴰⵎⴰⵣⵉⵖⵜ</div>
          <p className="text-sm text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  const { default: MapGL, Marker, Popup, NavigationControl } = Map;

  return (
    <div className="absolute inset-0">
      <MapGL
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/light-v11"
        minZoom={2}
        maxZoom={10}
      >
        <NavigationControl position="top-right" />

        {regions.map(region => {
          const size = getMarkerSize(region);
          const isSelected = selectedRegion === region.id;
          const wordCount = regionWordCounts[region.id] || region.wordCount;

          return (
            <Marker
              key={region.id}
              latitude={region.coordinates.lat}
              longitude={region.coordinates.lng}
              anchor="center"
              onClick={e => {
                e.originalEvent.stopPropagation();
                handleMarkerClick(region);
              }}
            >
              <div
                className={`relative cursor-pointer transition-all duration-300 ${
                  isSelected ? 'scale-125' : 'hover:scale-110'
                }`}
                style={{ width: size, height: size }}
              >
                <div
                  className={`absolute inset-0 rounded-full transition-all ${
                    isSelected ? 'ring-2 ring-offset-2 ring-foreground' : ''
                  }`}
                  style={{
                    backgroundColor: region.color,
                    opacity: region.status === 'active' ? 0.9 : 0.5,
                  }}
                />
                {wordCount > 0 && (
                  <div className="absolute -top-1 -right-1 bg-foreground text-background text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {wordCount > 99 ? '99+' : wordCount}
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white" style={{ opacity: 0.8 }} />
                </div>
              </div>
            </Marker>
          );
        })}

        {popupInfo && (
          <Popup
            latitude={popupInfo.coordinates.lat}
            longitude={popupInfo.coordinates.lng}
            anchor="bottom"
            onClose={() => setPopupInfo(null)}
            closeOnClick={false}
            className="language-map-popup"
            maxWidth="320px"
          >
            <div className="p-4 min-w-[280px]">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <span className="tifinagh text-2xl block mb-1">{popupInfo.nameTifinagh}</span>
                  <h3 className="font-serif text-xl">{popupInfo.name}</h3>
                  <p className="text-xs text-muted-foreground">{popupInfo.nameNative}</p>
                </div>
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0 mt-1"
                  style={{ backgroundColor: popupInfo.color }}
                />
              </div>
              <div className="flex gap-4 mb-4 text-xs text-muted-foreground">
                <div>
                  <span className="uppercase tracking-widest">Speakers</span>
                  <p className="text-foreground font-medium">{popupInfo.speakers}</p>
                </div>
                <div>
                  <span className="uppercase tracking-widest">Region</span>
                  <p className="text-foreground font-medium">{popupInfo.countries.join(', ')}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{popupInfo.description}</p>
              <div className="flex items-center justify-between">
                <span className={`text-xs px-2 py-1 rounded ${
                  popupInfo.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {popupInfo.status === 'active' ? 'Available' : 'Coming Soon'}
                </span>
                {popupInfo.status === 'active' && (
                  <Link href={`/map/${popupInfo.id}`} className="text-xs uppercase tracking-widest hover:underline">
                    Explore dialect
                  </Link>
                )}
              </div>
            </div>
          </Popup>
        )}
      </MapGL>

      {/* Legend */}
      <div className="absolute bottom-6 left-6 bg-background/95 backdrop-blur-sm border border-foreground/10 p-4 max-w-xs">
        <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
          Tamazight Languages
        </h4>
        <div className="space-y-2">
          {regions.slice(0, 5).map(region => (
            <button
              key={region.id}
              onClick={() => handleMarkerClick(region)}
              className={`flex items-center gap-2 w-full text-left text-sm hover:opacity-70 transition-opacity ${
                selectedRegion === region.id ? 'font-medium' : ''
              }`}
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: region.color,
                  opacity: region.status === 'active' ? 1 : 0.5
                }}
              />
              <span className="flex-1">{region.name}</span>
              {region.status !== 'active' && (
                <span className="text-xs text-muted-foreground">soon</span>
              )}
            </button>
          ))}
          {regions.length > 5 && (
            <p className="text-xs text-muted-foreground pt-1">
              +{regions.length - 5} more regions
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Main component with WebGL detection
export default function LanguageMap(props: LanguageMapProps) {
  const [supportsWebGL, setSupportsWebGL] = useState<boolean | null>(null);

  useEffect(() => {
    setSupportsWebGL(isWebGLSupported());
  }, []);

  // Show loading while checking WebGL support
  if (supportsWebGL === null) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-muted/10">
        <div className="text-center">
          <div className="tifinagh text-4xl mb-4 animate-pulse">ⵜⴰⵎⴰⵣⵉⵖⵜ</div>
          <p className="text-sm text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  // Use fallback for older browsers
  if (!supportsWebGL) {
    return <StaticMapFallback {...props} />;
  }

  return <InteractiveMap {...props} />;
}
