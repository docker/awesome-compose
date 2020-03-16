import * as React from "react";

export default class ApplicationContainer extends React.Component {

    render() {
        return (
            <div className="main-container">
                <div className="main-content">
                    {this.props.children}
                </div>
            </div>
        );
    }

}
