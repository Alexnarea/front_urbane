import { Component, OnInit } from '@angular/core';
import { EmployeesComponent } from '../../components/employees/employees.component';
import { AddEditEmployeeComponent } from '../../components/add-edit-employee/add-edit-employee.component';

@Component({
  selector: 'app-welcome',
  standalone: true,
  templateUrl: './welcome.component.html',
  imports: [ 
  EmployeesComponent,
  AddEditEmployeeComponent
  ],
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

}
