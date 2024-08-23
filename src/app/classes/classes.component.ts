import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; // Import Validators
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-classes',
  standalone: true,
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.css'],
  imports: [CommonModule, ReactiveFormsModule] 
})
export class ClassesComponent implements OnInit {
  classesForm: FormGroup;
  teachers: string[] = ['Teacher 1', 'Teacher 2', 'Teacher 3']; 
  classList: any[] = [];

  constructor(private fb: FormBuilder) {
    this.classesForm = this.fb.group({
      className: ['', Validators.required],
      classNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      teacher: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  addClass() {
    if (this.classesForm.valid) {
      this.classList.push(this.classesForm.value);
      this.classesForm.reset();
    }
  }
}
