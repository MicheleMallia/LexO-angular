import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LexicalConceptFormComponent } from './lexical-concept-form.component';

describe('LexicalConceptFormComponent', () => {
  let component: LexicalConceptFormComponent;
  let fixture: ComponentFixture<LexicalConceptFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LexicalConceptFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LexicalConceptFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
