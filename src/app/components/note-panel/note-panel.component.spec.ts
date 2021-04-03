import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetadataPanelComponent } from './note-panel.component';

describe('MetadataPanelComponent', () => {
  let component: MetadataPanelComponent;
  let fixture: ComponentFixture<MetadataPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MetadataPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MetadataPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
