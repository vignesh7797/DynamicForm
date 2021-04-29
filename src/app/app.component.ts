import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

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
  submittedData;


  constructor(private http: HttpClient, private builder:FormBuilder) {  

    this.registerForm = this.builder.group({
      FirstName:[null, Validators.required],
      LastName:[null, Validators.required],
      EmailId:[null, [Validators.required, Validators.email]],
      PhoneNo:[null, [Validators.required, Validators.max(9999999999), Validators.min(1000000000)]],
      Gender:[null],
      DOB:[null, [Validators.required]],
      Address:[null, Validators.required],
      State:[null, Validators.required],
      District:[null, Validators.required],
      Pincode:[null, [Validators.required, Validators.max(999999), Validators.min(100000)]]
    });

   }

   get f() {
    return this.registerForm.controls;
  }

  ngOnInit(){

    this.http.get("/assets/form.json").subscribe(data => {
      this.dynamicFormArray = data;
      console.log(this.dynamicFormArray);
    });
    
    this.http.get("/assets/states.json").subscribe(data => {
      this.states = data;
      console.log(this.states);
      this.district=[];
      
    });    
    
  }

  



  OnSelectState(e){
    let index =this.states.map((s)=> s.state).indexOf(e);
    this.district = this.states[index].districts;
    console.log(e, index)
  }

  OnSubmit(){
   if(this.registerForm.valid){
    this.submittedData =JSON.parse(this.registerForm.value);
    console.log(this.submittedData);
   }
  }

  

}
