import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { UserCredentials } from '../../../shared/interfaces/user-credentials';
import { AuthTokenStorageService } from '../../../shared/services/auth/auth-token-storage.service';
import { LoggedInUserStoreService } from '../../../shared/services/auth/logged-in-user-store.service';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {

  authService = inject(AuthService);
  router = inject(Router);
  authTokenStorageService = inject(AuthTokenStorageService);
  loggedInUserStoreService = inject(LoggedInUserStoreService);

 // Usando Signals para controle de estado (tendência do Angular 21)
  hidePassword = signal(true);

  loginForm = new FormGroup({
    userName: new FormControl('', [Validators.required, Validators.minLength(5)]),
    password: new FormControl('', [Validators.required, Validators.minLength(5)])
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    const payload: UserCredentials = {
      userName: this.loginForm.controls.userName.value as string,
      password: this.loginForm.controls.password.value as string
    }

    this.authService.login(payload)
      .pipe(
        tap((res) => this.authTokenStorageService.set(res.token)),
        switchMap((res) => this.authService.getCurrentUser(res.token)),
        tap((user) => this.loggedInUserStoreService.setUser(user))
      )
      .subscribe({
        next: () => {
          this.router.navigate(['']);
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 401) {
            this.loginForm.setErrors({ invalidCredentials: true });
          }
        }
      });
  }

  togglePassword() {
    this.hidePassword.update(prev => !prev);
  }

}
