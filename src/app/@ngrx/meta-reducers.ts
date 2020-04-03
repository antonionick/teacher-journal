import { ActionReducer, MetaReducer } from '@ngrx/store';
import { environment } from '../../environments/environment';

function debug(reducer: ActionReducer<any>): ActionReducer<any> {
  return (state, action) => {
    console.log('metareducer', action);
    return reducer(state, action);
  };
}

export const metaReducers: Array<MetaReducer<any>> = environment.production ? [] : [debug];
