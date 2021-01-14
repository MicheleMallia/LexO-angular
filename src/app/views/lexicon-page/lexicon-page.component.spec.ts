import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LexiconPageComponent } from './lexicon-page.component';

describe('LexiconPageComponent', () => {
  let component: LexiconPageComponent;
  let fixture: ComponentFixture<LexiconPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LexiconPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LexiconPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
