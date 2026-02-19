import { Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { LayoutComponent } from "./layout/layout.component";

export default [
  { path: '', component: LayoutComponent, children: [
    { path: 'login', component: LoginComponent}
    ]},
] as Routes;
