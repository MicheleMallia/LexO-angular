import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LexicalEntryDecompFormComponent } from './lexical-entry-decomp-form.component';

describe('LexicalEntryDecompFormComponent', () => {
  let component: LexicalEntryDecompFormComponent;
  let fixture: ComponentFixture<LexicalEntryDecompFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LexicalEntryDecompFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LexicalEntryDecompFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
