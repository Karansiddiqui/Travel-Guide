import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Import Router
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterLink], // Add any necessary imports here
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'], // Use styleUrls instead of styleUrl
})
export class NavBarComponent {
  constructor(private router: Router) {} // Inject Router

  onLogoClick() {
    console.log('logo clicked');
    this.router.navigate(['/']); // Navigate to home
  }
}
