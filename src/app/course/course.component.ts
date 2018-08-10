import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Course} from "../model/course";
import {
    debounceTime,
    distinctUntilChanged,
    startWith,
    tap,
    delay,
    map,
    concatMap,
    switchMap,
    withLatestFrom,
    concatAll, shareReplay, throttleTime, first
} from 'rxjs/operators';
import {merge, fromEvent, Observable, concat, forkJoin} from 'rxjs';
import {Lesson} from '../model/lesson';
import { createHttpObservable } from '../common/util';
import { debug, RxJsLoggingLevel, setRxJsLoggingLevel } from '../common/debug';
import { Store } from '../common/store.service';


@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {

    course$: Observable<Course>;
    lessons$: Observable<Lesson[]>;
    courseId: number;

    @ViewChild('searchInput') input: ElementRef;

    constructor(private route: ActivatedRoute, private store: Store) {


    }

    ngOnInit() {
        this.courseId = parseInt(this.route.snapshot.params['id'], 10);
        this.course$ = this.store.selectCountryById(this.courseId)
          .pipe(
            first(), // emite o primeiro valor retornado e finaliza a execução
            // take(2) // emite os n primeiros valores retornados e finaliza a execução
          );

        forkJoin(this.course$, this.loadLessons()) // Espera dois ou mais observables finalizarem
          .subscribe(result => {
            console.log('***forkJoin result: ', result);
          });


        this.loadLessons() // Observable 1
          .pipe(
            withLatestFrom(this.course$) // Combina o ultimo valor retornado pelo Observable 2 com o do Observable 1
            // Util quando um dos observables retorna muitos valores e demora para completar.
          )
          .subscribe(([lessons, course]) => {
            console.log('lessons: ', lessons);
            console.log('course: ', course);
          });
    }

    ngAfterViewInit() {

      // *** VERSAO ANTIGA
      // const searchLessons$ = fromEvent<any>(this.input.nativeElement, 'keyup')
      // .pipe(
      //   map(event => event.target.value),
      //   debounceTime(400), // aplica delay antes de emitir o próximo valor do Observable
      //   distinctUntilChanged(), // elimina valores repetidos
      //   switchMap(search => this.loadLessons(search)) // Aborta a execução do Observable anterior quando um novo é iniciado
      // );

      // const initialLessons$ = this.loadLessons();

      // this.lessons$ = concat(initialLessons$, searchLessons$);

      // *** VERSAO NOVA, usando startWith remove as dua linhas de código acima
      this.lessons$ = fromEvent<any>(this.input.nativeElement, 'keyup')
        .pipe(
          map(event => event.target.value),
          startWith(''), // valor inicial
          debug(RxJsLoggingLevel.DEBUG, 'search '),
          debounceTime(400), // aplica delay antes de emitir o próximo valor do Observable
          // throttleTime(400),
          distinctUntilChanged(), // elimina valores repetidos
          switchMap(search => this.loadLessons(search)), // Aborta a execução do Observable anterior quando um novo é iniciado
          debug(RxJsLoggingLevel.DEBUG, 'lessons value '),
        );

    }

    loadLessons(search = ''): Observable<Lesson[]> {
      return createHttpObservable(`/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`)
        .pipe(
          map(res => res['payload'])
        );
    }




}
