import { useState, useEffect, useCallback } from 'react';
import { fetchPropertyById } from '../services/properties';
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
        const response = await fetchPropertyById(id, locale);

        if (isMounted) {
          if (response?.data) {
            const attrs = response.data.attributes || response.data;
            setProperty({
              id: String(response.data.id),
              documentId: response.data.documentId,
              name: attrs.name,
              area: attrs.area,
              city: attrs.city,
              price: attrs.price,
              property_type: attrs.property_type,
              space_sqm: attrs.space_sqm,
              beds: attrs.beds,
              baths: attrs.baths,
              image: attrs.image,
              property_code: attrs.property_code,
              project: attrs.project
                ? {
                    id: attrs.project.id || attrs.project?.data?.id,
                    documentId: attrs.project.documentId || attrs.project?.data?.documentId,
                    name: attrs.project.name || attrs.project?.data?.name,
                  }
                : undefined,
            });
          } else {
            setProperty(null);
          }
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