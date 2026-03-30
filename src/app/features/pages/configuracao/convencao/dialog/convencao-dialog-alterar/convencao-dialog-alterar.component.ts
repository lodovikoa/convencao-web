import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Convencao } from '@shared/interfaces/configuracao/convencao';

@Component({
  selector: 'app-convencao-dialog-alterar',
  imports: [ CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule ],
  templateUrl: './convencao-dialog-alterar.component.html',
  styleUrl: './convencao-dialog-alterar.component.scss',
})
export class ConvencaoDialogAlterarComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<ConvencaoDialogAlterarComponent>);
  readonly data: Convencao = inject(MAT_DIALOG_DATA);

  form!: FormGroup;

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [this.data.id],
      dsReduzido: [this.data.dsReduzido, [Validators.required]],
      dsConvencao: [this.data.dsConvencao, [Validators.required]],
      dsCnpj: [this.data.dsCnpj],
      dsEmail: [this.data.dsEmail, [Validators.email]],
      dsTelefones: [this.data.dsTelefones],
      dsWatsapp: [this.data.dsWatsapp],
      dsCep: [this.data.dsCep],
      dsEndereco: [this.data.dsEndereco],
      dsBairro: [this.data.dsBairro],
      dsCidade: [this.data.dsCidade],
      dsPais: [this.data.dsPais],
      imLogo: [this.data.imLogo],
      estado: [this.data.estado] // Mantém o objeto estado original
    });
  }

  salvar(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

}
