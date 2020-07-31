import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Pit2Component } from './pit-2.component';

describe('Pit2Component', () => {
  let component: Pit2Component;
  let fixture: ComponentFixture<Pit2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Pit2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Pit2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
