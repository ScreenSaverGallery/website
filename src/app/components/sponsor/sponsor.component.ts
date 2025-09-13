import { Component } from '@angular/core';
// forms
import { FormsModule, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
// components
import { ButtonComponent } from '../button/button.component';

enum Interval {
    monthly = 'month',
    onetime = 'oneTime',
    yearly = 'year'
}

interface Sponsor {
    interval: Interval,
    amount: number
}

@Component({
    selector: 'ssg-sponsor',
    templateUrl: './sponsor.component.html',
    styleUrl: './sponsor.component.scss',
    standalone: true,
    imports: [
    FormsModule,
    ButtonComponent,
    ReactiveFormsModule
]
})
export class SponsorComponent {

    amounts: number[] = [10, 50, 100, 250, 500];
    sponsor: Sponsor = {
        interval: Interval.monthly,
        amount: this.amounts[1]
    }

    setInterval(value: string): void {
        // reset to default amount if not in amounts (typically user set one-time custom)
        if (!this.amounts.includes(this.sponsor.amount)) {
            this.sponsor.amount = this.amounts[1];
        }
        switch (value) {
            case 'oneTime':
                this.sponsor.interval = Interval.onetime;
                break;
            case 'month':
                this.sponsor.interval = Interval.monthly;
                break;
            case 'year':
                this.sponsor.interval = Interval.yearly;
                if (this.sponsor.amount < 100) {
                    this.sponsor.amount = 250;
                }
                break;
            default:
                this.sponsor.interval = Interval.monthly;
        }
    }

    setAmount(amount: number): void {
        if (!amount) {
            this.sponsor.amount = this.amounts[1];
            return;
        }
        this.sponsor.amount = amount;
    }

    donate(): void {
        console.log('SPONSOR', this.sponsor);
        const url = 'https://opencollective.com/screensavergallery/donate?';
        window.open(`${url}interval=${this.sponsor.interval}&amount=${this.sponsor.amount}`);
        // https://opencollective.com/screensavergallery/donate?interval=monthly&amount=250
    }

    readibleInterval(interval: string): string {
        switch (interval) {
            case 'oneTime':
                return '';
            case 'month':
                return 'Monthly';
            case 'year':
                return 'Yearly';
            default:
                return '';          
        }
    }
}
