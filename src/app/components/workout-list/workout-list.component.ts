import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { WorkoutService } from '../../services/workout.service';
import { Workout } from '../../models/workout.model';
@Component({
  standalone: true,
  selector: 'app-workout-list',
  templateUrl: './workout-list.component.html',
  styleUrls: ['./workout-list.component.css'],
  imports: [CommonModule, FormsModule],
})
export class WorkoutListComponent implements OnInit {
  workouts$!: Observable<Workout[]>;
  searchQuery = '';
  filterType = '';
  newWorkout: Workout = { id: 0, userName: '', workoutType: '', duration: 0 };
  currentPage = 1;
  itemsPerPage = 5; // Default value
  totalPages = 0;
  allWorkouts: Workout[] = [];

  constructor(private workoutService: WorkoutService) {}

  ngOnInit() {
    this.workouts$ = this.workoutService.workouts$;
    this.workouts$.subscribe(data => {
      this.allWorkouts = data;
      this.calculateTotalPages();
    });
  }

  addWorkout() {
    if (!this.newWorkout.userName || !this.newWorkout.workoutType || this.newWorkout.duration <= 0) {
      alert('Please fill out all fields correctly.');
      return;
    }

    const workoutToAdd: Workout = {
      ...this.newWorkout,
      id: Date.now(),
    };

    this.workoutService.addWorkout(workoutToAdd);
    this.newWorkout = { id: 0, userName: '', workoutType: '', duration: 0 };
    this.workouts$.subscribe(data => {
      this.allWorkouts = data;
      this.calculateTotalPages();
    });
  }

  // Helper method to count the number of workouts for a specific user
  getWorkoutCountForUser(userName: string): number {
    return this.allWorkouts.filter(workout => workout.userName === userName).length;
  }

  filteredWorkouts(): Workout[] {
    let filtered = this.allWorkouts.filter(workout =>
      workout.userName.toLowerCase().includes(this.searchQuery.toLowerCase()) &&
      (this.filterType ? workout.workoutType === this.filterType : true)
    );
    this.calculateTotalPages(filtered.length);
    return filtered.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage);
  }

  calculateTotalPages(filteredCount?: number) {
    this.totalPages = Math.ceil((filteredCount ?? this.allWorkouts.length) / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  changeItemsPerPage(event: any) {
    this.itemsPerPage = +event.target.value;
    this.currentPage = 1; // Reset to first page
    this.calculateTotalPages();
  }
}
