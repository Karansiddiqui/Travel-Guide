import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';  // Import your ApiService
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  imports: [ReactiveFormsModule, CommonModule],
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  signUpForm: FormGroup;
  loginForm: FormGroup;
  errorMessage: string | null = null;
  loading = false;
  isRegistering = false; // Toggle state

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiService 
  ) {
    // Initialize sign-up form
    this.signUpForm = this.fb.group({
      userName: ['', [Validators.required, Validators.pattern(/^[a-z]+$/)]],
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4),  Validators.pattern(/[A-Z]/)]],
    });

    // Initialize login form
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  toggleForm() {
    this.isRegistering = !this.isRegistering;
    this.errorMessage = null; // Clear error message on toggle
  }

  onRegisterSubmit(): void {
    console.log(this.signUpForm.value);
    
    if (this.signUpForm.invalid) {
      this.errorMessage = 'Please fill out all fields';
      return;
    }
  
    this.loading = true;
    this.errorMessage = null;
  
    // Use the ApiService to send registration data
    this.apiService.register(this.signUpForm.value).subscribe(
      
      (response: any) => {
        console.log("here");
        console.log("res",response);
        this.loading = false;
        if (response.success) {
          this.isRegistering = false;
        } else {
          
          // Loop through response errors and collect messages
          console.log(response.errors);
          
          this.errorMessage = response.errors ? response.errors.map((err: any) => err.message).join(', ') : 'Registration failed';
        }
      },
      (error) => {
        console.error("Error occurred:", error.error.message);
        this.loading = false;
        
        this.errorMessage = error.error.message ? error.error.message : 'Registration failed';
      }
    );
  }

  onLoginSubmit(): void {
    console.log(this.loginForm.value);

    if (this.loginForm.invalid) {
      this.errorMessage = 'Please fill out all fields';
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    // Use the ApiService to send login data
    this.apiService.login(this.loginForm.value).subscribe(
      (response: any) => {
        this.loading = false;
        if (response.success) {
          this.router.navigate(['/']);
        } else {
          this.errorMessage = response.error.message ? response.error.message : 'Registration failed';
        }
      },
      (error) => {
        console.log(error);
        this.loading = false;
        this.errorMessage = error.error.message ? error.error.message : 'Login failed';
      }
    );
  }
}
