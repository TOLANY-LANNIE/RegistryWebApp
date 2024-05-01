import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendeesSubmissionComponent } from './attendees-submission.component';

describe('AttendeesSubmissionComponent', () => {
  let component: AttendeesSubmissionComponent;
  let fixture: ComponentFixture<AttendeesSubmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendeesSubmissionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AttendeesSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
