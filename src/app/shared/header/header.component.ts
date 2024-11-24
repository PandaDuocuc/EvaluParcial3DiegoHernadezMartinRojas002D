import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  // Decorador Input permite que los componentes padres pasen el título
  @Input() titulo: string = 'TareAPP';
}
