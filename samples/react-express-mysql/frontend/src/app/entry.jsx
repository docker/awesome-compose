import * as React from "react";
import { render, unmountComponentAtNode } from "react-dom"
import { AppContainer } from "react-hot-loader"
import { Provider } from 'react-redux';
import { ConnectedRouter } from "react-router-redux"
import { createBrowserHistory } from "history"

import { configureStore, sagaMiddleware } from "./store"
import { runApplicationSagas } from "./sagas"

const history = createBrowserHistory();
const store = configureStore(history);

const getAppContainer = () => document.getElementById('app-container');

const renderApp = () => {
    const App = require('./app').App;
    render(
        <AppContainer>
            <Provider store={store}>
                <ConnectedRouter history={history}>
                    <App/>
                </ConnectedRouter>
            </Provider>
        </AppContainer>
        , getAppContainer());
};

if (__DEV__ && module.hot) {
    const hotReloadApp = () => renderApp();
    module.hot.accept('./app', () => {
        // Preventing the hot reloading error from react-router
        unmountComponentAtNode(getAppContainer());
        hotReloadApp();
    })
}

// runApplicationSagas(sagaMiddleware);
renderApp();
