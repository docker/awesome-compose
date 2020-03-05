import * as React from "react";
import { connect } from "react-redux";

require("./home.scss");

const mapStateToProps = (state, props) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

class HomePage extends React.Component {

    render() {
        return (
            <div className="home-page page">
                <h1>My New React App</h1>
            </div>
        )
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage)
