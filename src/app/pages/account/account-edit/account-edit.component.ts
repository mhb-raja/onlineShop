import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, shareReplay, take, takeUntil, tap } from 'rxjs/operators';
import { ConfirmPasswordValidator } from 'src/app/Directives/ConfirmPasswordValidator';
import { UserDTO } from 'src/app/DTOs/Account/UserDTO';
import { AuthService } from 'src/app/services/auth.service';
import { componentDestroyed } from 'src/app/shared/functions/componentDestroyed';

@Component({
  selector: 'app-account-edit',
  templateUrl: './account-edit.component.html',
  styleUrls: ['./account-edit.component.scss']
})
export class AccountEditComponent implements OnInit,OnDestroy {

  maxLenText = 100; // fname, lname, email, password
  maxLenMobile = 15;
  maxLenAddress = 500;

  myForm: FormGroup = null;
  user: UserDTO;
  user$: Observable<UserDTO>;

  constructor(private authService: AuthService) { }
  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.user$ = this.authService.getCurrentUser().pipe(
      shareReplay(),
      tap(res => {
        if (res){
          this.user=res;
          this.populateForm();
        }
      }),
      takeUntil(componentDestroyed(this))
    );
  }

  populateForm() {
    this.myForm = new FormGroup({
      'fname': new FormControl(this.user.firstname, [Validators.required, Validators.maxLength(this.maxLenText)]),
      'lname': new FormControl(this.user.lastname, [Validators.required, Validators.maxLength(this.maxLenText)]),
      'email': new FormControl(this.user.email, [Validators.required, Validators.email, Validators.maxLength(this.maxLenText)]),
      'mobile': new FormControl(this.user.mobile, [Validators.required, Validators.maxLength(this.maxLenMobile),
      Validators.pattern('09[0-9]{9}')]),
      'address': new FormControl(this.user.address, [Validators.required, Validators.maxLength(this.maxLenAddress)]),
      'password': new FormControl(null, [Validators.required, Validators.maxLength(this.maxLenText)]),
      'confirmPassword': new FormControl(null, [Validators.required, Validators.maxLength(this.maxLenText)]),
    }, { validators: ConfirmPasswordValidator });
  }

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
      this.send(data);
    }
  }

  send(data: UserDTO) {
    this.authService.editUserAccount(data).pipe(
      map(res => {
        if (res)
          this.authService.setCurrentUser(res);
      }),
      take(1)
    ).subscribe();
  }
}