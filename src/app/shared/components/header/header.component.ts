import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { UserDTO } from 'src/app/DTOs/Account/UserDTO';
import { AuthService } from 'src/app/services/auth.service';
import { cookieString } from 'src/app/Utilities/Security';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  user$: Observable<UserDTO>;
  user: UserDTO = null;

  constructor(private authService: AuthService,
    private cookieService: CookieService,
    private router: Router) { }

  ngOnInit(): void {
    this.user$ = this.authService.getCurrentUser().pipe(
      shareReplay()
    );

    // this.authService.getCurrentUser().subscribe(user => {
    //   console.log('user',this.user);

    //   this.user = user;
    // });
  }

  logout() {
    // this.authService.logOutUser().subscribe(res=>{
    //   if(res.eStatus===Status.Success)
    //   console.log('user has signed out');      
    // });
    this.cookieService.delete(cookieString);
    this.authService.setCurrentUser(null);
    //this.router.navigate(['/']);
  }
}
