import { useState, useEffect, useCallback } from 'react';
import { fetchProjectByDocumentId } from '../services/projects';
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
        const projectData = await fetchProjectByDocumentId(id, locale);

        if (isMounted) {
          setProject(projectData);
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