import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XmlBuddyComponent } from './xml-buddy.component';

describe('XmlBuddyComponent', () => {
  let component: XmlBuddyComponent;
  let fixture: ComponentFixture<XmlBuddyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [XmlBuddyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(XmlBuddyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
