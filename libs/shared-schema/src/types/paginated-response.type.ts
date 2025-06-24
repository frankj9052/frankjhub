export interface OffsetPaginatedResponse<T> {
  data: T[];
  total: number;
  pageCount: number;
  currentPage: number;
  pageSize: number;
  search?: string;
  filters?: string[];
}
