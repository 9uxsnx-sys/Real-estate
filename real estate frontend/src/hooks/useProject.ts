import { useState, useEffect, useCallback } from 'react';
import { fetchProjectById } from '../services/projects';
import type { Project } from '../types';

interface UseProjectResult {
  project: Project | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useProject(id: string | undefined, locale?: string): UseProjectResult {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [key, setKey] = useState(0);

  const refetch = useCallback(() => {
    setKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (!id) {
      setProject(null);
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function loadProject() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchProjectById(id, locale);

        if (isMounted && response?.data) {
          const attrs = response.data.attributes || response.data;
          setProject({
            id: response.data.id,
            documentId: response.data.documentId,
            name: attrs.name,
            short_description: attrs.short_description,
            city: attrs.city,
            place: attrs.place,
            description: attrs.description,
            first_image: attrs.first_image,
            second_image: attrs.second_image,
            google_map_embed: attrs.google_map_embed,
          });
        } else if (isMounted) {
          setProject(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch project'));
          setProject(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProject();

    return () => {
      isMounted = false;
    };
  }, [id, key, locale]);

  return { project, loading, error, refetch };
}