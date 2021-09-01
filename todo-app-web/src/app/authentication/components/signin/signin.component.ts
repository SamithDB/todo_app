import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  formGroup: FormGroup = this.formBuilder.group({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  titleAlert: string = 'This field is required';

  constructor(private formBuilder: FormBuilder, private authService: AuthService,
    private router: Router, private _snackBar: MatSnackBar) { }

  ngOnInit() {
    if(localStorage.getItem('token') !== null && localStorage.getItem('toke') !== '') {
      this.router.navigate(['/todo/list']);
    }
    this.createForm();
  }

  createForm() {
    this.formGroup = this.formBuilder.group({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

  onSubmit(formData: {username: string, password: string}) {
    this.authService.userSignin(formData).subscribe( res => {
      this.openSnackBar("Successfull", "Close");
      localStorage.setItem('token', res['token']);
      localStorage.setItem('user', res.user.user_first_name + ' ' +res.user.user_last_name);
      this.router.navigate(['/todo/list']);
    },
    error => {
      this.openSnackBar(error.error.message, "Close");
    });
  }

  signup() {
    this.router.navigate(['/auth/signup']);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

}
