export interface RespostaPaginada<T> {
  content: T[];
  pageable: {
    pageSize: number;
    pageNumber: number;
    pageTotal: number;
    elementsTotal: number;
    pageFirst: boolean;
    pageLast: boolean;
  };
}
