import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { SignupComponent } from "./signup/signup.component";

const routes: Routes = [
  {
    path: '',
    children : [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login',
      },
      {
        path : 'login',
        component : LoginComponent,
      }
  ]
},
  {
    path: 'signup',
    component: SignupComponent,
  }
]

@NgModule({
  declarations: [LoginComponent, SignupComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
})
export class AuthModule {}
