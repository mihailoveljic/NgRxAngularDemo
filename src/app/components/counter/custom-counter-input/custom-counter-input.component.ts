import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { customIncrement, updateChannelName } from '../state/counter.actions';
import { getChannelName } from '../state/counter.selectors';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/store/app.state';

@Component({
  selector: 'app-custom-counter-input',
  templateUrl: './custom-counter-input.component.html',
  styleUrls: ['./custom-counter-input.component.css']
})
export class CustomCounterInputComponent implements OnInit {

  value : number = 0;
  channelName$: Observable<string> = new Observable();
  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.channelName$ = this.store.select(getChannelName);
  }
  onAdd(){
    this.store.dispatch(customIncrement({value: +this.value}));
  }
  updateChannelName(){
    this.store.dispatch(updateChannelName({value: 'Velja Web Dev kolorizovano'}));

  }
}
