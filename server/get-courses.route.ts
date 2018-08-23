

import { Request, Response } from 'express';
import { COURSES } from './db-data';
import { Observable } from '../node_modules/rxjs/Rx';
import { tap } from '../node_modules/rxjs/operators';
import { Student } from '../src/app/model/student';
import { fromPromise } from 'rxjs/internal-compatibility';



export function getAllCourses(req: Request, res: Response) {


  // const error = (Math.random() >= 0.5);

  // if (error) {
  //   console.log("ERROR loading courses!");
  //   res.status(500).json({message: 'random error occurred.'});
  // } else {

    console.log('*** Calling getAllCourses');

    const studentsListGeography: Student[] = [
      {id: 4, name: 'George', age: '10'},
      {id: 5, name: 'Martha', age: '14'},
      {id: 6, name: 'Buck', age: '15'},
    ];

    const obs1$: Observable<Student[]> = Observable.of(studentsListGeography);

    obs1$
      .flatMap(students => students)
      .take(1)
      .pipe(
        tap(students => {
          console.log('***Step 1: ', students);
          return students;
        })
      )
      .map(student => student.name)
      .subscribe(student => console.log(student));

    setTimeout(() => {

      res.status(200).json({payload: Object.values(COURSES)});

    }, 200);

  // }
}


export function getCourseById(req: Request, res: Response) {

  const courseId = req.params["id"];

  const courses:any = Object.values(COURSES);

  const course = courses.find(course => course.id == courseId);

  res.status(200).json(course);
}
