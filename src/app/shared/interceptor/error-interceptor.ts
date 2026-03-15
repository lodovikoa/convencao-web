import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RetornoErro } from '@shared/interfaces/public/retorno-erro';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let mensagemResumo = 'Ocorreu um erro inesperado.';

      if(error.error && (error.error as RetornoErro).dsMensUsuario) {
        // Captura mensagem retornada pela API para exibi-la na tela do usuário
        mensagemResumo = 'Operação não realizada: ' + (error.error as RetornoErro).dsMensUsuario;
      }

      // Exibe o alerta visual para o usuário
      snackBar.open(mensagemResumo, 'Fechar', {
        duration: 20000,
        panelClass: ['error-snackbar'],
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });

      return throwError(() => error);
    })
  );
};
