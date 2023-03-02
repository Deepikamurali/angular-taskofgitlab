import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { Http, Response } from '@angular/http';
import { DatePipe } from '@angular/common';

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
  baseUrl = `https://65.2.51.31:9008/api/task-viewset`;
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
      assigned_date: '2023-03-01',
      closing_date: '2023-03-01',
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
listindex: any;
  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit() {
    this.registerform = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/[A-Za-z]/g)]],
      description: [''],
      status: [''],
      priority: ['', [Validators.pattern(/[0-2]{1}/g)]],
      suggested_solution: [''],
      assigned_date: [''],
      closing_date: [''],
      assignee: [''],
    });

    this.getlist();
  }
  getlist() {
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
    this.listindex = listindex;
    this.editv = true;

    this.registerform.patchValue(user);
    this.registerform.patchValue({
      assigned_date: this.convertdate(
        this.registerform.controls.assigned_date.value
      ),
      closing_date: this.convertdate(
        this.registerform.controls.closing_date.value
      ),
    });
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

  convertdate(date2) {
    const convertedDate = new Date(date2);
    const datePipe = new DatePipe('en-US');
    const formattedDate = datePipe.transform(convertedDate, 'yyyy-MM-dd');

    console.log(formattedDate);
    return formattedDate;
  }

  onSubmit() {
    this.submitted = true;
    console.log('sumbit called', this.registerform.value);
    console.log('sumbit called', this.registerform.value);
    if (this.registerform.invalid) {
      return;
    } else {
      if (this.editv) {
        this.registeredList[this.listindex] = this.registerform.value;
        let data = {};
        data = this.registerform.value;
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
        this.registeredList.push(this.registerform.value);
        let data = {};
        data = this.registerform.value;
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
