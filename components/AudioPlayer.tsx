'use client';

import { useState, useRef, useEffect } from 'react';
import { AudioRecording, AudioCollection, Region, SubRegionTag } from '@/types';

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

// Format sub-region for display
function formatSubRegion(subRegion: SubRegionTag): string {
  return subRegion.split('-').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

// Simple props for backward compatibility
interface SimpleAudioPlayerProps {
  src?: string;
  word: string;
}

// Enhanced props for multiple recordings
interface EnhancedAudioPlayerProps {
  audio: AudioCollection;
  word: string;
}

type AudioPlayerProps = SimpleAudioPlayerProps | EnhancedAudioPlayerProps;

function isEnhancedProps(props: AudioPlayerProps): props is EnhancedAudioPlayerProps {
  return 'audio' in props && props.audio !== undefined;
}

export default function AudioPlayer(props: AudioPlayerProps) {
  const { word } = props;

  // If using enhanced mode with AudioCollection
  if (isEnhancedProps(props)) {
    return <EnhancedAudioPlayer audio={props.audio} word={word} />;
  }

  // Simple mode with single src
  return <SimpleAudioPlayer src={props.src} word={word} />;
}

// Simple audio player (original functionality)
function SimpleAudioPlayer({ src, word }: SimpleAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlay = async () => {
    if (!src || !audioRef.current) {
      setError(true);
      return;
    }

    try {
      if (isPlaying) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch {
      setError(true);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  if (!src) {
    return <DisabledButton />;
  }

  return (
    <>
      <audio ref={audioRef} src={src} onEnded={handleEnded} onError={() => setError(true)} />
      <PlayButton
        isPlaying={isPlaying}
        error={error}
        onClick={handlePlay}
        title={error ? 'Audio not available' : `Play pronunciation of "${word}"`}
      />
    </>
  );
}

// Enhanced audio player with multiple recordings
function EnhancedAudioPlayer({ audio, word }: EnhancedAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(false);
  const [showSelector, setShowSelector] = useState(false);
  const [selectedRecording, setSelectedRecording] = useState<AudioRecording | null>(
    audio.primary || audio.recordings[0] || null
  );
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const selectorRef = useRef<HTMLDivElement>(null);

  // Close selector when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
        setShowSelector(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePlay = async () => {
    if (!selectedRecording || !audioRef.current) {
      setError(true);
      return;
    }

    try {
      if (isPlaying) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
        setProgress(0);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch {
      setError(true);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && audioRef.current.duration) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  const selectRecording = (recording: AudioRecording) => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setProgress(0);
    }
    setSelectedRecording(recording);
    setError(false);
    setShowSelector(false);
  };

  if (!audio.recordings.length || !selectedRecording) {
    return <DisabledButton />;
  }

  const hasMultipleRecordings = audio.recordings.length > 1;

  return (
    <div className="relative" ref={selectorRef}>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={selectedRecording.file}
        onEnded={handleEnded}
        onError={() => setError(true)}
        onTimeUpdate={handleTimeUpdate}
      />

      {/* Main player container */}
      <div className="flex items-stretch">
        {/* Play button */}
        <div className="relative">
          <PlayButton
            isPlaying={isPlaying}
            error={error}
            onClick={handlePlay}
            title={error ? 'Audio not available' : `Play pronunciation of "${word}"`}
          />
          {/* Progress indicator */}
          {isPlaying && (
            <div
              className="absolute bottom-0 left-0 h-0.5 bg-foreground transition-all"
              style={{ width: `${progress}%` }}
            />
          )}
        </div>

        {/* Recording selector toggle */}
        {hasMultipleRecordings && (
          <button
            onClick={() => setShowSelector(!showSelector)}
            className={`h-12 px-2 border-y border-r flex items-center gap-1 transition-all ${
              showSelector
                ? 'border-foreground bg-foreground/5'
                : 'border-foreground/20 hover:border-foreground/40'
            }`}
            title="Select recording variant"
          >
            <RecordingBadge recording={selectedRecording} compact />
            <svg
              className={`w-3 h-3 transition-transform ${showSelector ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>

      {/* Recording selector dropdown */}
      {showSelector && hasMultipleRecordings && (
        <div className="absolute top-full left-0 mt-1 z-50 min-w-[280px] bg-background border border-foreground/20 shadow-lg">
          <div className="p-2 border-b border-foreground/10">
            <span className="text-xs text-muted-foreground uppercase tracking-widest">
              {audio.totalRecordings} recordings available
            </span>
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {audio.recordings.map((recording) => (
              <RecordingOption
                key={recording.id}
                recording={recording}
                isSelected={selectedRecording.id === recording.id}
                isPrimary={audio.primary?.id === recording.id}
                onClick={() => selectRecording(recording)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Recording option in dropdown
interface RecordingOptionProps {
  recording: AudioRecording;
  isSelected: boolean;
  isPrimary: boolean;
  onClick: () => void;
}

function RecordingOption({ recording, isSelected, isPrimary, onClick }: RecordingOptionProps) {
  const speaker = recording.source.speaker;

  return (
    <button
      onClick={onClick}
      className={`w-full p-3 text-left transition-colors ${
        isSelected
          ? 'bg-foreground/5 border-l-2 border-foreground'
          : 'hover:bg-foreground/5 border-l-2 border-transparent'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          {/* Region and sub-region */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm">
              {regionNames[recording.region]}
            </span>
            {recording.subRegion && (
              <span className="text-xs text-muted-foreground">
                ({formatSubRegion(recording.subRegion)})
              </span>
            )}
            {isPrimary && (
              <span className="text-[10px] px-1.5 py-0.5 bg-foreground text-background uppercase tracking-wider">
                Primary
              </span>
            )}
          </div>

          {/* Speaker info */}
          {speaker && (
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
              {speaker.gender && (
                <span>{speaker.gender === 'male' ? 'Male' : speaker.gender === 'female' ? 'Female' : 'Other'}</span>
              )}
              {speaker.ageGroup && (
                <>
                  {speaker.gender && <span>·</span>}
                  <span className="capitalize">{speaker.ageGroup.replace('-', ' ')}</span>
                </>
              )}
              {!speaker.anonymous && speaker.name && (
                <>
                  <span>·</span>
                  <span>{speaker.name}</span>
                </>
              )}
            </div>
          )}

          {/* Source info */}
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <SourceBadge type={recording.source.type} />
            <QualityBadge quality={recording.source.quality} />
            {recording.verified && <VerifiedBadge />}
            {recording.speed && recording.speed !== 'normal' && (
              <span className="text-[10px] px-1.5 py-0.5 border border-foreground/20 text-muted-foreground capitalize">
                {recording.speed}
              </span>
            )}
          </div>
        </div>

        {/* Duration */}
        {recording.duration && (
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {formatDuration(recording.duration)}
          </span>
        )}
      </div>
    </button>
  );
}

// Compact badge showing current recording info
interface RecordingBadgeProps {
  recording: AudioRecording;
  compact?: boolean;
}

function RecordingBadge({ recording, compact }: RecordingBadgeProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-1.5 text-xs">
        <span className="text-muted-foreground">{regionNames[recording.region]}</span>
        {recording.source.type === 'ai-generated' && (
          <span className="text-[10px] px-1 py-0.5 bg-foreground/10 text-muted-foreground">AI</span>
        )}
        {recording.verified && (
          <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">{regionNames[recording.region]}</span>
      <SourceBadge type={recording.source.type} />
      {recording.verified && <VerifiedBadge />}
    </div>
  );
}

// Source type badge
function SourceBadge({ type }: { type: AudioRecording['source']['type'] }) {
  const labels: Record<typeof type, string> = {
    'human': 'Human',
    'ai-generated': 'AI',
    'field-recording': 'Field',
    'broadcast': 'Broadcast',
  };

  const isAI = type === 'ai-generated';

  return (
    <span className={`text-[10px] px-1.5 py-0.5 border uppercase tracking-wider ${
      isAI
        ? 'border-amber-500/30 text-amber-600 bg-amber-500/10'
        : 'border-foreground/20 text-muted-foreground'
    }`}>
      {labels[type]}
    </span>
  );
}

// Quality badge
function QualityBadge({ quality }: { quality: AudioRecording['source']['quality'] }) {
  const colors: Record<typeof quality, string> = {
    'studio': 'border-green-500/30 text-green-600 bg-green-500/10',
    'professional': 'border-blue-500/30 text-blue-600 bg-blue-500/10',
    'amateur': 'border-foreground/20 text-muted-foreground',
    'field': 'border-orange-500/30 text-orange-600 bg-orange-500/10',
  };

  return (
    <span className={`text-[10px] px-1.5 py-0.5 border capitalize ${colors[quality]}`}>
      {quality}
    </span>
  );
}

// Verified badge
function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 border border-green-500/30 text-green-600 bg-green-500/10">
      <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
      Verified
    </span>
  );
}

// Play button component
interface PlayButtonProps {
  isPlaying: boolean;
  error: boolean;
  onClick: () => void;
  title: string;
}

function PlayButton({ isPlaying, error, onClick, title }: PlayButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={error}
      className={`w-12 h-12 border flex items-center justify-center transition-all ${
        error
          ? 'border-foreground/10 text-muted-foreground/50 cursor-not-allowed'
          : isPlaying
          ? 'border-foreground bg-foreground text-background'
          : 'border-foreground/20 hover:border-foreground hover:bg-foreground hover:text-background'
      }`}
      title={title}
    >
      {isPlaying ? (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
      )}
    </button>
  );
}

// Disabled button component
function DisabledButton() {
  return (
    <button
      disabled
      className="w-12 h-12 border border-foreground/10 flex items-center justify-center text-muted-foreground/50 cursor-not-allowed"
      title="Audio not available"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
      </svg>
    </button>
  );
}

// Format duration in seconds to mm:ss
function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
