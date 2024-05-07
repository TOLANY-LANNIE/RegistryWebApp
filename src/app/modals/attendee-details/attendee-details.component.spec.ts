import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendeeDetailsComponent } from './attendee-details.component';

describe('AttendeeDetailsComponent', () => {
  let component: AttendeeDetailsComponent;
  let fixture: ComponentFixture<AttendeeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendeeDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AttendeeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
