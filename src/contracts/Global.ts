export interface ServerErrors {
  [field: string]: string[];
}

export interface PageMetaData {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  first_page: number;
  first_page_url: string;
  last_page_url: string;
  next_page_url: string | null;
  previous_page_url: string | null;
}

export interface PaginatedResponse<T> {
  meta: PageMetaData;
  data: T;
}

export interface PaginatedRequest {
  page: number;
  limit: number;
}