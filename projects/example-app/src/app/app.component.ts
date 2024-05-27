import { Component } from '@angular/core';
import { XmlBuddyComponent } from '../../../xml-buddy/src/public-api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [XmlBuddyComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  onLoadError(event: string) {
    console.log("Failed to load editor: ", event);
  }

  sampleXml = `
    <note>
      <to>Tove</to>
      <from>Jani</from>
      <heading>Reminder</heading>
      <body>Don't forget me this weekend!</body>
    </note>
  `;
}
