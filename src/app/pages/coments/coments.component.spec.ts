import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComentsComponent } from './coments.component';

describe('ComentsComponent', () => {
  let component: ComentsComponent;
  let fixture: ComponentFixture<ComentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComentsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
