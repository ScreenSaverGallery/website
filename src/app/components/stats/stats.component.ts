import { Component, OnInit } from '@angular/core';
// services
import { StatsService } from 'src/app/services/stats/stats.service';

@Component({
  selector: 'ssg-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {

  aliveUsers: number = 0;
  activeUsers: number = 0;

  constructor(
    private statsService: StatsService
  ){}

  ngOnInit(): void {
    this.statsService.stats.subscribe({
      next: (stats: any) => {
        if (stats.activeUsers && stats.aliveUsers) {
          //
          // stats.activeUsers *= 10;
          // stats.aliveUsers *= 10; 
          if (!this.aliveUsers && !this.activeUsers) {
            // count up
            const countUpAcU = setInterval(() => {
              this.activeUsers++;
              if (this.activeUsers === stats.activeUsers) clearInterval(countUpAcU);
            }, 1);
            const countUpAlU = setInterval(() => {
              this.aliveUsers++;
              if (this.aliveUsers === stats.aliveUsers) clearInterval(countUpAlU);
            }, 1);
            // for (let i = 0; i < stats.aliveUsers; i++) {
            //   this.aliveUsers++;
            // }
            // for (let i = 0; i < stats.activeUsers; i++) {
            //   this.activeUsers++;
            // }
          } else {
            this.aliveUsers = stats.aliveUsers;
            this.activeUsers = stats.activeUsers;
          }
        }
      },
      error: (e: any) => console.error(e)
    });
  }

}
