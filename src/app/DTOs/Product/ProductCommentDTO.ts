export interface ProductCommentMiniDTO {
  text: string;
  productId: number;
  parentId?: number;
}

export interface ProductCommentDTO extends ProductCommentMiniDTO {
  id: number;
  userId: number;
  userFullName: string;
  date: Date;
  likeCount: number;
  dislikeCount: number;
}
