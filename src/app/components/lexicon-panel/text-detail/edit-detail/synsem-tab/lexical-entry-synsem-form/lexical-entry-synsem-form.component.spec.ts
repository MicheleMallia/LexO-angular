import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LexicalEntrySynsemFormComponent } from './lexical-entry-synsem-form.component';

describe('LexicalEntrySynsemFormComponent', () => {
  let component: LexicalEntrySynsemFormComponent;
  let fixture: ComponentFixture<LexicalEntrySynsemFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LexicalEntrySynsemFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LexicalEntrySynsemFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
