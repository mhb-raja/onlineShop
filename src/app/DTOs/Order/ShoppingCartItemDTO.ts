
export interface ShoppingCartItemDTO {
    id: number;
    title: string;
    price: number;
    imageName: string;
    count: number;
}

export interface ShoppingCart {
    cart: ShoppingCartItemDTO[];
    sumTotal: number;
}