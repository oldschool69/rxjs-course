import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {Course} from "../model/course";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import * as moment from 'moment';
import {fromEvent} from 'rxjs';
import {concatMap, distinctUntilChanged, exhaustMap, filter, mergeMap} from 'rxjs/operators';
import {fromPromise} from 'rxjs/internal-compatibility';
import { Store } from '../common/store.service';

@Component({
    selector: 'course-dialog',
    templateUrl: './course-dialog.component.html',
    styleUrls: ['./course-dialog.component.css']
})
export class CourseDialogComponent implements OnInit, AfterViewInit {

    form: FormGroup;
    course:Course;

    @ViewChild('saveButton') saveButton: ElementRef;

    @ViewChild('searchInput') searchInput : ElementRef;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) course:Course,
        private store: Store ) {

        this.course = course;

        this.form = fb.group({
            description: [course.description, Validators.required],
            category: [course.category, Validators.required],
            releasedAt: [moment(), Validators.required],
            longDescription: [course.longDescription,Validators.required]
        });

    }

    ngOnInit() {

      this.form.valueChanges // retorna um Observable
        .pipe(
          filter(() => this.form.valid), // filtra o Observable de form.valueChanges, quando form.valid
          concatMap(changes => this.saveCourse(changes)), // executa o proximo Observable (saveCourse) sequencialmente
          // mergeMap(changes => this.saveCourse(changes)), // executa o proximo Observable (saveCourse) em paralelo
          // exhaustMap(changes => this.saveCourse(changes)) // executa o proximo Observable somente quando o anterior finalizar a execução
        )
        .subscribe();

    }

    saveCourse(changes) {
      // método fetch retorn uma Promise. Utilizando a funcao fromPromise para retornar um Observable
      return fromPromise(fetch(`/api/courses/${this.course.id}`, {
        method: 'PUT',
        body: JSON.stringify(changes),
        headers: {
          'content-type': 'application/json'
        }
      }));
    }



    ngAfterViewInit() {

      fromEvent(this.saveButton.nativeElement, 'click')
        .pipe(
          exhaustMap(() => this.saveCourse(this.form.value))
        )
        .subscribe();

    }



    close() {
        this.dialogRef.close();
    }

    save() {
      this.store.saveCourse(this.course.id, this.form.value)
        .subscribe(
          () => this.close(),
          err => console.log('Error saving course', err)
        );
    }

}
