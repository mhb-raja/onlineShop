import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ConfirmPasswordValidator } from 'src/app/Directives/ConfirmPasswordValidator';
import { UserDTO } from 'src/app/DTOs/Account/UserDTO';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-account-home',
  templateUrl: './account-home.component.html',
  styleUrls: ['./account-home.component.scss']
})
export class AccountHomeComponent implements OnInit {
  
  constructor() { }
  ngOnInit(): void {}    
}

