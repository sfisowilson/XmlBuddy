import { TestBed } from '@angular/core/testing';

import { XmlBuddyService } from './xml-buddy.service';

describe('XmlBuddyService', () => {
  let service: XmlBuddyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(XmlBuddyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
