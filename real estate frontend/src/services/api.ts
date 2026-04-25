const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:1337';

export interface ApiParams {
  page?: number;
  pageSize?: number;
  locale?: string;
  sort?: string;
  [key: string]: any;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData?.error?.message || `API Error: ${response.status}`,
      response.status,
      errorData
    );
  }
  return response.json();
}

export async function fetchApi<T>(
  endpoint: string,
  params?: ApiParams
): Promise<T> {
  const url = new URL(`${API_URL}${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const response = await fetch(url.toString(), {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<T>(response);
}

export async function fetchApiById<T>(endpoint: string, id: string): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}/${id}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<T>(response);
}

export { API_URL };