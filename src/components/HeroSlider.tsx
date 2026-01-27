import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { handleVideoError } from "@/lib/videoUtils";
import { getVideoSource } from "@/lib/videoUtils";
import heroImage1 from "@/assets/hero-model-1.jpg";
import heroImage2 from "@/assets/hero-model-2.jpg";
import heroImage3 from "@/assets/hero-model-3.jpg";

interface HeroSlide {
  _id?: string;
  image?: string;
  video?: string;
  gif?: string;
  title: string;
  subtitle: string;
  description: string;
  cta: string;
  ctaLink: string;
  mediaUrl?: string;
  mediaType?: 'video' | 'gif' | 'image';
}

const defaultSlides: HeroSlide[] = [
  {
    image: heroImage1,
    title: "New Arrivals",
    subtitle: "Festive Suit Collection",
    description: "Discover exquisite handcrafted ethnic wear for every occasion",
    cta: "Shop Now",
    ctaLink: "/shop?category=new-arrivals",
  },
  {
    image: heroImage2,
    title: "Exclusive",
    subtitle: "Royal Lehenga Collection",
    description: "Timeless elegance meets contemporary design",
    cta: "Explore Collection",
    ctaLink: "/shop?category=lehengas",
  },
  {
    image: heroImage3,
    title: "Bridal Edit",
    subtitle: "Wedding Season Special",
    description: "Make your special day unforgettable",
    cta: "View Collection",
    ctaLink: "/shop?category=bridal",
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slides, setSlides] = useState<HeroSlide[]>(defaultSlides);

  const API_URL = import.meta.env.VITE_API_URL || '/api';

  // Fetch hero media from API
  useEffect(() => {
    const fetchHeroMedia = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const response = await fetch(`${API_URL}/hero-media`, {
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
          },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          console.warn(`Hero media API returned ${response.status}, using default slides`);
          return;
        }

        const data = await response.json();
        if (data.success && data.media && data.media.length > 0) {
          setSlides(data.media);
          console.log('✅ Hero media loaded successfully');
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          console.warn('Hero media fetch timeout, using default slides');
        } else {
          console.warn('Hero media API unavailable, using default slides');
        }
        // Keep default slides on error - this is expected behavior
      }
    };

    fetchHeroMedia();
  }, [API_URL]);

  const goToSlide = useCallback((index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 800);
  }, [isAnimating]);

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % slides.length);
  }, [currentSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
  }, [currentSlide, goToSlide]);

  // Auto-scroll disabled - manual navigation only
  // useEffect(() => {
  //   const interval = setInterval(nextSlide, 6000);
  //   return () => clearInterval(interval);
  // }, [nextSlide]);

  return (
    <section
      className="relative w-full h-screen min-h-[600px] overflow-hidden"
      style={{
        backgroundImage: `
          linear-gradient(135deg, rgba(250,248,246,0.95) 0%, rgba(250,248,246,0.9) 100%),
          url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4a574' fill-opacity='0.08'%3E%3Cpath d='M30 30c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z'/%3E%3Cpath d='M30 20c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2z'/%3E%3Cpath d='M30 10c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm0-2c0 .552.448 1 1 1s1-.448 1-1-.448-1-1-1-1 .448-1 1zM30 50c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2zm0 2c0-.552-.448-1-1-1s-1 .448-1 1 .448 1 1 1 1-.448 1-1zM10 30c0 1.105.895 2 2 2s2-.895 2-2-.895-2-2-2-2 .895-2 2zm2 0c-.552 0-1 .448-1 1s.448 1 1 1 1-.448 1-1-.448-1-1-1zM50 30c0-1.105-.895-2-2-2s-2 .895-2 2 .895 2 2 2 2-.895 2-2zm-2 0c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
        `,
        backgroundSize: 'cover, 100px 100px',
        backgroundPosition: 'center, center',
        backgroundRepeat: 'no-repeat, repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Background Slides */}
      {slides.map((slide, index) => {
        // Ensure mediaUrl is a string - handle various invalid formats
        const rawMediaUrl = slide.mediaUrl || slide.image;
        let mediaUrl = '';

        if (typeof rawMediaUrl === 'string') {
          mediaUrl = rawMediaUrl.trim();
        } else if (rawMediaUrl && typeof rawMediaUrl === 'object') {
          // Try to safely convert object to string
          try {
            const stringified = JSON.stringify(rawMediaUrl);
            if (stringified && stringified !== '[object Object]') {
              mediaUrl = stringified;
            }
          } catch (e) {
            console.warn('Failed to convert mediaUrl object:', rawMediaUrl);
          }
        }

        const isVideoType = slide.mediaType === 'video';
        const isGifType = slide.mediaType === 'gif';
        const videoSource = isVideoType && mediaUrl && mediaUrl !== '[object Object]' ? getVideoSource(mediaUrl) : null;
        const isYouTube = videoSource?.type === 'youtube';
        const isInstagram = videoSource?.type === 'instagram';
        const isVimeo = videoSource?.type === 'vimeo';
        const isTikTok = videoSource?.type === 'tiktok';
        const isHtml5Video = videoSource?.type === 'html5';

        return (
          <div
            key={index}
            className={cn(
              "absolute inset-0 transition-all duration-1000 ease-out",
              index === currentSlide
                ? "opacity-100 scale-100"
                : "opacity-0 scale-105"
            )}
          >
            {/* Diagonal Media Container */}
            <div className="absolute right-0 top-0 h-full w-full overflow-hidden">
              {isYouTube && videoSource?.embedUrl ? (
                <>
                  <iframe
                    src={videoSource.embedUrl}
                    className="absolute inset-0 w-full h-full object-cover scale-110"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    frameBorder="0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
                </>
              ) : isVimeo && videoSource?.embedUrl ? (
                <>
                  <iframe
                    src={videoSource.embedUrl}
                    className="absolute inset-0 w-full h-full object-cover scale-110"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    frameBorder="0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
                </>
              ) : isInstagram && videoSource?.embedUrl ? (
                <>
                  <div className="absolute inset-0 bg-background/30 flex items-center justify-center">
                    <iframe
                      src={videoSource.embedUrl}
                      className="w-full h-full max-w-md"
                      style={{ maxHeight: '600px' }}
                      allowFullScreen
                      frameBorder="0"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
                </>
              ) : isTikTok && videoSource?.embedUrl ? (
                <>
                  <div className="absolute inset-0 bg-background/30 flex items-center justify-center">
                    <iframe
                      src={videoSource.embedUrl}
                      className="w-full h-full"
                      allowFullScreen
                      frameBorder="0"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
                </>
              ) : isHtml5Video && videoSource?.directUrl ? (
                <>
                  <video
                    src={typeof videoSource.directUrl === 'string' ? videoSource.directUrl : String(videoSource.directUrl)}
                    autoPlay
                    muted
                    loop
                    playsInline
                    onError={(e) => {
                      handleVideoError(e, String(videoSource?.directUrl || ''));
                    }}
                    className="absolute inset-0 w-full h-full object-cover scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
                </>
              ) : (
                <>
                  <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
                    style={{ backgroundImage: `url(${mediaUrl})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
                </>
              )}
            </div>
          </div>
        );
      })}

      {/* Content */}
      <div className="relative z-10 h-full w-full px-4 sm:px-6 lg:px-8">
        <div className="h-full flex items-center">
          <div className="max-w-2xl">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={cn(
                  "transition-all duration-700",
                  index === currentSlide
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8 absolute pointer-events-none"
                )}
              >
                <span className="inline-block px-4 py-1.5 bg-gold/20 text-gold rounded-full text-sm font-medium mb-6 animate-fade-in">
                  {slide.title}
                </span>
                <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4 leading-tight">
                  {slide.subtitle}
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-md">
                  {slide.description}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button variant="hero" size="xl">
                    {slide.cta}
                  </Button>
                  <Button variant="heroOutline" size="xl">
                    View All
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute bottom-8 right-8 z-20 flex gap-3">
        <button
          onClick={prevSlide}
          className="h-12 w-12 rounded-full border-2 border-gold/40 flex items-center justify-center text-gold hover:bg-gold hover:text-charcoal transition-all duration-300"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={nextSlide}
          className="h-12 w-12 rounded-full border-2 border-gold/40 flex items-center justify-center text-gold hover:bg-gold hover:text-charcoal transition-all duration-300"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              index === currentSlide
                ? "w-8 bg-gold"
                : "w-2 bg-gold/30 hover:bg-gold/50"
            )}
          />
        ))}
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-8 w-px h-32 bg-gradient-to-b from-transparent via-gold/30 to-transparent hidden lg:block" />
      <div className="absolute bottom-1/4 left-8 w-px h-32 bg-gradient-to-b from-transparent via-gold/30 to-transparent hidden lg:block" />
    </section>
  );
}
