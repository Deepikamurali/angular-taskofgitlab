import { Component, OnInit } from '@angular/core';
//import { HttpClient } from '@angular/common/http';
import { Http, Response } from '@angular/http';

import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  registerform: FormGroup;
  submitted: boolean = false;
  editv: boolean = false;
  baseUrl = `http://65.2.51.31:9008/api/task-viewset`;
  selected_index: any;
  registeredList: any = [
    {
      id: 10,
      name: 'Missing Content- Type Header rtst',
      description:
        'QRC Scanner detected a missing Content-Typeheader which means that this website\ncould be at risk of a MIME-sniffing attacks.',
      status: true,
      priority: '1',
      suggested_solution:
        'When serving resources, make sure you send the content-type header to appropriately\nmatch the type of the resource being served. For example, if you are serving an HTML page,\nyou should send the HTTP header:\nContent-Type: text/html',
      risk_id: null,
      assigned_date: '2023-02-22T00:00:00Z',
      closing_date: '2023-02-25T00:00:00Z',
      owner: null,
      assignee: [1],
    },
    {
      id: 41,
      name: 'test',
      description: 'desc',
      status: true,
      priority: '1',
      suggested_solution: 'fgfh',
      risk_id: '9',
      assigned_date: '2023-01-31T18:30:00Z',
      closing_date: '2023-03-21T18:30:00Z',
      owner: 1,
      assignee: [1],
    },
    {
      id: 42,
      name: 'task 5',
      description: 'restts',
      status: true,
      priority: '2',
      suggested_solution: 'sets',
      risk_id: '3',
      assigned_date: '2023-02-27T18:30:00Z',
      closing_date: '2023-03-08T18:30:00Z',
      owner: 1,
      assignee: [1],
    },
  ];
  constructor(private fb: FormBuilder, private http: Http) {}

  ngOnInit() {
    this.registerform = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      status: [''],
      priority: ['', [Validators.required, Validators.pattern(/[0-2]{1}/g)]],
      suggested_solution: [''],
      assigned_date: [''],
      closing_date: [''],
      assignee: [''],
    });

    this.getlist();
  }
  getlist() {
    console.log('api called');
    this.http.get(this.baseUrl).subscribe(
      (data: any) => {
        console.log('api called', data);
        this.registeredList = data;
      },
      (err) => {
        console.log(err);
      }
    );
  }
  onReset() {
    this.submitted = false;
    this.editv = false;
    this.registerform.reset();
  }
  get rf() {
    return this.registerform.controls;
  }
  edit(user, i, listindex) {
    this.selected_index = i;
    this.editv = true;
    this.registerform.patchValue(user);
  }
  delete(index, listindex) {
    this.registeredList.splice(listindex, 1);
    console.log(this.registeredList);
    this.http.delete(`${this.baseUrl}/${index}/`).subscribe(
      (res) => {
        console.log('deleted successfully');
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onSubmit() {
    this.submitted = true;
    console.log('sumbit called');
    if (this.registerform.invalid) {
      return;
    } else {
      if (this.editv) {
        console.log(this.registerform.controls.value);
        //this.registeredList[this.selected_index] = this.registerform.value;
        let data = {};
        data = this.registerform.controls.value;
        this.http
          .post(`${this.baseUrl}/${this.selected_index}`, data)
          .subscribe(
            (data: any) => {
              console.log('api called', data);
              this.registeredList = data;
            },
            (err) => {
              console.log(err);
            }
          );
        this.onReset();
      } else {
        this.registeredList.push(this.registerform.controls.value);
        let data = {};
        data = this.registerform.controls.value;
        this.http.post(`${this.baseUrl}`, data).subscribe(
          (data: any) => {
            console.log('api called', data);
            this.registeredList = data;
          },
          (err) => {
            console.log(err);
          }
        );
      }
    }
  }
}

export function duplicatevalidation(
  control: AbstractControl
): { [key: string]: any } | null {
  let value = this?.registerform?.value;
  if (value?.password != value?.confirmPassword) {
    return { duplicate: true };
  }
  return null;
}
