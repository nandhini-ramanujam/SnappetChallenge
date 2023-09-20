import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StudentPerformanceService } from './student-details.service';
import { environment } from 'src/environments/environment';
import { PerformanceResponse, StudentPerformance, User, UserDetailsResponse } from '../interfaces/interfaces';
import { Observable, of } from 'rxjs';

describe('StudentPerformanceService', () => {
  let service: StudentPerformanceService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [StudentPerformanceService],
    });
    service = TestBed.inject(StudentPerformanceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve performance data from the API', () => {
    const mockPerformanceData =
    {
      "statusCode": 200,
      "body": {
        "StudentsPerformance": [
          {
            "Performance": {
              "Rekenen": 106.11387620000002,
              "Spelling": 76.08484216000002
            },
            "UserId": 40268,
            "SubmittedDate": "2015-03-24",
            "GroupId": 123
          },
          {
            "Performance": {
              "Rekenen": 160.2829974,
              "Spelling": 78.34190292
            },
            "UserId": 40277,
            "SubmittedDate": "2015-03-24",
            "GroupId": 123
          },
        ]
      }
    }

    spyOn(service['http'], 'get').and.returnValue(
      of(mockPerformanceData)
    );
    service.getPerformance().subscribe((data) => {
      expect(data).toEqual(mockPerformanceData?.body?.StudentsPerformance);
    });
  });

  it('should retrieve user details from the API', () => {
    const mockUserDetails = {
      "statusCode": 200,
      "body": {
        "Students": [
          {
            "UserId": 40268,
            "Gender": "female",
            "FirstName": "Roberta",
            "LastName": "Breitenberg",
            "GroupId": 123,
            "Age": 11
          },
          {
            "UserId": 40277,
            "Gender": "female",
            "FirstName": "Lindsay",
            "LastName": "Kerluke",
            "GroupId": 123,
            "Age": 11
          }]
      }
    }
    spyOn(service['http'], 'get').and.returnValue(
      of(mockUserDetails)
    );
    service.getUserDetails().subscribe((data) => {
      expect(data).toEqual(mockUserDetails?.body?.Students);
    });
  });
});
