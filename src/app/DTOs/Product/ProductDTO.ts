import { GenericDatasource } from "../Common/GenericDatasource";
import { ProductGalleryDTO } from "./ProductGalleryDTO";

export interface ProductMiniDTO{
    id: number,
    productName: string,
    urlCodeFa: string,
    price: number,
    base64Image: string,
    isAvailable: boolean,
}
export interface ProductDTO extends ProductMiniDTO{
    // id: number,
    // productName: string,
    // urlCodeFa: string,
    // price: number,
    shortDescription: string,
    description: string,
    // base64Image: string,
    // isAvailable: boolean,
    categoryId: number,
    categoryTitle?: string
}

export interface productDatasourceDTO extends GenericDatasource<ProductMiniDTO> {
    text: string;
    startPrice: number,
    endPrice: number,
    categories: number[],
    orderBy: ProductOrderBy
}

export enum ProductOrderBy {
    PriceAsc = 1,
    PriceDesc = 2,
    CreateDateAsc = 3,
    CreateDateDesc = 4,
    IsSpecial = 5
}

export interface ProductDetailDTO {
    product: ProductDTO,
    gallery: ProductGalleryDTO[]
}