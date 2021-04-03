import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BibliographyPanelComponent } from './bibliography-panel.component';

describe('BibliographyPanelComponent', () => {
  let component: BibliographyPanelComponent;
  let fixture: ComponentFixture<BibliographyPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BibliographyPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BibliographyPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
