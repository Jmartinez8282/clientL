import { JsonPipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StudentsService } from '../../services/students.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe, RouterLink],
  templateUrl: './student-form.component.html',
  styleUrl: './student-form.component.css'
})
export class StudentFormComponent implements OnInit, OnDestroy {

  form!: FormGroup

  studentFormSubscription!: Subscription;
  isEdit=false;
  paramsSubscription!: Subscription;
  id=0;
  

  constructor(private formbuilder: FormBuilder, private studentServices : StudentsService, private activatedRouter: ActivatedRoute,private router: Router,private toasterService: ToastrService) { }

  ngOnDestroy(): void {
    if(this.studentFormSubscription) 
    {

      
          this.studentFormSubscription.unsubscribe();
    }
    if(this.paramsSubscription)
    {
      this.paramsSubscription.unsubscribe()
    }
  }


  onSubmit() {

    if(!this.isEdit)
    {
      
      this.studentFormSubscription = this.studentServices.addStudent(this.form.value).subscribe({
        next: (response) => {
          console.log(response);
          this.toasterService.success("Student successfully added")
          this.router.navigate(['/students'])
        },
        error: err=> {
          console.log(err);
        }
       })
    }else {
      this.studentServices.editStudent(this.id,this.form.value).subscribe({
        next: (value) => {
          console.log(value);
          this.toasterService.success("Edited successfully")
          this.router.navigateByUrl('/students')
        },
        error: err=> {
          console.log(err);
          this.toasterService.error("Unable to edit student")
        }
       })
    }

  }

  ngOnInit(): void {

   this.paramsSubscription = this.activatedRouter.params.subscribe({
      next:(response) => {
        console.log(response['id']);
        let id =response['id']
        this.id = id
        if(!id)return;
        this.studentServices.getStudentMethod(id).subscribe({
          next: response => {
            console.log(response);
            this.form.patchValue(response);
            this.isEdit= true;
          },
          error: err => {
            console.log(err);
          }
        })
      },
      error: err=> {
        console.log(err)
      }
    })
    

    this.form = this.formbuilder.group({
      name: ["",Validators.required],
      address: [],
      phoneNumber: [],
      email: ["",Validators.email]
    })

  }

}
