import * as React from "react";
import { Route } from "react-router-dom";
import HomePage from './HomePage';

const route = <Route path="/" exact key="home" component={HomePage}/>;

export default route;
