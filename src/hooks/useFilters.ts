import { useState, useEffect } from 'react';

export interface Size {
  id: string;
  name: string;
}

export interface Color {
  id: string;
  name: string;
  hex: string;
}

export interface Subcategory {
  id: string;
  name: string;
}

export interface FiltersData {
  sizes: Size[];
  colors: Color[];
  ethnicSubcategories: Subcategory[];
  westernSubcategories: Subcategory[];
}

const defaultFilters: FiltersData = {
  sizes: [
    { id: '1', name: 'S' },
    { id: '2', name: 'M' },
    { id: '3', name: 'L' },
    { id: '4', name: 'XL' },
    { id: '5', name: 'XXL' },
    { id: '6', name: 'XXXL' },
    { id: '7', name: 'Free Size' },
  ],
  colors: [
    { id: '1', name: 'Burgundy', hex: '#722F37' },
    { id: '2', name: 'Blue', hex: '#1E3A8A' },
    { id: '3', name: 'Pink', hex: '#EC4899' },
    { id: '4', name: 'Green', hex: '#059669' },
    { id: '5', name: 'Maroon', hex: '#800000' },
    { id: '6', name: 'Ivory', hex: '#FFFFF0' },
    { id: '7', name: 'Teal', hex: '#0D9488' },
    { id: '8', name: 'Orange', hex: '#EA580C' },
    { id: '9', name: 'Red', hex: '#DC2626' },
    { id: '10', name: 'White', hex: '#FFFFFF' },
    { id: '11', name: 'Black', hex: '#000000' },
    { id: '12', name: 'Gold', hex: '#FBBF24' },
  ],
  ethnicSubcategories: [
    { id: '1', name: 'Kurta Sets' },
    { id: '2', name: 'Anarkali Suits' },
    { id: '3', name: 'Lehengas' },
    { id: '4', name: 'Party Wear' },
    { id: '5', name: 'Festive Collection' },
  ],
  westernSubcategories: [
    { id: '1', name: 'Tops & Tees' },
    { id: '2', name: 'Dresses' },
    { id: '3', name: 'Co-ord Sets' },
    { id: '4', name: 'Casual Wear' },
  ],
};

export function useFilters() {
  const [filters, setFilters] = useState<FiltersData>(defaultFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFilters();
  }, []);

  const fetchFilters = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const API_URL = import.meta.env.VITE_API_URL || '/api';
      const response = await fetch(`${API_URL}/filters`, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch filters');
      }

      const data = await response.json();
      if (data.success && data.filters) {
        setFilters(data.filters);
      }
    } catch (err) {
      console.error('Error fetching filters:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch filters');
      // Keep using default filters on error
      setFilters(defaultFilters);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    filters,
    isLoading,
    error,
    refetch: fetchFilters,
  };
}
