import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { XmlBuddyComponent } from './xml-buddy.component';
import * as xml2js from 'xml2js';

describe('XmlBuddyComponent', () => {
  let component: XmlBuddyComponent;
  let fixture: ComponentFixture<XmlBuddyComponent>;
  let cdr: ChangeDetectorRef;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule],
      declarations: [XmlBuddyComponent],
      providers: [ChangeDetectorRef]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XmlBuddyComponent);
    component = fixture.componentInstance;
    cdr = TestBed.inject(ChangeDetectorRef);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should parse XML to form fields', () => {
    component.xmlString = `<note>
      <to>Tovess</to>
      <from>Jani</from>
      <heading>Reminder</heading>
      <body>Don't forget me this weekend!</body>
    </note>`;
    component.editType = 'inForm';
    component.ngAfterViewInit();
    fixture.detectChanges();

    expect(component.formFields).toEqual({
      'note.to': 'Tovess',
      'note.from': 'Jani',
      'note.heading': 'Reminder',
      'note.body': "Don't forget me this weekend!"
    });
  });

  it('should generate field keys based on XML and field definitions', () => {
    component.xmlString = `<note>
      <to>Tovess</to>
      <from>Jani</from>
      <heading>Reminder</heading>
      <body>Don't forget me this weekend!</body>
    </note>`;
    component.editType = 'inForm';
    component.fieldDefinitions = {
      'note.heading': { required: true },
      'note.to': { required: true }
    };
    component.ngAfterViewInit();
    fixture.detectChanges();

    expect(component.fieldKeys).toEqual(['note.heading', 'note.to']);
  });

  it('should emit onSave event with updated XML and validation result', () => {
    spyOn(component.onSave, 'emit');
    
    component.xmlString = `<note>
      <to>Tovess</to>
      <from>Jani</from>
      <heading>Reminder</heading>
      <body>Don't forget me this weekend!</body>
    </note>`;
    component.editType = 'inForm';
    component.fieldDefinitions = {
      'note.heading': { required: true }
    };
    component.ngAfterViewInit();
    fixture.detectChanges();

    component.formFields['note.heading'] = 'Updated Reminder';
    component.saveChanges();
    
    const expectedXml = `<note>
  <to>Tovess</to>
  <from>Jani</from>
  <heading>Updated Reminder</heading>
  <body>Don't forget me this weekend!</body>
</note>`;
    const validationResult = { 'note.heading': null };

    expect(component.onSave.emit).toHaveBeenCalledWith({
      xml: expectedXml,
      validationResult: jasmine.any(Object)
    });
  });

  it('should extract and capitalize field names correctly', () => {
    const fieldName = 'note.heading.label';
    const extractedName = component.extractFieldName(fieldName);
    expect(extractedName).toBe('Label');
  });

  // Add more tests as needed
});
