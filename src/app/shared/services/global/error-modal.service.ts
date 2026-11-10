import { Injectable, Service, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ErrorModalService {

  readonly errorMessage = signal<string | null>(null);

  public mostrarErro(mensagem: string): void {
    this.errorMessage.set(mensagem);
  }

  public fecharErro(): void {
    this.errorMessage.set(null);
  }
}
