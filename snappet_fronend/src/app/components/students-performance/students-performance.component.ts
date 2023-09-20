import { Component, OnInit } from '@angular/core';
import { StudentPerformanceService } from '../../services/student-details.service';
import { StudentPerformance, User, UserDetailsResponse } from '../../interfaces/interfaces';
import { getColorByPerformance } from '../../utils/performance-utils';

@Component({
  selector: 'app-students-performance',
  templateUrl: './students-performance.component.html',
  styleUrls: ['./students-performance.component.scss']
})
export class StudentsPerformanceComponent implements OnInit {
  public loadError: boolean = false;
  public performanceRecords: StudentPerformance[] | undefined;
  public subjects: Array<string> = [];
  public students: User[] | undefined;
  public isLoading = true;

  constructor(private studentService: StudentPerformanceService) {
  }

  ngOnInit(): void {
    this.getStudentsPerformance();
  }

  getStudentsPerformance() {
    this.studentService.getPerformance().subscribe((response: StudentPerformance[]) => {
      this.performanceRecords = response;
      this.getSubjects();
      this.getUsers();
    },
      (error) => {
        this.stopSpinner();
        this.loadError = true;
      }
    );
  }

  getUsers() {
    this.studentService.getUserDetails().subscribe((response: User[]) => {
      this.students = response;
      this.performanceRecords?.map((record: StudentPerformance) => {
        record["UserName"] = this.getUserDetail(record.UserId)
      });
      this.stopSpinner();
    },
      (error) => {
        this.stopSpinner();
        this.loadError = true;
      }
    );
  }

  stopSpinner() {
    this.isLoading = false;
  }

  getUserDetail(userId: number) {
    let record = this.students?.filter((student) => student.UserId === userId)?.[0];
    return `${record?.FirstName} ${record?.LastName}`
  }

  getSubjects() {
    const uniqueSubjects = new Set<string>();
    if (this.performanceRecords) {
      for (const record of this.performanceRecords) {
        const workedSubjects = Object.keys(record.Performance);
        workedSubjects.forEach((subject) => uniqueSubjects.add(subject));
      }
      this.subjects = Array.from(uniqueSubjects);
    }
  }

  calculatePerformanceColor(performance: number): string {
    return getColorByPerformance(performance)
  }
}