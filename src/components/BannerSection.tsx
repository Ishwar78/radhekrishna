import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Banner {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  category: string;
  isActive: boolean;
  order: number;
}

export default function BannerSection() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const API_URL = import.meta.env.VITE_API_URL || '/api';

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch(`${API_URL}/banners`);
        if (!response.ok) throw new Error('Failed to fetch banners');

        const data = await response.json();
        if (data.success && data.banners && data.banners.length > 0) {
          setBanners(data.banners);
        }
      } catch (error) {
        console.error('Error fetching banners:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanners();
  }, [API_URL]);

  if (isLoading) {
    return (
      <section className="relative py-12 bg-muted">
        <div className="container mx-auto px-4 flex items-center justify-center min-h-80">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (!banners || banners.length === 0) {
    return null;
  }

  const currentBanner = banners[currentIndex] || banners[0];
  const nextIndex = (currentIndex + 1) % banners.length;
  const prevIndex = (currentIndex - 1 + banners.length) % banners.length;

  const handleNext = () => {
    setCurrentIndex(nextIndex);
  };

  const handlePrev = () => {
    setCurrentIndex(prevIndex);
  };

  return (
    <section className="relative py-8 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Carousel Container */}
        <div className="relative rounded-2xl overflow-hidden bg-muted shadow-xl">
          {/* Banner Image */}
          <div className="relative min-h-96 w-full overflow-hidden">
            <img
              src={currentBanner.imageUrl}
              alt={currentBanner.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/1200x400?text=Banner';
              }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-center items-start p-8 md:p-12">
              <div className="max-w-2xl">
                <span className="inline-block px-4 py-1.5 bg-gold/20 text-gold rounded-full text-sm font-medium mb-4">
                  {currentBanner.category.replace(/_/g, ' ').toUpperCase()}
                </span>
                <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-3 leading-tight">
                  {currentBanner.subtitle}
                </h2>
                <p className="text-lg text-muted-foreground mb-6 max-w-xl">
                  {currentBanner.description}
                </p>
                <Link to={currentBanner.ctaLink}>
                  <Button variant="hero" size="lg">
                    {currentBanner.ctaText}
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          {banners.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-gold/20 hover:bg-gold/40 text-gold transition-all duration-300 backdrop-blur-sm"
                aria-label="Previous banner"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-gold/20 hover:bg-gold/40 text-gold transition-all duration-300 backdrop-blur-sm"
                aria-label="Next banner"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Indicator Dots */}
          {banners.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex ? 'w-8 bg-gold' : 'w-2 bg-gold/30 hover:bg-gold/50'
                  }`}
                  aria-label={`Go to banner ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
