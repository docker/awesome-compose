import * as React from "react"
import { Switch } from "react-router-dom"
import { renderRoutes } from "./routes"

import { ApplicationContainer } from "app/components/layout"

require("./core/styles/reset.css");
require("./core/styles/normalize.scss");
//require("./core/styles/main.scss");

export class App extends React.Component {
    render() {
        return (
            <ApplicationContainer>
                <Switch>
                    {renderRoutes()}
                </Switch>
            </ApplicationContainer>
        )
    }
}

