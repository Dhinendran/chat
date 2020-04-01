import { TestBed } from '@angular/core/testing';

import { UserParametersService } from './user-parameters.service';

describe('UserParametersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserParametersService = TestBed.get(UserParametersService);
    expect(service).toBeTruthy();
  });
});
