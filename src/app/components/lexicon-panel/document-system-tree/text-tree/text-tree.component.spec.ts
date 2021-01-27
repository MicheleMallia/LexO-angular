import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextTreeComponent } from './text-tree.component';

describe('TextTreeComponent', () => {
  let component: TextTreeComponent;
  let fixture: ComponentFixture<TextTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextTreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
