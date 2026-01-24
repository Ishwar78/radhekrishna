import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, Eye, ShoppingBag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import QuickViewModal from "@/components/QuickViewModal";
import SectionHeader from "@/components/SectionHeader";
import { Product } from "@/data/products";
import { normalizeProduct } from "@/lib/normalizeProduct";

const API_URL = import.meta.env.VITE_API_URL || '/api';

interface ProductCardProps {
  product: Product;
  index: number;
}

function ProductCard({ product, index }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const productId = product._id || product.id;
  const isWishlisted = isInWishlist(productId as string | number);
  const hoverImage = (product.images && product.images[1]) || product.image;
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      id: productId as string | number,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: product.category,
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist({
      id: productId as string | number,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: product.category,
      discount,
    });
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsQuickViewOpen(true);
  };

  return (
    <>
      <div
        className="group animate-fade-in-up"
        style={{ animationDelay: `${index * 100}ms` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden rounded-lg bg-card shadow-soft group-hover:shadow-hover transition-all duration-500">
          <Link to={`/product/${productId}`} className="block relative aspect-[3/4] overflow-hidden">
            <img
              src={isHovered ? hoverImage : product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
              loading="lazy"
            />

            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {discount > 0 && (
                <span className="bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded">
                  -{discount}%
                </span>
              )}
              {product.isNew && (
                <span className="bg-gold text-charcoal text-xs font-bold px-2 py-1 rounded">
                  NEW
                </span>
              )}
              {product.isBestseller && (
                <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">
                  BESTSELLER
                </span>
              )}
            </div>

            <div className={cn(
              "absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300",
              isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
            )}>
              <button
                onClick={handleToggleWishlist}
                className={cn(
                  "h-9 w-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-md",
                  isWishlisted
                    ? "bg-destructive text-destructive-foreground"
                    : "bg-background text-foreground hover:bg-primary hover:text-primary-foreground"
                )}
              >
                <Heart className={cn("h-4 w-4", isWishlisted && "fill-current")} />
              </button>
              <button
                onClick={handleQuickView}
                className="h-9 w-9 rounded-full bg-background text-foreground hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-300 shadow-md"
              >
                <Eye className="h-4 w-4" />
              </button>
            </div>

            <div className={cn(
              "absolute bottom-0 left-0 right-0 p-3 transition-all duration-300",
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}>
              <Button variant="gold" className="w-full gap-2" onClick={handleAddToCart}>
                <ShoppingBag className="h-4 w-4" />
                Add to Cart
              </Button>
            </div>
          </Link>

          <div className="p-4">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              {product.category}
            </span>
            <Link to={`/product/${productId}`}>
              <h3 className="font-display text-lg font-semibold text-foreground mt-1 group-hover:text-primary transition-colors line-clamp-1">
                {product.name}
              </h3>
            </Link>
            <div className="flex items-center gap-2 mt-2">
              <span className="font-display text-xl font-bold text-primary">
                ₹{product.price.toLocaleString()}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-sm text-muted-foreground line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
}

export default function TrendingProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch(`${API_URL}/products?limit=12`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        if (data.success && data.products) {
          const normalizedProducts = (data.products || []).slice(0, 12).map((p: any) => normalizeProduct(p));
          setProducts(normalizedProducts);
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          console.warn('Trending products fetch timeout');
        } else {
          console.error('Error fetching trending products:', error instanceof Error ? error.message : error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section
      className="py-16 bg-cream/30"
      style={{
        backgroundImage: `
          linear-gradient(135deg, rgba(250, 248, 246, 0.95) 0%, rgba(250, 248, 246, 0.92) 100%),
          url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4a574' fill-opacity='0.08'%3E%3Cpath d='M30 30c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z'/%3E%3Cpath d='M30 20c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2z'/%3E%3Cpath d='M30 10c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm0-2c0 .552.448 1 1 1s1-.448 1-1-.448-1-1-1-1 .448-1 1zM30 50c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2zm0 2c0-.552-.448-1-1-1s-1 .448-1 1 .448 1 1 1 1-.448 1-1zM10 30c0 1.105.895 2 2 2s2-.895 2-2-.895-2-2-2-2 .895-2 2zm2 0c-.552 0-1 .448-1 1s.448 1 1 1 1-.448 1-1-.448-1-1-1zM50 30c0-1.105-.895-2-2-2s-2 .895-2 2 .895 2 2 2 2-.895 2-2zm-2 0c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
        `,
        backgroundSize: 'cover, 100px 100px',
        backgroundPosition: 'center, center',
        backgroundRepeat: 'no-repeat, repeat'
      }}
    >
      <div className="container mx-auto px-4">
        <SectionHeader
          sectionKey="trending-products"
          defaultTitle="New Arrivals"
          defaultSubtitle="Discover the latest and most sought-after pieces"
          defaultPattern="elegant"
        />

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No products available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product, index) => (
              <ProductCard key={product._id || product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
