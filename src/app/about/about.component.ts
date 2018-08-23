import { Component, OnInit } from '@angular/core';
import {
  noop,
  Observable,
  OperatorFunction,
  interval,
  Subject,
  BehaviorSubject,
  AsyncSubject,
  ReplaySubject } from '../../../node_modules/rxjs';

import { createHttpObservable } from '../common/util';
import { map, flatMap, toArray, mergeMap } from '../../../node_modules/rxjs/operators';
import { concat, merge } from '../../../node_modules/rxjs';
import { of } from 'rxjs';
import { Student } from '../model/student';
import { debug, RxJsLoggingLevel, setRxJsLoggingLevel } from '../common/debug';
import { Class } from '../model/class';


@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() { }

  studentsObs$: Observable<Student[]>;
  classesObs$: Observable<Class[]>;

  studentsListMath: Student[] = [
    {id: 1, name: 'Flavio', age: '45'},
    {id: 2, name: 'Robert', age: '12'},
    {id: 3, name: 'Alice', age: '13'},
  ];

  studentsListGeography: Student[] = [
    {id: 4, name: 'George', age: '10'},
    {id: 5, name: 'Martha', age: '14'},
    {id: 6, name: 'Buck', age: '15'},
  ];


  classesList: Class[] = [
    {id: 1, description: 'Math', students: this.studentsListMath},
    {id: 2, description: 'Geography', students: this.studentsListGeography}
  ];

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
    // this.ReplaySubjectSimpleSample();

    setRxJsLoggingLevel(RxJsLoggingLevel.DEBUG);

    this.studentsObs$ = of(this.studentsListMath);

    this.studentsObs$
      .pipe(
        flatMap(students => students),
        // debug(RxJsLoggingLevel.DEBUG, 'students: '),
        map(student => student.name),
        debug(RxJsLoggingLevel.DEBUG, 'student name: '),
        toArray(),
        debug(RxJsLoggingLevel.DEBUG, 'array of students: '),

      )
      .subscribe(data => console.log('Students: ', data));


    this.classesObs$ = of(this.classesList);

    this.classesObs$
      .pipe(
        flatMap(classes => {
          // console.log('***Step 1 ', classes);
          return classes;
        }),
        debug(RxJsLoggingLevel.DEBUG, '***Step 1'),
        map((clazz) => {
          // console.log('***Step 2 ', clazz);
          return clazz.students;
        }),
        debug(RxJsLoggingLevel.DEBUG, '***Step 2'),
        flatMap((students: Student[]) => {
          // console.log('***Step 3 ', students);
          return students;
        }),
        map(student => student.name),
        debug(RxJsLoggingLevel.DEBUG, '***Step 3'),
        toArray(),
        debug(RxJsLoggingLevel.DEBUG, '***Step 4'),
      )
      .subscribe(data => console.log('final output: ', data));




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

