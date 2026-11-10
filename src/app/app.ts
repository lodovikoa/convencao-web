import { Component, signal, ChangeDetectionStrategy, inject, ViewChild, ElementRef, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ErrorModalService } from '@shared/services/global/error-modal.service';

@Component({
  selector: 'app-root',
  imports: [ RouterOutlet ],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('convencao-web');
  protected readonly errorService = inject(ErrorModalService);

  @ViewChild('globalErrorDialog') private readonly dialogRef!: ElementRef<HTMLDialogElement>;

  constructor() {
    effect(() => {
      const mensagem = this.errorService.errorMessage();
      if(mensagem && this.dialogRef?.nativeElement) {
        this.dialogRef.nativeElement.showModal();
      }
    });
  }

  protected fechar(): void {
    if(this.dialogRef?.nativeElement) {
      this.dialogRef.nativeElement.close();
    }
    this.errorService.fecharErro();
  }
}
