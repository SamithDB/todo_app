import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  userFullName : string | null = '';
  constructor(private router: Router) { }

  ngOnInit(): void {
    if(localStorage.getItem('user') === null || localStorage.getItem('user') === '') {
      this.logout();
    } else {
      this.userFullName = localStorage.getItem('user');
    }
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/auth/signin']);
  }

}
