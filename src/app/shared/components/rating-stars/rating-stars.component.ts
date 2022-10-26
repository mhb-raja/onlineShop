import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-rating-stars',
  templateUrl: './rating-stars.component.html',
  styleUrls: ['./rating-stars.component.scss']
})
export class RatingStarsComponent implements OnInit {

  // @Input() rating: number = 2.5;
  // @Output() starClicked = new EventEmitter<number>();

  // //@Input() mywidth: number = 90;
  // width : number = 90;

  // constructor() {}

  // ngOnInit(): void {
  //   this.width = this.rating * 90 / 5;
  // }

  // public onClick() {
  //   this.starClicked.emit(this.rating);
  // }
  //---------------------------------
  rating = 3;
  starCount = 5;
  ratingArr: boolean[] = []; // true = solid star; false = empty star

  snackBarDuration = 1000;
  response = [
    'You broke my heart!',
    'Really?',
    'We will do better next time.',
    'Glad you like it!',
    'Thank you so much!'
  ]
  constructor() {// default to no rating, i.e. all empty stars
    this.ratingArr = Array(this.starCount).fill(false);
  }
  ngOnInit(): void {}

  returnStar(i: number) {
    if (this.rating >= i + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }

  onClick(i: number) {
    this.rating = i + 1;
    // this.snackBar.open(this.response[i], '', {
    //   duration: this.snackBarDuration,
    //   panelClass: ['snack-bar']
    // });

  }
}
