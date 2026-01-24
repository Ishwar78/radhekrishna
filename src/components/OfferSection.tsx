import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface Offer {
  _id: string;
  title: string;
  subtitle?: string;
  description?: string;
  backgroundImage?: string;
  badge?: string;
  ctaText: string;
  ctaLink: string;
  isActive: boolean;
}

const OfferSection = () => {
  const [offer, setOffer] = useState<Offer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        setIsLoading(true);
        const API_URL = import.meta.env.VITE_API_URL || '/api';
        const response = await fetch(`${API_URL}/offers`);

        if (response.ok) {
          const data = await response.json();
          if (data.offers && data.offers.length > 0) {
            setOffer(data.offers[0]);
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('Error fetching offer:', errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOffer();
  }, []);

  if (isLoading) {
    return (
      <section className="py-12 md:py-16 bg-gradient-to-br from-primary/5 via-accent/5 to-background">
        <div className="container mx-auto px-4 flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (!offer) return null;

  return (
    <section 
      className="py-12 md:py-16 overflow-hidden relative"
      style={offer.backgroundImage ? {
        backgroundImage: `url('${offer.backgroundImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      } : undefined}
    >
      {/* Background Overlay */}
      {offer.backgroundImage && (
        <div className="absolute inset-0 bg-black/40" />
      )}

      {!offer.backgroundImage && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-accent/5 to-background" />
      )}

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          {offer.badge && (
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-full">
                {offer.badge}
              </span>
            </div>
          )}

          {/* Title */}
          <h2 className={`font-display text-3xl md:text-5xl lg:text-6xl font-bold mb-4 ${
            offer.backgroundImage ? 'text-white drop-shadow-lg' : 'text-foreground'
          }`}>
            {offer.title}
          </h2>

          {/* Subtitle */}
          {offer.subtitle && (
            <p className={`text-lg md:text-xl mb-4 ${
              offer.backgroundImage ? 'text-white/90' : 'text-muted-foreground'
            }`}>
              {offer.subtitle}
            </p>
          )}

          {/* Description */}
          {offer.description && (
            <p className={`text-base md:text-lg mb-8 max-w-2xl mx-auto ${
              offer.backgroundImage ? 'text-white/80' : 'text-muted-foreground'
            }`}>
              {offer.description}
            </p>
          )}

          {/* CTA Button */}
          <Link
            to={offer.ctaLink}
            className="inline-block px-8 md:px-12 py-3 md:py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
          >
            {offer.ctaText}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default OfferSection;
