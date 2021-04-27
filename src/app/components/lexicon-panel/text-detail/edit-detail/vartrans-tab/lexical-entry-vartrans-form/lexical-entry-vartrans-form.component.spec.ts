import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LexicalEntryVartransFormComponent } from './lexical-entry-vartrans-form.component';

describe('LexicalEntryVartransFormComponent', () => {
  let component: LexicalEntryVartransFormComponent;
  let fixture: ComponentFixture<LexicalEntryVartransFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LexicalEntryVartransFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LexicalEntryVartransFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
