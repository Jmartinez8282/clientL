import { Component, OnInit } from '@angular/core';
import { StudentsService } from '../services/students.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Student } from '../types/students';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [AsyncPipe,CommonModule,RouterLink],
  templateUrl: './students.component.html',
  styleUrl: './students.component.css'
})
export class StudentsComponent implements OnInit {

constructor(private studentServices: StudentsService, private toasterService: ToastrService) {}
students$!: Observable<Student[]>
// studentServices = inject(StudentsService)


ngOnInit(): void {
  
  this.getStudents();
  
  console.log(this.students$.forEach(student => console.log(student)))
  
}
private getStudents(): void {
  
  this.students$=this.studentServices.getStudents();
}

delete(id: number) {
  this.studentServices.deleteStudent(id).subscribe({
    next:(response) => {
     this.toasterService.success("Successfully deleted student!")
     this.getStudents();
    }
  })
}

}
