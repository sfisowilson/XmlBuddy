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

  handleSave(event: { xml: string, validationResult?: any }) {
    console.log('Updated XML:', event.xml);
    if (event.validationResult) {
      console.log('Validation Errors:', event.validationResult);
    }
  }

  sampleXml = `
    <note>
      <to>Tove</to>
      <from>Jani</from>
      <heading>Reminder</heading>
      <body>Don't forget me this weekend!</body>
    </note>
  `;

  sampleJson =  {
    "note.heading": {
      "required": true
    },
  };

  themeColors = {
    formBackground: '#f8f9fa',
    labelColor: '#495057',
    inputBorderColor: '#ced4da',
    buttonColor: '#007bff'
  };
}
