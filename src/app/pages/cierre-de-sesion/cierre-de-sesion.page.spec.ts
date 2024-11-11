import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CierreDeSesionPage } from './cierre-de-sesion.page';

describe('CierreDeSesionPage', () => {
  let component: CierreDeSesionPage;
  let fixture: ComponentFixture<CierreDeSesionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CierreDeSesionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
