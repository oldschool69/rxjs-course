import { Injectable } from "@angular/core";
import { Subject, BehaviorSubject, Observable } from "rxjs";
import { Course } from '../model/course';
import { createHttpObservable } from "./util";
import { tap, map, shareReplay, filter } from "rxjs/operators";
import {fromPromise} from 'rxjs/internal-compatibility';
import { debug, RxJsLoggingLevel } from "../common/debug";


@Injectable({
  providedIn: 'root'
})
export class Store {

  private subject = new BehaviorSubject<Course[]>([]);
  courses$: Observable<Course[]> = this.subject.asObservable();

  init() {
    // Creating observable from scratch
    const http$ = createHttpObservable('/api/courses');
    // Pega o resultado de outro Observable (payload) e transforma
    // em um array
     http$
      .pipe(
        tap(() => console.log('http request executed')),
        map(res => Object.values(res['payload'])),
        debug(RxJsLoggingLevel.DEBUG, 'courses: ')
      )
      .subscribe(
        courses => this.subject.next(courses)
      );
  }

  selectBeginnerCourses() {
    return this.filterByCategory('BEGINNER');
  }

  selectAdvancedCourses() {
    return this.filterByCategory('ADVANCED');
  }


  selectCountryById(courseId: number) {
    return this.courses$.pipe(
        map(courses => courses.find(course => course.id === courseId)),
        filter(course => !!course)
      );
  }

  filterByCategory(category: string) {
    return this.courses$.pipe(
      map(courses => courses
        .filter(course => course.category === category))
      );
  }

  saveCourse(courseId: number, changes): Observable<any> {
    const courses = this.subject.getValue();

    const courseIndex = courses.findIndex(course =>  course.id === courseId);

    const newCourses = courses.slice(0);

    newCourses[courseIndex] = {
      ...courses[courseIndex],
      ...changes
    };

    this.subject.next(newCourses);

    return fromPromise(fetch(`/api/courses/${courseId}`, {
        method: 'PUT',
        body: JSON.stringify(changes),
        headers: {
          'content-type': 'application/json'
        }
    }));
  }





}
