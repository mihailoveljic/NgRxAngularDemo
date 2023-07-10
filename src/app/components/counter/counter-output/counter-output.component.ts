import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { getCounter } from '../state/counter.selectors';
import { AppState } from 'src/app/store/app.state';

@Component({
  selector: 'app-counter-output',
  templateUrl: './counter-output.component.html',
  styleUrls: ['./counter-output.component.css']
})
export class CounterOutputComponent {

  counter$: Observable<number> = new Observable();
  //counter: number = 0;
  //counter: number = 0;
  //counterSubscription: Subscription = new Subscription();
  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    // this.counterSubscription = this.store.select('counter').subscribe((data) =>{
    //   this.counter = data.counter;
    // });
    this.counter$ = this.store.select(getCounter);
  }
  // ngOnDestroy(): void {
  //     if(this.counterSubscription){
  //       this.counterSubscription.unsubscribe();
  //     }
  //   }
}
