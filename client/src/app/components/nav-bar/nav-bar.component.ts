import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink, RouterOutlet } from '@angular/router';
import {ApiService} from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
  isUserLoggedIn: boolean = false;

  ngOnInit() {
    if (typeof localStorage !== 'undefined') {
      if(localStorage.getItem('user')) {
        this.isUserLoggedIn = true;
      }
    } else {
      this.isUserLoggedIn = false;
    }
  }
  
  constructor(private router: Router,
    private apiService: ApiService 
  ) {}

  onLogoClick() {
    console.log('logo clicked');
    this.router.navigate(['/']);
  }

  onLogout(): void {
    this.apiService.logout().subscribe((response: any) => {
      
      if (response.success) {
        localStorage.removeItem('user');
        window.location.reload();
        this.router.navigate(['/auth']);
      }
    })
  }
}
