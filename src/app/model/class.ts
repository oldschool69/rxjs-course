import { Student } from './student';

export interface Class {
  id: number;
  description: string;
  students: Student[];
}
