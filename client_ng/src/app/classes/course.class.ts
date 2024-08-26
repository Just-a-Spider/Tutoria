export class Course {
  id: number;
  name: string;
  semester: number;

  constructor(id: number, name: string, semester: number) {
    this.id = id;
    this.name = name;
    this.semester = semester;
  }
}
