import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface Data{
  FormData;
}

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
  maxdate = new Date().toISOString().split("T")[0];


  constructor(private http: HttpClient, private builder:FormBuilder) {  

    // this.registerForm = this.builder.group({
    //   FirstName:[null, Validators.required],
    //   LastName:[null, Validators.required],
    //   EmailId:[null, [Validators.required, Validators.email]],
    //   PhoneNo:[null, [Validators.required, Validators.max(9999999999), Validators.min(1000000000)]],
    //   Gender:[null],
    //   DOB:[null, [Validators.required]],
    //   Address:[null, Validators.required],
    //   State:[null, Validators.required],
    //   District:[null, Validators.required],
    //   Pincode:[null, [Validators.required, Validators.max(999999), Validators.min(100000)]]
    // });

    this.registerForm = this.builder.group({});

    

   }

   get f() {
    return this.registerForm.controls;
  }

  ngOnInit(){

    this.http.get("/assets/form.json").subscribe((res: Response) => {
      this.dynamicFormArray = res;
      console.log(this.dynamicFormArray);
      this.newFormControl();
    });

    this.http.get("/assets/states.json").subscribe(data => {
      this.states = data;
      console.log(this.states);
      this.district=[];
    });    
    
  }


  newFormControl(){

    this.dynamicFormArray.forEach(item =>{
      if(item.Validation.required == true){
          if(item.Validation.type == 'text' || !item.Validation.type){
            this.registerForm.addControl(item.id, new FormControl(null, Validators.required));
          }else if(item.Validation.type == 'email'){
            this.registerForm.addControl(item.id, new FormControl(null, [Validators.required, Validators.email]));
          }else if(item.Validation.type == 'number'){
            this.registerForm.addControl(item.id, new FormControl(null, [Validators.required, Validators.min(item.Validation.min), Validators.max(item.Validation.max)]))
          }
      }else{
        this.registerForm.addControl(item.id, new FormControl(null));
      }
    });

    console.log(this.registerForm);
  }


  
  OnSelectState(e){
    let index =this.states.map((s)=> s.state).indexOf(e);
    this.district = this.states[index].districts;
    console.log(e, index)
  }



  CountDigits(num){
    return num.toString().length;
  }



  OnSubmit(){
    if(this.registerForm.valid){
     this.submittedData =this.registerForm.getRawValue();
     console.log(this.registerForm.value);
     this.submittedData.DOB = new DatePipe('en-US').transform(this.submittedData.DOB, 'MMMM d, y');

     this.registerForm.reset();

    Object.keys(this.registerForm.controls).forEach(key => {
      this.registerForm.get(key).setErrors(null) ;
    });
    }
   }
  

}

