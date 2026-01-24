import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { parseVideoSource } from "@/lib/videoUtils";

interface SidebarVideo {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  videoType: 'html5' | 'youtube' | 'vimeo' | 'instagram' | 'tiktok';
  thumbnailUrl?: string;
  position: 'left' | 'right';
  displayDuration: number;
  isActive: boolean;
}

const FloatingSidebarVideo = () => {
  const [video, setVideo] = useState<SidebarVideo | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || '/api';

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/sidebar-videos`);

        if (!response.ok) {
          setIsLoading(false);
          return;
        }

        const data = await response.json();
        if (data.videos && data.videos.length > 0) {
          // Get the first active video (sorted by order)
          const activeVideo = data.videos.find((v: SidebarVideo) => v.isActive);
          if (activeVideo) {
            setVideo(activeVideo);

            // Auto-hide after displayDuration if set
            if (activeVideo.displayDuration > 0) {
              const timer = setTimeout(() => {
                setIsVisible(false);
              }, activeVideo.displayDuration * 1000);

              return () => clearTimeout(timer);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching sidebar video:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideo();
  }, [API_URL]);

  if (isLoading || !video || !isVisible) {
    return null;
  }

  const videoSource = parseVideoSource(video.videoUrl);
  const isYouTube = videoSource.type === 'youtube';
  const isVimeo = videoSource.type === 'vimeo';
  const isInstagram = videoSource.type === 'instagram';
  const isTikTok = videoSource.type === 'tiktok';
  const isHtml5Video = videoSource.type === 'html5';

  const baseClasses = `fixed bottom-6 ${
    video.position === 'left' ? 'left-6' : 'right-6'
  } z-40 bg-white rounded-lg shadow-2xl overflow-hidden border border-border`;

  const containerClasses = `w-72 sm:w-80 max-w-sm`;

  return (
    <div className={`${baseClasses} ${containerClasses}`}>
      {/* Close Button */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 z-50 bg-black/60 hover:bg-black/80 text-white p-1 rounded-full transition-colors"
        aria-label="Close video"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Video Container */}
      <div className="relative aspect-video bg-black">
        {isYouTube && videoSource.embedUrl && (
          <iframe
            src={videoSource.embedUrl}
            className="w-full h-full"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            frameBorder="0"
          />
        )}

        {isVimeo && videoSource.embedUrl && (
          <iframe
            src={videoSource.embedUrl}
            className="w-full h-full"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            frameBorder="0"
          />
        )}

        {isInstagram && videoSource.embedUrl && (
          <div className="w-full h-full flex items-center justify-center bg-black/10">
            <a
              href={video.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-center hover:underline"
            >
              <p className="text-sm font-medium mb-2">Instagram Reel</p>
              <p className="text-xs">Open in new window</p>
            </a>
          </div>
        )}

        {isTikTok && videoSource.embedUrl && (
          <div className="w-full h-full flex items-center justify-center bg-black/10">
            <a
              href={video.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-center hover:underline"
            >
              <p className="text-sm font-medium mb-2">TikTok Video</p>
              <p className="text-xs">Open in new window</p>
            </a>
          </div>
        )}

        {isHtml5Video && videoSource.directUrl && (
          <video
            src={String(videoSource.directUrl)}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            poster={video.thumbnailUrl}
          />
        )}
      </div>

      {/* Video Info */}
      <div className="p-3 bg-white">
        <h3 className="font-semibold text-sm text-foreground line-clamp-1">
          {video.title}
        </h3>
        {video.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
            {video.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default FloatingSidebarVideo;
