import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import whalesReducer from 'app/redux/whales';

export const rootReducer = combineReducers({
    router: routerReducer,

    whales: whalesReducer,
});
