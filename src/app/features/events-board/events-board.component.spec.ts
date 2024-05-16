import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsBoardComponent } from './events-board.component';

describe('EventsBoardComponent', () => {
  let component: EventsBoardComponent;
  let fixture: ComponentFixture<EventsBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventsBoardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EventsBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
