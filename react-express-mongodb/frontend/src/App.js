import React from "react";
import axios from "axios";
import "./App.scss";
import AddJobApp from "./components/AddJobApp";
import JobAppList from "./components/JobAppList_v2";

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      jobapps: [],
    };
  }

  componentDidMount() {
    axios
      .get("/api")
      .then((response) => {
        this.setState({
          jobapps: response.data.data,
        });
      })
      .catch((e) => console.log("Error : ", e));
  }

  handleAddJobApp = (value, sendDate, source, desc) => {
    axios
      .post("/api/jobapps", { text: value, whenApplied: sendDate, from: source, description: desc })
      .then(() => {
        this.setState({
          jobapps: [...this.state.jobapps, { text: value, whenApplied: sendDate, from: source, description: desc }],
        });
      })
      .catch((e) => console.log("Error : ", e));
  };

  render() {
    return (
      <div className="App container">
        <div className="container-fluid">
          <div className="row">
            <div className="col-xs-12 col-sm-8 col-md-8 offset-md-2">
              <h1>JobApps</h1>
              <div className="jobapp-app">
                <AddJobApp handleAddJobApp={this.handleAddJobApp} />
                <JobAppList jobapps={this.state.jobapps} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
