// src/app/components/employees/employees-form.component.ts

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from '../../services/api.service';
import { NzFormItemComponent, NzFormDirective, NzFormLabelComponent, NzFormControlComponent } from 'ng-zorro-antd/form';
import { NzColDirective } from 'ng-zorro-antd/grid';
import { ReactiveFormsModule } from '@angular/forms';
import { NzInputDirective } from 'ng-zorro-antd/input';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzInputNumberComponent } from 'ng-zorro-antd/input-number';
import { Employee } from '../../interfaces/employees';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [
    NzFormItemComponent,
    NzFormDirective,
    NzFormLabelComponent,
    NzFormControlComponent,
    NzColDirective,
    ReactiveFormsModule,
    NzInputDirective,
    NzDatePickerComponent,
    NzButtonComponent,
    NzInputNumberComponent
  ],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent {
  validateForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private notification: NzNotificationService
  ) {
    this.validateForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      role: ['', [Validators.required]],
      department: ['', [Validators.required]],
      hireDate: [null, [Validators.required]],
      salary: [0, [Validators.required, Validators.min(0)]]
    });
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      const employeeData: Employee= this.validateForm.value;
      this.apiService.create(employeeData).subscribe({
        next: () => {
          this.createNotification('success', `${employeeData.firstName} ${employeeData.lastName}`, 'Employee has been created successfully!');
          this.validateForm.reset();
        },
        error: () => {
          this.createNotification('error', 'Error', 'Failed to create employee.');
        }
      });
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      });
    }
  }

  createNotification(type: string, title: string, message: string): void {
    this.notification.create(type, title, message);
  }
}
