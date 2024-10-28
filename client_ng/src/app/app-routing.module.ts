import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './components/forms/auth/auth.component'; // Import the AuthComponent

const routes: Routes = [
  { path: '', component: AuthComponent }, // Define the route for AuthComponent
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
