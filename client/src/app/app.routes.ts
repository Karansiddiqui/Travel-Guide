import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { HomePageComponent } from './components/home-page/home-page.component'; // Make sure this import is correct

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home', // Changed 'HomePage' to 'home' for consistency in naming
    pathMatch: 'full',
  },
  {
    path: 'home', // Ensure this matches your HomePage component
    component: HomePageComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
