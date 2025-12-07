"use client";

import { useState } from "react";
import { Play, ExternalLink } from "lucide-react";

interface VideoEmbedProps {
  src: string;
  title: string;
  thumbnail?: string;
  platform?: "youtube" | "vimeo" | "custom";
  aspectRatio?: "16:9" | "4:3" | "1:1";
}

export default function VideoEmbed({
  src,
  title,
  thumbnail,
  platform = "youtube",
  aspectRatio = "16:9",
}: VideoEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Extract video ID and generate embed URL
  const getEmbedUrl = () => {
    if (platform === "youtube") {
      // Handle various YouTube URL formats
      const regExp = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&\n?#]+)/;
      const match = src.match(regExp);
      const videoId = match ? match[1] : src;
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    }
    if (platform === "vimeo") {
      const regExp = /vimeo\.com\/(\d+)/;
      const match = src.match(regExp);
      const videoId = match ? match[1] : src;
      return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
    }
    return src;
  };

  // Generate thumbnail if not provided
  const getThumbnail = () => {
    if (thumbnail) return thumbnail;
    if (platform === "youtube") {
      const regExp = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&\n?#]+)/;
      const match = src.match(regExp);
      const videoId = match ? match[1] : src;
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
    return null;
  };

  const aspectRatioClass = {
    "16:9": "aspect-video",
    "4:3": "aspect-[4/3]",
    "1:1": "aspect-square",
  };

  const thumbnailUrl = getThumbnail();

  return (
    <div className="my-6">
      <div
        className={`relative ${aspectRatioClass[aspectRatio]} rounded-xl overflow-hidden border border-blue-500/10 bg-white dark:bg-navy-900`}
      >
        {isLoaded ? (
          <iframe
            src={getEmbedUrl()}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <button
            onClick={() => setIsLoaded(true)}
            className="absolute inset-0 w-full h-full flex items-center justify-center group"
          >
            {thumbnailUrl && (
              <img
                src={thumbnailUrl}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-slate-50 dark:bg-navy-950/40 group-hover:bg-slate-50 dark:bg-navy-950/50 transition-colors" />
            <div className="relative z-10 w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
              <Play className="w-8 h-8 text-navy-950 ml-1" fill="currentColor" />
            </div>
          </button>
        )}
      </div>
      <div className="flex items-center justify-between mt-2">
        <p className="text-sm text-slate-500 dark:text-navy-400">{title}</p>
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-400 transition-colors"
        >
          <span>Abrir no {platform === "youtube" ? "YouTube" : platform === "vimeo" ? "Vimeo" : "site"}</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
