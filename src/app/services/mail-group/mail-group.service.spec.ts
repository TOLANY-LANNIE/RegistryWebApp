import { TestBed } from '@angular/core/testing';

import { MailGroupService } from './mail-group.service';

describe('MailGroupService', () => {
  let service: MailGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MailGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
