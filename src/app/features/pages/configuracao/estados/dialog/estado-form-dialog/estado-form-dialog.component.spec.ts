import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoFormDialogComponent } from './estado-form-dialog.component';

describe('EstadoFormDialogComponent', () => {
  let component: EstadoFormDialogComponent;
  let fixture: ComponentFixture<EstadoFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstadoFormDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstadoFormDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
