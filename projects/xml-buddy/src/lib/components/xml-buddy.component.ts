import { AfterViewInit, Component, ElementRef, Input, Output, ViewChild, output } from '@angular/core';
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
  onSave = output<string>();

  @Input() xmlString: string = "";
  @Input() editType: 'inplace' | 'inForm' = 'inplace';
  @ViewChild('editor') editorRef!: ElementRef;
  editor: any;

  public xmlData: any;
  public formFields: any;

  constructor(private xmlBuddyService: XmlBuddyService) {}

  ngAfterViewInit(): void {
    if (this.editType === 'inplace') {
      this.setupAceEditor();
    } else if  (this.editType === 'inForm') {
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
      this.onSave.emit(updatedXml);
    } else if (this.editType === 'inForm') {
      // Handle form data as needed
      // Convert form fields back to XML
      const updatedXml = this.buildXmlFromFormFields();
      console.log(updatedXml);
      this.onSave.emit(updatedXml);
    }
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
}
