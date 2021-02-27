import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LemmaInputComponent } from './lemma-input.component';

describe('LemmaInputComponent', () => {
  let component: LemmaInputComponent;
  let fixture: ComponentFixture<LemmaInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LemmaInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LemmaInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
