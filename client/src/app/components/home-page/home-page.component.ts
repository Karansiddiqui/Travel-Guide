import { Component } from '@angular/core';
import { RegisterComponent } from "../register/register.component";
import { NavBarComponent } from '../nav-bar/nav-bar.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RegisterComponent, NavBarComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
  signUpFormVisible = false;

  toggleSignUpForm() {
    this.signUpFormVisible = !this.signUpFormVisible;
  }
}
