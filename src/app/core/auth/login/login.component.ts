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
import { LoginFacadeService } from '../../../shared/services/auth/login-facade.service';

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
  loginFacadeService = inject(LoginFacadeService);
  mensagemErroLogin: string = '';

  // Usando Signals para controle de estado (tendência do Angular 21)
  hidePassword = signal(true);

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(5)]),
    password: new FormControl('', [Validators.required, Validators.minLength(5)])
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    const payload: UserCredentials = {
      username: this.loginForm.controls.username.value as string,
      password: this.loginForm.controls.password.value as string
    }

    this.loginFacadeService.login(payload).subscribe({
      next: (ret) => {
        this.router.navigate(['']);
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 401) {
          this.loginForm.setErrors({ invalidCredentials: true });
          this.mensagemErroLogin = 'Credenciais inválidas, tente novamente.'
        }
        if (err.status == 500) {
          this.loginForm.setErrors({ invalidCredentials: true });
          this.mensagemErroLogin = 'Erro de comunicação, informe ao administrador responável.'
        }
      }
    });
  }

  togglePassword() {
    this.hidePassword.update(prev => !prev);
  }

  erroLogin() {
    return this.mensagemErroLogin;
  }
}
