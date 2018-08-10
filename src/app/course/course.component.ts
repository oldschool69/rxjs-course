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
    concatAll, shareReplay, throttleTime
} from 'rxjs/operators';
import {merge, fromEvent, Observable, concat} from 'rxjs';
import {Lesson} from '../model/lesson';
import { createHttpObservable } from '../common/util';
import { debug, RxJsLoggingLevel, setRxJsLoggingLevel } from '../common/debug';


@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {

    course$: Observable<Course>;
    lessons$: Observable<Lesson[]>;
    courseId: string;

    @ViewChild('searchInput') input: ElementRef;

    constructor(private route: ActivatedRoute) {


    }

    ngOnInit() {

        setRxJsLoggingLevel(RxJsLoggingLevel.DEBUG);

        this.courseId = this.route.snapshot.params['id'];

        this.course$ = createHttpObservable(`/api/courses/${this.courseId}`)
          .pipe(
            debug(RxJsLoggingLevel.INFO, 'course value '),
          );
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
