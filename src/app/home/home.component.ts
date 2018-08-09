import {Component, OnInit} from '@angular/core';
import {Course} from "../model/course";
import {interval, Observable, of, timer, noop, throwError} from 'rxjs';
import {catchError, delayWhen, map, retryWhen, shareReplay, tap, finalize} from 'rxjs/operators';
import { createHttpObservable } from '../common/util';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  beginnerCourses$: Observable<Course[]>;
  advancedCourses$:  Observable<Course[]>;

  constructor() {

  }

  ngOnInit() {

    // Creating observable from scratch
    const http$ = createHttpObservable('/api/courses');
    // Pega o resultado de outro Observable (payload) e transforma
    // em um array
    const courses$: Observable<Course[]> = http$
    .pipe(
      tap(() => console.log('http request executed')),
      map(res => Object.values(res['payload'])),
      shareReplay(), // Compartilha a execucao do http request ente multiplos Observables
      retryWhen(errors => errors.pipe( // Se ocorrer erro, executa novamente depois de 2 segundos
        delayWhen(() => timer(2000))
      ))
    );

    this.beginnerCourses$ = courses$
      .pipe(
        map(courses => courses
          .filter(course => course.category === 'BEGINNER'))
        );

    this.advancedCourses$ = courses$
      .pipe(
        map(courses => courses
          .filter(course => course.category === 'ADVANCED'))
        );
      }
    }
