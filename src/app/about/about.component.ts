import { Component, OnInit } from '@angular/core';
import { noop, of, Observable, OperatorFunction, interval } from '../../../node_modules/rxjs';
import { createHttpObservable } from '../common/util';
import { map } from '../../../node_modules/rxjs/operators';
import { concat, merge } from '../../../node_modules/rxjs';


@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    // *** Exemplo simples para demonstrar o comportamento do operador 'concat'
    // const source1$ = of(1, 2, 3);
    // const source2$ = of(4, 5, 6);
    // const source3$ = of(7, 8, 9);

    // const result$ = concat(source1$, source2$, source3$);

    // result$.subscribe(val => console.log(val));

    // *** Exemplo simples para demonstrar o comportamento do operador 'merge'
    // const interval1$ = interval(1000);

    // const interval2$ = interval1$.pipe(map(val => 10 * val));

    // const result$ = merge(interval1$, interval2$);

    // result$.subscribe(console.log);

    // *** Unsubscription sample

    // const interval1$ = interval(1000);

    // const sub = interval1$.subscribe(console.log);

    // setTimeout(() => sub.unsubscribe(), 5000);

    const http$ = createHttpObservable('/api/courses');
    const sub = http$.subscribe(console.log);

    setTimeout(() => sub.unsubscribe(), 0);




  }
}

