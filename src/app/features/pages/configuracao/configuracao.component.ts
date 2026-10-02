import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-configuracao',
  imports: [RouterOutlet],
  templateUrl: './configuracao.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './configuracao.component.scss',
})
export class ConfiguracaoComponent {

}
