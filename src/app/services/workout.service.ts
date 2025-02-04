import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Workout } from '../models/workout.model';

@Injectable({ providedIn: 'root' })
export class WorkoutService {
  private workoutsSubject = new BehaviorSubject<Workout[]>(this.getStoredWorkouts());
  workouts$ = this.workoutsSubject.asObservable();

  private getStoredWorkouts(): Workout[] {
    return JSON.parse(localStorage.getItem('workouts') || '[]');
  }

  addWorkout(workout: Workout) {
    const updatedWorkouts = [...this.workoutsSubject.value, workout];
    localStorage.setItem('workouts', JSON.stringify(updatedWorkouts));
    this.workoutsSubject.next(updatedWorkouts);
  }
}
