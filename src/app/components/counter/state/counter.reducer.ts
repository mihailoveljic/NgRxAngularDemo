import { Action, createReducer, on } from "@ngrx/store";
import { CounterState, initialState } from "./counter.state";
import { customIncrement, decrement, increment, reset, updateChannelName } from "./counter.actions";

const _counterReducer = createReducer(initialState, on(increment, (state)=>{
  return {
    ...state,
    counter: state.counter + 1
  }
}), on(decrement, (state)=>{
  return {
    ...state,
    counter: state.counter - 1
  }
}), on(reset, (state)=>{
  return {
    ...state,
    counter: 0
  }
}), on(customIncrement,(state, action:any)=>{
  return {
    ...state,
    counter: state.counter + action.value
  }
}), on(updateChannelName,(state, action:any)=>{
  return {
    ...state,
    channelName: action.value
  }
}),
)

export function counterReducer(state:CounterState|undefined, action:Action) {
  return _counterReducer(state, action);
}
