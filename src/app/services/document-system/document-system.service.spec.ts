import { TestBed } from '@angular/core/testing';

import { DocumentSystemService } from './document-system.service';

describe('DocumentSystemService', () => {
  let service: DocumentSystemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentSystemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
