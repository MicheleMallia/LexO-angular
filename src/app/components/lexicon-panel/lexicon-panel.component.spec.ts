import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LexiconPanelComponent } from './lexicon-panel.component';

describe('LexiconPanelComponent', () => {
  let component: LexiconPanelComponent;
  let fixture: ComponentFixture<LexiconPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LexiconPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LexiconPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
