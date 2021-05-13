import { TestBed } from '@angular/core/testing';

import { LexicalEntriesService } from './lexical-entries.service';

describe('LexicalEntriesService', () => {
  let service: LexicalEntriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LexicalEntriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
