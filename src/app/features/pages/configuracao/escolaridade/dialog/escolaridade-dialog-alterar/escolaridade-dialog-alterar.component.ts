import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { Escolaridade } from '@shared/interfaces/configuracao/escolaridade';
import { EscolaridadeService } from '@shared/services/configuracao/escolaridade.service';

@Component({
  selector: 'app-escolaridade-dialog-alterar',
  imports: [ CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './escolaridade-dialog-alterar.component.html',
  styleUrl: './escolaridade-dialog-alterar.component.scss',
})
export class EscolaridadeDialogAlterarComponent {

  private readonly fb = inject(FormBuilder);
  private readonly escolaridadeService = inject(EscolaridadeService);
  private readonly dialogRef = inject(MatDialogRef<EscolaridadeDialogAlterarComponent>);
  readonly data: Escolaridade = inject(MAT_DIALOG_DATA);

  isLoading = signal(false);

  form!: FormGroup;

  escolaridades = signal<Escolaridade[]>([]); // Sinal para armazenar as Escolaridades

  ngOnInit(): void {
    this.carregarEscolaridades();

    this.form = this.fb.group({
      id: [this.data.id],
      dsDescricao: [this.data.dsDescricao, [Validators.required, Validators.maxLength(40)]],
    });
  }

    private carregarEscolaridades(): void {
    this.escolaridadeService.listarEscolaridades().subscribe(result => {
      this.escolaridades.set(result);
    });
  }

    compararEscolaridade(escolaridade1: Escolaridade | null, escolaridade2: Escolaridade | null): boolean {
      // Se ambos forem nulos, são iguais
      if (escolaridade1 === null && escolaridade2 === null) return true;

      // Se um for nulo e o outro não, são diferentes
      if (escolaridade1 === null || escolaridade2 === null) return false;

      // Se ambos existem, compara pelo ID
      return escolaridade1.id === escolaridade2.id;
    }

  onSave() {
    if(!this.form.valid) {
      return;
    }

    this.escolaridadeService.editarEscolaridade(this.form.value as Escolaridade).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.isLoading.set(false);
      }
    });
  }

}
