import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmPasswordValidator } from 'src/app/Directives/ConfirmPasswordValidator';
import { UserDTO } from 'src/app/DTOs/Account/UserDTO';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  maxLenText = 100; // fname, lname, email, password
  maxLenMobile = 15;
  maxLenAddress = 500;
  responseMessage: string;

  constructor(private authService: AuthService, private router: Router) { }

  myForm = new FormGroup({
    'fname': new FormControl(null, [Validators.required, Validators.maxLength(this.maxLenText)]),
    'lname': new FormControl(null, [Validators.required, Validators.maxLength(this.maxLenText)]),
    'email': new FormControl(null, [Validators.required, Validators.email, Validators.maxLength(this.maxLenText)]),
    'mobile': new FormControl(null, [Validators.required, Validators.maxLength(this.maxLenMobile),
    Validators.pattern('09[0-9]{9}')]),
    'address': new FormControl(null, [Validators.required, Validators.maxLength(this.maxLenAddress)]),
    'password': new FormControl(null, [Validators.required, Validators.maxLength(this.maxLenText)]),
    'confirmPassword': new FormControl(null, [Validators.required, Validators.maxLength(this.maxLenText)]),
  }, { validators: ConfirmPasswordValidator });


  createObject(): UserDTO {
    const data: UserDTO = {
      id: 0,
      address: this.myForm.controls.address.value,
      email: this.myForm.controls.email.value,
      firstname: this.myForm.controls.fname.value,
      lastname: this.myForm.controls.lname.value,
      mobile: this.myForm.controls.mobile.value,
      password: this.myForm.controls.password.value,
    };
    return data;
  }

  onSubmit() {
    if (!this.myForm.valid)
      this.myForm.markAsTouched();
    else {
      const data = this.createObject();
      this.sendNew(data);
    }
  }

  sendNew(data: UserDTO) {
    this.authService.registerUser(data).subscribe(res => {
      if (res) {        
        this.myForm.reset();
        this.router.navigate(['/login']);       
      }
    });
  }

}
