import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JefePage } from './jefe.page';

describe('JefePage', () => {
  let component: JefePage;
  let fixture: ComponentFixture<JefePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(JefePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
