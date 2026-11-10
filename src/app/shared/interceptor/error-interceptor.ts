import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { RetornoErro } from '@shared/interfaces/utilitarios/retorno-erro';
import { ErrorModalService } from '@shared/services/global/error-modal.service';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorModalService = inject(ErrorModalService);

  return next(req).pipe(
    catchError((erro: HttpErrorResponse) => {
      let mensagemResumo = 'Ocorreu um erro inesperado na requisição.';

      if(erro.error) {
        const err = erro.error as RetornoErro;
        if(err.dsMensUsuario || err.dsTitulo) {
           mensagemResumo = `OPERAÇÃO NÃO REALIZADA:\n` +
              (err.cdStatus ? `Código: ${err.cdStatus}\n `: '') +
              (err.dsTitulo ? `${err.dsTitulo}\n`: '') +
              (err.dsMensUsuario ? `${err.dsMensUsuario}` : '') ;
        } else if(erro.message) {
          mensagemResumo = erro.message;
        }
      }

      // Dispara o modal globalmente de forma reativa
      errorModalService.mostrarErro(mensagemResumo);

      return throwError(() => erro);
    })
  );
};
