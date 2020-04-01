import { TestBed } from '@angular/core/testing';

import { UsermanageService } from './usermanage.service';

describe('UsermanageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UsermanageService = TestBed.get(UsermanageService);
    expect(service).toBeTruthy();
  });
});
