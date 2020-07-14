import { combineReducers } from "redux";
import { AppReducer } from './appActions'
export const allReducer = combineReducers({
    appReducer: AppReducer,
});
