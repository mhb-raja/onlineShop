
export interface ProductCommentMiniDTO {
    text: string;
    productId: number
}

export interface ProductCommentDTO extends ProductCommentMiniDTO {
    id: number,
    // text: string;
    userId: number,
    userFullName: string,
    date: string
}