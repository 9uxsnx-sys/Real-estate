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
    let errorData;
    try {
      errorData = await response.json();
      console.error('[API Error] Response:', response.status, response.statusText, errorData);
    } catch {
      errorData = await response.text();
      console.error('[API Error] Response:', response.status, response.statusText, errorData);
    }
    throw new ApiError(
      errorData?.error?.message || errorData?.message || `API Error: ${response.status}`,
      response.status,
      errorData
    );
  }
  return response.json();
}

export async function fetchApi<T>(
  endpoint: string,
  params?: ApiParams | string
): Promise<T> {
  let urlString = `${API_URL}${endpoint}`;
  
  if (params) {
    if (typeof params === 'string') {
      urlString = `${urlString}?${params}`;
    } else {
      const url = new URL(urlString);
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          url.searchParams.append(key, String(value));
        }
      });
      urlString = url.toString();
    }
  }

  console.log('[API] Full URL:', urlString);
  
  const response = await fetch(urlString, {
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