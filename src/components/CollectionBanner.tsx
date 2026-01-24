import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface CollectionBannerProps {
  title: string;
  subtitle?: string;
  tagline?: string;
  backgroundImage?: string;
  backgroundColor?: string;
  textColor?: string;
  productCount: number;
}

export default function CollectionBanner({
  title,
  subtitle,
  tagline,
  backgroundImage,
  backgroundColor = "bg-gradient-to-br from-primary/10 via-accent/5 to-background",
  textColor = "text-foreground",
  productCount,
}: CollectionBannerProps) {
  return (
    <div
      className="relative py-20 md:py-32 overflow-hidden min-h-96"
      style={backgroundImage ? {
        backgroundImage: `url('${backgroundImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      } : undefined}
    >
      {/* Background Color Fallback */}
      {!backgroundImage && <div className={cn("absolute inset-0", backgroundColor)} />}

      {/* Overlay - For text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/30" />

      {/* Decorative Elements */}
      {!backgroundImage && (
        <>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center">
          {/* Breadcrumb */}
          <nav className={cn(
            "text-sm mb-4 md:mb-6 flex items-center justify-center gap-2 transition-colors",
            backgroundImage
              ? "text-white/70"
              : "text-muted-foreground"
          )}>
            <Link
              to="/"
              className={cn(
                "hover:transition-colors",
                backgroundImage
                  ? "text-white/80 hover:text-white"
                  : "hover:text-primary"
              )}
            >
              Home
            </Link>
            <span>/</span>
            <span className={cn(
              "font-medium",
              backgroundImage ? "text-white/90" : textColor
            )}>
              {title}
            </span>
          </nav>

          {/* Main Title */}
          <h1 className={cn(
            "font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6",
            backgroundImage ? "text-white drop-shadow-lg" : textColor
          )}>
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p className={cn(
              "text-lg md:text-2xl mb-3 max-w-3xl mx-auto",
              backgroundImage
                ? "text-white/90 drop-shadow-md"
                : "text-muted-foreground"
            )}>
              {subtitle}
            </p>
          )}

          {/* Tagline */}
          {tagline && (
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className={cn(
                "h-1 w-12 rounded-full",
                backgroundImage ? "bg-gold/80" : "bg-gold"
              )} />
              <p className={cn(
                "font-medium text-lg tracking-wide",
                backgroundImage
                  ? "text-gold/90 drop-shadow"
                  : "text-gold"
              )}>
                {tagline}
              </p>
              <div className={cn(
                "h-1 w-12 rounded-full",
                backgroundImage ? "bg-gold/80" : "bg-gold"
              )} />
            </div>
          )}

          {/* Product Count */}
          <div className={cn(
            "inline-block mt-6 md:mt-8 px-6 py-3 rounded-full backdrop-blur-sm border transition-all",
            backgroundImage
              ? "bg-white/15 border-white/30 hover:bg-white/20"
              : "bg-white/10 border-white/20"
          )}>
            <p className={cn(
              "text-sm md:text-base",
              backgroundImage
                ? "text-white/90"
                : "text-muted-foreground"
            )}>
              <span className={cn(
                "font-semibold",
                backgroundImage ? "text-white" : "text-foreground"
              )}>
                {productCount}
              </span> exquisite pieces
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
