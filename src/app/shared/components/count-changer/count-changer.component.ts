import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-count-changer',
  templateUrl: './count-changer.component.html',
  styleUrls: ['./count-changer.component.scss']
})
export class CountChangerComponent implements OnInit {

  @Input() count: number;
  @Output() removeItemEvent = new EventEmitter();
  @Output() countChangedEvent = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  addCount() {
    this.count++;
    this.countChangedEvent.emit(this.count);
  }

  minusCount() {
    if (this.count > 1){
      this.count--;
      this.countChangedEvent.emit(this.count);
    }
  }

  removeItem() {
    this.removeItemEvent.emit();
  }
}
