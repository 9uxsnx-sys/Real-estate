import { useState, useEffect, useCallback } from 'react';
import { fetchProjects } from '../services/projects';
import type { Project, StrapiResponse } from '../types';

interface UseProjectsResult {
  projects: Project[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useProjects(locale?: string): UseProjectsResult {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [key, setKey] = useState(0);

  const refetch = useCallback(() => {
    setKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadProjects() {
      setLoading(true);
      setError(null);

      try {
        const response: StrapiResponse<Project[]> = await fetchProjects(locale);

        if (isMounted) {
          const projectData = Array.isArray(response.data)
            ? response.data
            : response.data
            ? [response.data]
            : [];

          const formattedProjects: Project[] = projectData.map((p: any) => ({
            id: p.id,
            documentId: p.documentId,
            name: p.name,
            short_description: p.short_description || p.shortDescription || '',
            city: p.city,
            place: p.place,
            description: p.description,
            first_image: p.first_image || p.firstImage || '',
            second_image: p.second_image || p.secondImage || '',
            google_map_embed: p.google_map_embed || p.googleMapEmbed,
          }));

          setProjects(formattedProjects);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch projects'));
          setProjects([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProjects();

    return () => {
      isMounted = false;
    };
  }, [key, locale]);

  return { projects, loading, error, refetch };
}