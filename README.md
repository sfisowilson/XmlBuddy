# XML Buddy

XML Buddy is an Angular library that simplifies reading, displaying, and editing XML data. It provides two editing modes: inline editing using the Ace editor and form-based editing.

## Features
- **Inline Editing:** Edit XML directly in the Ace editor.
- **Form Editing:** Edit XML using a form interface, where each tag is represented as a form field.
- **Automatic XML Parsing:** Automatically parse XML into editable fields.
- **Event Emission:** Emit updated XML upon saving changes.


## Installation
Install the library from npm:

```bash
npm install xml-buddy
```

## Usage
### Importing the Module
First, import the **`XmlBuddyModule`** into your Angular application module:

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { XmlBuddyModule } from 'xml-buddy';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, XmlBuddyModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### Using the Component
You can use the **`XmlBuddyComponent`** in your component template. Specify the XML string and the edit mode (**`inplace`** for inline editing and **`inForm`** for form-based editing).

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="container">
      <h1>XML Buddy Example</h1>
      <xml-buddy 
        [xmlString]="sampleXml"
        [fieldDefinitions]="sampleJson"
        editType="inForm"
        [themeColors]="themeColors"
        (onLoadError)="onLoadError($event)"
        (onSave)="handleSave($event)"
      ></xml-buddy>
    </div>
  `,
  styles: []
})
export class AppComponent {
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

  editMode: 'inplace' | 'inForm' = 'inForm';

  onLoadError(event: string) {
    console.log("Failed to load editor: ", event);
  }

  handleSave(event: { xml: string, validationResult?: any }) {
    console.log('Updated XML:', event.xml);
    if (event.validationResult) {
      console.log('Validation Errors:', event.validationResult);
    }
  }
}
```

### Component Inputs
- **`xmlString`** (string): The XML string to be edited.
- **`editType`** ('inplace' | 'inForm'): The editing mode. Use inplace for inline editing and inForm for form-based editing.
- **`fieldDefinitions`**: JSON object containing fields and validation rules
- **`themeColors`**: Object containing theme colors

### Component Outputs

**`onSave`** (EventEmitter<any>): Emits the updated XML string when changes are saved.
**`onLoadError`** (EventEmitter<string>): Emits an error message


## Example Project
You can find an example project in the **`example`** directory of this repository. To run the example:

```bash
cd example
npm install
ng serve
```
Navigate to **`http://localhost:4200`** to see XML Buddy in action.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request on GitHub.

## License
This project is licensed under the MIT License.
