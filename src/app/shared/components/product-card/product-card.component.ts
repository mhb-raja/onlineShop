import { Component, Input, OnInit } from '@angular/core';
import { ProductDTO, ProductMiniDTO } from 'src/app/DTOs/Product/ProductDTO';
import { ImagePath } from 'src/app/Utilities/PathTools';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {

  @Input() product: ProductMiniDTO;// ProductDTO;
  imagePath = ImagePath;

  constructor() { }

  ngOnInit(): void {
  }

  addToCart() {
    console.log('yess');

  }
}
