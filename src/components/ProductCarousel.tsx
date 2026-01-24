import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/data/products";

interface ProductCarouselProps {
  products: Product[];
  title?: string;
  itemsPerView?: number;
}

export default function ProductCarousel({
  products,
  title,
  itemsPerView = 4,
}: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const itemWidth = 100 / itemsPerView;
  const totalPages = Math.ceil(products.length / itemsPerView);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      goToNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay, totalPages]);

  return (
    <div className="w-full">
      {title && (
        <h2 className="text-3xl font-display font-bold text-foreground mb-8">
          {title}
        </h2>
      )}

      <div
        className="relative group"
        onMouseEnter={() => setIsAutoPlay(false)}
        onMouseLeave={() => setIsAutoPlay(true)}
      >
        {/* Carousel Container */}
        <div className="overflow-hidden bg-background">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {Array.from({ length: totalPages }).map((_, pageIndex) => (
              <div
                key={pageIndex}
                className="w-full flex-shrink-0"
                style={{ width: "100%" }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 px-4">
                  {products
                    .slice(pageIndex * itemsPerView, (pageIndex + 1) * itemsPerView)
                    .map((product, index) => (
                      <ProductCard
                        key={product.id || index}
                        product={product}
                        index={index}
                      />
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        {totalPages > 1 && (
          <>
            {/* Left Arrow */}
            <button
              onClick={goToPrevious}
              className={cn(
                "absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 md:-translate-x-20",
                "z-10 p-3 rounded-full bg-primary text-primary-foreground",
                "hover:bg-primary/90 transition-all duration-200",
                "opacity-0 group-hover:opacity-100",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              )}
              aria-label="Previous products"
              title="Previous"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Right Arrow */}
            <button
              onClick={goToNext}
              className={cn(
                "absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 md:translate-x-20",
                "z-10 p-3 rounded-full bg-primary text-primary-foreground",
                "hover:bg-primary/90 transition-all duration-200",
                "opacity-0 group-hover:opacity-100",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              )}
              aria-label="Next products"
              title="Next"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Dot Indicators */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "h-2 rounded-full transition-all duration-200",
                  currentIndex === index
                    ? "bg-primary w-8"
                    : "bg-muted hover:bg-muted-foreground w-2"
                )}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
