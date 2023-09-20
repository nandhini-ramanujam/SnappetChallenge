import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { StudentsPerformanceComponent } from './students-performance.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StudentPerformanceService } from '../../services/student-details.service';
import { LoaderComponent } from '../loader/loader.component';
import { of, throwError } from 'rxjs';
import { User } from '../../interfaces/interfaces';

describe('StudentsPerformanceComponent', () => {
  let component: StudentsPerformanceComponent;
  let fixture: ComponentFixture<StudentsPerformanceComponent>;
  let studentPerformanceService: StudentPerformanceService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [StudentsPerformanceComponent, LoaderComponent],
      providers: [StudentPerformanceService],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentsPerformanceComponent);
    component = fixture.componentInstance;
    studentPerformanceService = TestBed.inject(StudentPerformanceService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get performance and students details', () => {
    spyOn(studentPerformanceService, 'getPerformance').and.returnValue(of(mockPerformanceData));
    spyOn(studentPerformanceService, 'getUserDetails').and.returnValue(of(mockStudentsDetails));
    component.ngOnInit();
    expect(component.performanceRecords).toEqual(mockPerformanceData);
    expect(component.subjects).toEqual(['Rekenen', 'Spelling']);
    expect(component.students).toEqual(mockStudentsDetails);
    expect(component.isLoading).toBeFalse();
  });

  it('should gracefully handle errors', () => {
    spyOn(studentPerformanceService, 'getPerformance').and.returnValue(throwError({ status: 500 }));
    spyOn(studentPerformanceService, 'getUserDetails').and.returnValue(throwError({ status: 502 }));
    component.getStudentsPerformance();
    expect(component.loadError).toBeTrue();
    expect(component.isLoading).toBeFalse();
  });

  // #TODO move to fixtured
  const mockStudentsDetails: User[] = [
    {
      "UserId": 40268,
      "FirstName": "Roberta",
      "LastName": "Breitenberg",
    },
    {
      "UserId": 40277,
      "FirstName": "Lindsay",
      "LastName": "Kerluke",
    }
  ]

  const mockPerformanceData = [
    {
      "Performance": {
        "Rekenen": 99.11,
        "Spelling": 76.08
      },
      "UserId": 40268,
      "SubmittedDate": "2015-03-24",
      "LastUpdatedAt": "1695087411891",
      "GroupId": 123
    },
    {
      "Performance": {
        "Rekenen": 60.28,
        "Spelling": 78.34
      },
      "UserId": 40277,
      "SubmittedDate": "2015-03-24",
      "LastUpdatedAt": "1695087414749",
      "GroupId": 123
    }
  ]

});