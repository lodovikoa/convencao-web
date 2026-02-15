import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-content',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss',
})
export class ContentComponent {

}
