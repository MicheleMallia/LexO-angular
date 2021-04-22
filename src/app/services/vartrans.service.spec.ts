import { TestBed } from '@angular/core/testing';

import { VartransService } from './vartrans.service';

describe('VartransService', () => {
  let service: VartransService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VartransService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
