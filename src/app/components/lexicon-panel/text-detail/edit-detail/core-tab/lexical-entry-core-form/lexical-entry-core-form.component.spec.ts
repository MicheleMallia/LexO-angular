import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LexicalEntryCoreFormComponent } from './lexical-entry-core-form.component';

describe('CoreFormComponent', () => {
  let component: LexicalEntryCoreFormComponent;
  let fixture: ComponentFixture<LexicalEntryCoreFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LexicalEntryCoreFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LexicalEntryCoreFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
