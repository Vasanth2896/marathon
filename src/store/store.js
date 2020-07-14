import * as reducer from "./reducer";
import { createStore, compose, applyMiddleware } from "redux";
import { routerMiddleware } from "react-router-redux";
import { createBrowserHistory } from "history";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";
export const history = createBrowserHistory();
let middleware = [
    thunk,
    routerMiddleware(history)
];

middleware.push(createLogger());

const composedEnhancers = compose(
    applyMiddleware(...middleware)
);
export const store = createStore(reducer.allReducer, composedEnhancers);
