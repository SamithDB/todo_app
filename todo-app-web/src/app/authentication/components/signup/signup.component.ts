import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserType, Register} from '../../models/register.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  userType = {
    Admin : UserType.Admin,
    User : UserType.User
  }
  
  formGroup: FormGroup = this.formBuilder.group({
    first_name: new FormControl('', Validators.required),
    last_name: new FormControl('', Validators.required),
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    confirm_password: new FormControl('', Validators.required),
    user_type: new FormControl(this.userType.User, Validators.required)
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
      first_name: new FormControl('', Validators.required),
      last_name: new FormControl('', Validators.required),
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      confirm_password: new FormControl('', Validators.required),
      user_type: new FormControl(this.userType.User, Validators.required)
    });
  }

  onSubmit(formData: Register) {
    if (formData.password === this.formGroup.controls['confirm_password'].value) {
      this.authService.userSignup(formData).subscribe( res => {
        this.openSnackBar("Successfull", "Close");
        this.router.navigate(['/auth/signin']);
      },
      error => {
        this.openSnackBar(error.error.message, "Close");
      });
    } else {
      this.openSnackBar("Passoword Mismatch", "Close");
    }
  }

  signin() {
    this.router.navigate(['/auth/signin']);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

}
