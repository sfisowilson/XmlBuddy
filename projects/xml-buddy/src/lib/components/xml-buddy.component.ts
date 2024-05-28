import { AfterViewInit, Component, ElementRef, Input, ViewChild, ChangeDetectorRef, output } from '@angular/core';
import { XmlBuddyService } from '../services/xml-buddy.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
declare var ace: any;
import * as xml2js from 'xml2js';

@Component({
  selector: 'xml-buddy',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './xml-buddy.component.html',
  styleUrls: ['./xml-buddy.component.scss']
})

export class XmlBuddyComponent implements AfterViewInit{
  onLoadError = output<string>();
  onSave = output<any>();

  @Input() xmlString: string = "";
  @Input() editType: 'inplace' | 'inForm' = 'inplace';
  @Input() fieldDefinitions: any = null; // JSON object containing fields and validation rules
  @Input() themeColors: { [key: string]: string } = {}; // Object containing theme colors

  @ViewChild('editor') editorRef!: ElementRef;
  editor: any;

  public xmlData: any;
  public formFields: any;
  public formErrors: any = {};
  fieldKeys?: string[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    if (this.editType === 'inplace') {
      this.setupAceEditor();
    } else if (this.editType === 'inForm') {
      this.parseXmlToFormFields();
    }
  }

  setupAceEditor(): void {
    this.editor = ace.edit(this.editorRef.nativeElement);
    this.editor.setTheme('ace/theme/monokai');
    this.editor.session.setMode('ace/mode/xml');
    this.editor.setValue(this.xmlString);

    this.editor.setOptions({
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
      enableSnippets: true
    });
  }

  parseXmlToFormFields(): void {
    const parser = new xml2js.Parser({ explicitArray: false });
    parser.parseString(this.xmlString, (err, result) => {
      if (!err) {
        this.xmlData = result;
        this.formFields = this.flattenObject(this.xmlData);
        this.removeNestedNodesWithoutText();
        this.fieldKeys = this.getFieldKeys();
        this.cdr.detectChanges(); // Mark changes
      } else {
        this.onLoadError.emit(err.message);
      }
    });
  }

  removeNestedNodesWithoutText(): void {
    for (const key in this.formFields) {
      const value = this.formFields[key];
      if (typeof value === 'object' && !Array.isArray(value)) {
        if (!Object.values(value).some((childValue: any) => typeof childValue === 'object')) {
          delete this.formFields[key];
        }
      }
    }
  }

  saveChanges(): void {
    if (this.editType === 'inplace') {
      const updatedXml = this.editor.getValue();
      this.onSave.emit({ xml: updatedXml });
    } else if (this.editType === 'inForm') {
      const validationResult = this.validateFormFields();
      const updatedXml = this.buildXmlFromFormFields();
      this.onSave.emit({ xml: updatedXml, validationResult });
    }
  }

  validateFormFields(): any {
    const errors: any = {};
    if (this.fieldDefinitions) {
      for (const field in this.fieldDefinitions) {
        const rules = this.fieldDefinitions[field];
        if (rules.required && !this.formFields[field]) {
          errors[field] = 'This field is required.';
        }
        if (rules.maxLength && this.formFields[field]?.length > rules.maxLength) {
          errors[field] = `This field must be less than ${rules.maxLength} characters.`;
        }
        // Add more validation rules as needed
      }
    }
    this.formErrors = errors;
    return errors;
  }

  flattenObject(obj: any, parent: string = '', res: any = {}): any {
    for (let key in obj) {
      let propName = parent ? parent + '.' + key : key;
      if (typeof obj[key] == 'object' && obj[key] !== null) {
        this.flattenObject(obj[key], propName, res);
      } else {
        res[propName] = obj[key];
      }
    }
    return res;
  }

  extractFieldName(fieldName: string): string {
    const parts = fieldName.split('.');
    const lastPart = parts[parts.length - 1];
    return lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
  }

  unflattenObject(data: any): any {
    const result: any = {};
    for (const key in data) {
      const keys = key.split('.');
      keys.reduce((acc: any, part: string, index: number) => {
        return acc[part] || (acc[part] = (index === keys.length - 1 ? data[key] : {}));
      }, result);
    }
    return result;
  }

  buildXmlFromFormFields(): string {
    const unflattenedObject = this.unflattenObject(this.formFields);
    const builder = new xml2js.Builder();
    const updatedXml = builder.buildObject(unflattenedObject);
    return updatedXml;
  }

  getFieldKeys(): string[] {
    // If fieldDefinitions are provided, only include those keys that exist in both XML and fieldDefinitions
    if (this.fieldDefinitions) {
      return Object.keys(this.fieldDefinitions).filter(key => this.formFields.hasOwnProperty(key));
    } else {
      return Object.keys(this.formFields);
    }
  }
}