import { Component, OnInit } from '@angular/core';
import { noop, of, Observable, OperatorFunction, interval, Subject, BehaviorSubject, AsyncSubject, ReplaySubject } from '../../../node_modules/rxjs';
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

    // const http$ = createHttpObservable('/api/courses');
    // const sub = http$.subscribe(console.log);

    // setTimeout(() => sub.unsubscribe(), 0);


    // Subjects

    // this.BehaviorSubjectSipleSample();
    // this.AsyncSubjectSimpleSample();
    this.ReplaySubjectSimpleSample();


  }

  BehaviorSubjectSipleSample() {
    // const subject = new Subject();
    const subject = new BehaviorSubject(0); // Recebe o último valor emitido anteriormente, no caso do plain Subject,
    // o observer nao recebe o valor se o subscribe for realizado após next() ter sido chamado

    const series$ = subject.asObservable();

    series$
    .subscribe(val => console.log('early sub: ', val));

    subject.next(1);
    subject.next(2);
    subject.next(3);

    // subject.complete(); // chamando o complete() aqui,  os 'later subscribers' nao receberao mais notificações

    setTimeout(() => {
      series$
      .subscribe(val => console.log('late sub: ', val));
      subject.next(4);
    }, 3000);
  }

  AsyncSubjectSimpleSample() {

    const subject = new AsyncSubject();

    const series$ = subject.asObservable();

    series$
      .subscribe(val => console.log('early sub: ', val));

    let num = 0;
    subject.next(num = num + 1);
    subject.next(num = num - 1);
    subject.next(num = num + 2);

    subject.complete(); // So emite o ultimo valor setado com next(), usado para emitir o resultado obtido através de
    // multiplas chamadas de next()

    setTimeout(() => {
      series$
        .subscribe(val => console.log('late sub: ', val));

      subject.next(4);
    }, 3000);
  }

  ReplaySubjectSimpleSample() {

    const subject = new ReplaySubject();

    const series$ = subject.asObservable();

    series$
      .subscribe(val => console.log('early sub: ', val));

    subject.next(1);
    subject.next(2);
    subject.next(3);

    // subject.complete(); // Retransmite os valores para outros Observables mesmo após chamar complete()

    setTimeout(() => {
      series$
        .subscribe(val => console.log('late sub: ', val));

    }, 3000);

    setTimeout(() => {
      series$
        .subscribe(val => console.log('more late sub ', val));

    }, 5000);
  }

}

