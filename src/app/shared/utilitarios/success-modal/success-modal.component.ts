import { Component, ChangeDetectionStrategy, input, output, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-success-modal',
  standalone: true,
  imports: [],
  templateUrl: './success-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuccessModalComponent {
  @ViewChild('successDialog') private readonly successDialog!: ElementRef<HTMLDialogElement>;

  // Mensagem que o modal vai exibir
  public readonly mensagem = input.required<string>();

  // Evento emitido quando o modal é fechado
  public readonly fechado = output<void>();

  public abrir(): void {
    this.successDialog?.nativeElement.showModal();
  }

  public fechar(): void {
    this.successDialog?.nativeElement.close();
    this.fechado.emit();
  }
}
