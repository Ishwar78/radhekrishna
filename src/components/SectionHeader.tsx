import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

interface SectionHeaderProps {
  sectionKey: string;
  defaultTitle?: string;
  defaultSubtitle?: string;
  defaultDescription?: string;
  defaultPattern?: 'diwali' | 'holi' | 'festival' | 'gold' | 'elegant' | 'modern';
}

const SectionHeader = ({
  sectionKey,
  defaultTitle = "Section Title",
  defaultSubtitle = "Subtitle",
  defaultDescription = "",
  defaultPattern = "elegant"
}: SectionHeaderProps) => {
  const [settings, setSettings] = useState({
    title: defaultTitle,
    subtitle: defaultSubtitle,
    description: defaultDescription,
    backgroundPattern: defaultPattern,
    accentColor: '#d4a574'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || '/api';
        const response = await fetch(`${API_URL}/section-settings/${sectionKey}`);

        if (response.ok) {
          const data = await response.json();
          if (data.section) {
            setSettings({
              title: data.section.title || defaultTitle,
              subtitle: data.section.subtitle || defaultSubtitle,
              description: data.section.description || defaultDescription,
              backgroundPattern: data.section.backgroundPattern || defaultPattern,
              accentColor: data.section.accentColor || '#d4a574'
            });
          }
        }
      } catch (error) {
        console.warn('Failed to fetch section settings, using defaults:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [sectionKey, defaultTitle, defaultSubtitle, defaultDescription, defaultPattern]);

  const getDecorationSVG = (pattern: string) => {
    switch (pattern) {
      case 'diwali':
        return `data:image/svg+xml,%3Csvg width='100' height='40' viewBox='0 0 100 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='20' y='25' font-size='24' fill='%23d4a574'%3E🪔%3C/text%3E%3Ctext x='50' y='25' font-size='24' fill='%23d4a574'%3E✨%3C/text%3E%3Ctext x='80' y='25' font-size='24' fill='%23d4a574'%3E🪔%3C/text%3E%3C/svg%3E`;
      case 'holi':
        return `data:image/svg+xml,%3Csvg width='100' height='40' viewBox='0 0 100 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='20' y='25' font-size='24' fill='%23d4a574'%3E🎨%3C/text%3E%3Ctext x='50' y='25' font-size='24' fill='%23d4a574'%3E✨%3C/text%3E%3Ctext x='80' y='25' font-size='24' fill='%23d4a574'%3E🎨%3C/text%3E%3C/svg%3E`;
      case 'festival':
        return `data:image/svg+xml,%3Csvg width='100' height='40' viewBox='0 0 100 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='8' fill='%23d4a574' opacity='0.6'/%3E%3Ccircle cx='50' cy='20' r='8' fill='%23d4a574' opacity='0.8'/%3E%3Ccircle cx='80' cy='20' r='8' fill='%23d4a574' opacity='0.6'/%3E%3C/svg%3E`;
      case 'gold':
        return `data:image/svg+xml,%3Csvg width='100' height='40' viewBox='0 0 100 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 20 10 L 30 20 L 20 30 L 10 20 Z' fill='%23d4a574'/%3E%3Cpath d='M 50 10 L 60 20 L 50 30 L 40 20 Z' fill='%23d4a574'/%3E%3Cpath d='M 80 10 L 90 20 L 80 30 L 70 20 Z' fill='%23d4a574'/%3E%3C/svg%3E`;
      case 'elegant':
        return `data:image/svg+xml,%3Csvg width='100' height='40' viewBox='0 0 100 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cline x1='10' y1='20' x2='30' y2='20' stroke='%23d4a574' stroke-width='2'/%3E%3Ccircle cx='50' cy='20' r='4' fill='%23d4a574'/%3E%3Cline x1='70' y1='20' x2='90' y2='20' stroke='%23d4a574' stroke-width='2'/%3E%3C/svg%3E`;
      case 'modern':
        return `data:image/svg+xml,%3Csvg width='100' height='40' viewBox='0 0 100 40' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='15' y='15' width='10' height='10' fill='%23d4a574'/%3E%3Crect x='40' y='15' width='10' height='10' fill='%23d4a574'/%3E%3Crect x='65' y='15' width='10' height='10' fill='%23d4a574'/%3E%3C/svg%3E`;
      default:
        return `data:image/svg+xml,%3Csvg width='100' height='40' viewBox='0 0 100 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cline x1='10' y1='20' x2='30' y2='20' stroke='%23d4a574' stroke-width='2'/%3E%3Ccircle cx='50' cy='20' r='4' fill='%23d4a574'/%3E%3Cline x1='70' y1='20' x2='90' y2='20' stroke='%23d4a574' stroke-width='2'/%3E%3C/svg%3E`;
    }
  };

  if (isLoading) {
    return (
      <div className="text-center mb-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" />
      </div>
    );
  }

  return (
    <div className="text-center mb-12">
      {/* Decorative strip above title */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="flex-grow h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
        <img
          src={getDecorationSVG(settings.backgroundPattern)}
          alt="decoration"
          className="w-32 h-8"
        />
        <div className="flex-grow h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
      </div>

      {/* Main Title */}
      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3">
        {settings.title}
      </h2>

      {/* Subtitle */}
      {settings.subtitle && (
        <p className="text-lg text-muted-foreground mb-2">
          {settings.subtitle}
        </p>
      )}

      {/* Description */}
      {settings.description && (
        <p className="text-base text-muted-foreground max-w-2xl mx-auto">
          {settings.description}
        </p>
      )}

      {/* Decorative strip below title */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <div className="flex-grow h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
        <img
          src={getDecorationSVG(settings.backgroundPattern)}
          alt="decoration"
          className="w-32 h-8"
        />
        <div className="flex-grow h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
      </div>
    </div>
  );
};

export default SectionHeader;
