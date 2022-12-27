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

    shortDescription: string,
    description: string,
    categoryId: number,
    categoryTitle?: string
}

export interface productDatasourceDTO extends GenericDatasource<ProductMiniDTO> {
    text: string;
    startPrice: number;
    endPrice: number;
    maxPrice:number;
    availableOnly:boolean;
    categories: number[];
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