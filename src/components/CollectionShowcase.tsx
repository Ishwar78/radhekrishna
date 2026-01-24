import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface Collection {
  _id: string;
  name: string;
  description?: string;
  image: string;
  link: string;
  buttonText: string;
  badge?: string;
  displayOrder: number;
}

const CollectionShowcase = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setIsLoading(true);
        const API_URL = import.meta.env.VITE_API_URL || '/api';
        const response = await fetch(`${API_URL}/collections`);

        if (response.ok) {
          const data = await response.json();
          if (data.collections && Array.isArray(data.collections)) {
            setCollections(data.collections);
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('Error fetching collections:', errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollections();
  }, []);

  if (isLoading) {
    return (
      <section className="py-16 bg-[#faf6f1]">
        <div className="container mx-auto px-4 flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (!collections || collections.length === 0) return null;

  return (
    <section className="py-16 bg-[#faf6f1]">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-primary font-medium tracking-widest text-sm uppercase mb-2 block">
            Explore
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            Shop by Collection
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Curated collections of handpicked ethnic wear for every occasion
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {collections.map((collection) => (
            <Link
              key={collection._id}
              to={collection.link}
              className="group relative aspect-square rounded-full overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              {/* Image */}
              <img
                src={collection.image}
                alt={collection.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300" />

              {/* Badge */}
              {collection.badge && (
                <div className="absolute top-3 left-3 z-20">
                  <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                    {collection.badge}
                  </span>
                </div>
              )}

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-2 z-10">
                <h3 className="font-display text-lg md:text-xl font-bold text-white mb-2 group-hover:mb-3 transition-all">
                  {collection.name}
                </h3>
                
                {collection.description && (
                  <p className="text-xs md:text-sm text-white/80 mb-3 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {collection.description}
                  </p>
                )}

                <button
                  onClick={(e) => e.preventDefault()}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-xs md:text-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 whitespace-nowrap"
                >
                  {collection.buttonText}
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CollectionShowcase;
