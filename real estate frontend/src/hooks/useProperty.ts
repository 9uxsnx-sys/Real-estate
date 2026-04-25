import { useState, useEffect, useCallback } from 'react';
import { fetchPropertyByDocumentId } from '../services/properties';
import type { Property } from '../types';

interface UsePropertyResult {
  property: Property | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useProperty(id: string | undefined, locale?: string): UsePropertyResult {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [key, setKey] = useState(0);

  const refetch = useCallback(() => {
    setKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (!id) {
      setProperty(null);
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function loadProperty() {
      setLoading(true);
      setError(null);

      try {
        const propertyData = await fetchPropertyByDocumentId(id, locale);

        if (isMounted) {
          setProperty(propertyData);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch property'));
          setProperty(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProperty();

    return () => {
      isMounted = false;
    };
  }, [id, key, locale]);

  return { property, loading, error, refetch };
}