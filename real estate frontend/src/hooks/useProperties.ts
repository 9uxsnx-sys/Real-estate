import { useState, useEffect, useCallback } from 'react';
import { fetchProperties, type PropertyFilters } from '../services/properties';
import type { Property } from '../types';

interface UsePropertiesResult {
  properties: Property[];
  loading: boolean;
  error: Error | null;
  total: number;
  refetch: () => void;
}

export function useProperties(
  filters: PropertyFilters = {},
  locale?: string
): UsePropertiesResult {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState(0);
  const [key, setKey] = useState(0);

  const refetch = useCallback(() => {
    setKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadProperties() {
      setLoading(true);
      setError(null);

      try {
        const propertyData = await fetchProperties(filters, locale);

        if (isMounted) {
          setProperties(propertyData);
          setTotal(propertyData.length);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch properties'));
          setProperties([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProperties();

    return () => {
      isMounted = false;
    };
  }, [key, JSON.stringify(filters), locale]);

  return { properties, loading, error, total, refetch };
}