import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { element } from 'protractor';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'DynamicForm';

  dynamicFormArray: any;
  states: any;
  district:any;
  registerForm:FormGroup;

  constructor(private http: HttpClient, private builder:FormBuilder) {   }

  ngOnInit(){

    this.registerForm = this.builder.group({

    });


    this.http.get("/assets/form.json").subscribe(data => {
      this.dynamicFormArray = data;
      console.log(this.dynamicFormArray);
    });
    this.http.get("/assets/states.json").subscribe(data => {
      this.states = data;
      console.log(this.states);
      this.district=this.states[0].districts;
      this.formControl();
    });
    
  }


  formControl(){
    this.dynamicFormArray.forEach(element =>{
      this.registerForm.addControl(element.id, new FormControl(''));
    });

    console.log(this.registerForm.controls)
  }



  OnSelectState(e){
    let index =this.states.map((s)=> s.state).indexOf(e);
    this.district = this.states[index].districts;
    console.log(e, index)
  }

}
