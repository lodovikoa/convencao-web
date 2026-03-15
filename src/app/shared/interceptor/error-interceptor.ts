import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RetornoErro } from '@shared/interfaces/public/retorno-erro';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((erro: HttpErrorResponse) => {
      let mensagemResumo = 'Ocorreu um erro inesperado.';

      if(erro.error && (erro.error as RetornoErro).dsMensUsuario) {
        // Captura mensagem retornada pela API para exibi-la na tela do usuário
        const err = erro.error as RetornoErro;
        mensagemResumo = `OPERAÇÃO NÃO REALIZADA:\n${err.dsMensUsuario}\nCódigo do erro: ${err.cdStatus}\n${err.dsTitulo}`;
      }

      // Exibe o alerta visual para o usuário
      snackBar.open(mensagemResumo, 'Fechar', {
        duration: 40000,
        panelClass: ['error-snackbar'],
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });

      return throwError(() => erro);
    })
  );
};
