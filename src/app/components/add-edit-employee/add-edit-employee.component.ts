import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from '../../services/api.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { Employee } from '../../interfaces/employees';

@Component({
  selector: 'app-add-edit-employee',
  templateUrl: './add-edit-employee.component.html',
  styleUrls: ['./add-edit-employee.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NzButtonModule,
    HttpClientModule,
    CommonModule,
    NzInputNumberModule,
    NzTableModule,
    NzDatePickerModule,
  ]
})
export class AddEditEmployeeComponent implements OnInit {
  listOfData: Employee[] = [];
  editId: string | null = null;
  validateForm: FormGroup;
  selectedEmployee: Employee | null = null;
  isVisible = false;

  constructor(
    private apiService: ApiService,
    private notification: NzNotificationService,
    private fb: FormBuilder
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

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.apiService.getAll().subscribe({
      next: (data) => {
        this.listOfData = data;
      },
      error: () => {
        this.createNotification('error', 'Error', 'Failed to load employees.');
      }
    });
  }

  editEmployee(employee: Employee): void {
    this.selectedEmployee = { ...employee };
    this.isVisible = true;
    this.validateForm.patchValue(this.selectedEmployee);
    this.editId = employee.id ?? null;
  }

  updateEmployee(data: any): void {
    if (this.validateForm.valid && this.selectedEmployee?.id) {
      const updatedEmployee = { ...this.selectedEmployee, ...this.validateForm.value };

      this.apiService.update(this.selectedEmployee.id, updatedEmployee).subscribe({
        next: () => {
          this.loadEmployees();  // Recarga la lista de empleados
          this.createNotification('success', 'Success', 'Employee updated successfully!');
          this.isVisible = false;
          this.selectedEmployee = null;
          this.editId = null;
          this.validateForm.reset();
        },
        error: (error) => {
          this.createNotification('error', 'Error', 'Failed to update employee.');
          console.error('Update Error:', error);
        }
      });
    } else {
      console.error('Selected employee or id is missing');
    }
  }

  deleteEmployee(id: string | undefined): void {
    if (id) {
      this.apiService.delete(id).subscribe({
        next: () => {
          this.listOfData = this.listOfData.filter(emp => emp.id !== id);
          this.createNotification('success', 'Success', 'Employee deleted successfully!');
        },
        error: () => {
          this.createNotification('error', 'Error', 'Failed to delete employee.');
        }
      });
    } else {
      console.error('Employee id is undefined');
    }
  }

  createNotification(type: string, title: string, message: string): void {
    this.notification.create(type, title, message);
  }
}