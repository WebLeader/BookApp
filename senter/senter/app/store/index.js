import { createStore } from 'redux';
import AppMainReducer from '../scenes/AppMain/Reducer';

const initValues = {
    'AppMain': {}
}

const AppMainStore = createStore(AppMainReducer, initValues.AppMain);
