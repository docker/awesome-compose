import { routerMiddleware } from 'react-router-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from "redux-saga";
import { rootReducer } from "./reducers";

export const sagaMiddleware = createSagaMiddleware();

export const configureStore = (history, initialState = {}) => {

    const middlewares = [
        routerMiddleware(history),
        sagaMiddleware
    ];

    const enhancers = [
        applyMiddleware(...middlewares),
    ];

    if(__DEV__) {
        const devToolEnhancer = () => {
            return typeof window === 'object' && typeof window.devToolsExtension !== 'undefined'
                ? window.devToolsExtension() : f => f;
        };
        enhancers.push(devToolEnhancer())
    }

    const store = createStore(rootReducer, initialState, compose(...enhancers));

    if(__DEV__ && module.hot) {
        module.hot.accept('./reducers', () => {
            const nextReducer = require('./reducers').default;
            store.replaceReducer(nextReducer);
        })
    }

    return store;
};
