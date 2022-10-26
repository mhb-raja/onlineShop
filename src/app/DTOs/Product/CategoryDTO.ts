export interface CategoryMiniDTO {
    id: number;
    title: string;
}
export interface CategoryDTO extends CategoryMiniDTO {

    urlTitle: string;
    parentId: number;
}