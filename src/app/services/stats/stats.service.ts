import { Injectable } from '@angular/core';
// http 
import { HttpClient } from '@angular/common/http';
// rxjs
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  private STATS_URL: string = 'https://datatata.info/ssg/stats';
  private getStatsEvery: number = 1000 * 60; // 1m

  stats: BehaviorSubject<any> = new BehaviorSubject({});


  constructor(
    private http: HttpClient
  ) {
    this.startStats();
  }

  private startStats(): void {
    this.getStats(); // 
    setInterval(() => this.getStats(), this.getStatsEvery);
  }

  private getStats(): void {
    this.http.get(this.STATS_URL).subscribe({
      next: (stats: any) => this.stats.next(stats),
      error: (e: any) => console.error(e)
    });
  }

}
