export interface GenericDatasource<T> {
    items: T[];
    
    pageSize: number,
    pageIndex: number,
    totalItems: number
}