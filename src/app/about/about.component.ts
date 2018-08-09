import { Component, OnInit } from '@angular/core';
import { noop, of, Observable, OperatorFunction } from '../../../node_modules/rxjs';
import { createHttpObservable } from '../common/util';
import { map } from '../../../node_modules/rxjs/operators';
import { concat } from '../../../node_modules/rxjs';


@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    const source1$ = of(1, 2, 3);
    const source2$ = of(4, 5, 6);
    const source3$ = of(7, 8, 9);

    const result$ = concat(source1$, source2$, source3$);

    result$.subscribe(val => console.log(val));

  }
}

