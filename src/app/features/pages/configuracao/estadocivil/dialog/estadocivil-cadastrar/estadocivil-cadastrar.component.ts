import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { Estadocivil } from '@shared/interfaces/configuracao/estadocivil';
import { EstadocivilService } from '@shared/services/configuracao/estadocivil.service';

@Component({
  selector: 'app-estadocivil-cadastrar',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './estadocivil-cadastrar.component.html',
  styleUrl: './estadocivil-cadastrar.component.scss',
})
export class EstadocivilCadastrarComponent {

  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<EstadocivilCadastrarComponent>);
  private readonly estadocivilService = inject(EstadocivilService);

  isLoading = signal(false);
  form: FormGroup = this.fb.group({
    dsEstadoCivil: ['', [Validators.required, Validators.maxLength(30)]],
  });

  onSave() {
    if (!this.form.valid) {
      return;
    }

    this.estadocivilService.cadastrar(this.form.value as Estadocivil).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.isLoading.set(false);
      }
     });
  }

  onCancel () {
    this.dialogRef.close(null);
  }

}
