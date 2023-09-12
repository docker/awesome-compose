import React from "react";

export default class JobAppList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeIndex: 0,
      activeColumn: 'text',
      ids: true
    };
  }

  handleActive(index) {
    this.setState({
      activeIndex: index,
    });
  }

  handleSearch(data, keyword) {
    console.log(keyword);
    this.setState({
      ids: data.map((jobapp, i) => ({
        id: i,
        from: jobapp.text,
        sendDate: jobapp.whenApplied,
        source: jobapp.from,
        desc: jobapp.description
      })).filter((item) => item[this.state.activeColumn].includes(keyword)).map(d => d['id']),
    });
    console.log(this.state.ids);
  }

  handleColumn(col) {
    this.setState({
      activeColumn: col,
    });
  }

  renderJobApps(jobapps) {
    return (
      <>
      <label htmlFor="searchId">Szukaj:</label>
      <input id="searchId" name="search" type='text' onChange = {(event) => {this.handleSearch(jobapps, event.target.value)}}/>
      <select onChange = {(event) => {this.handleColumn(event.target.value)}}>
        <option value="from">Do kogo</option>
        <option value="sendDate">Data wysłania</option>
        <option value="source">Źródło</option>
        <option value="desc">Opis</option>
      </select>
      <ul className="list-group">
        {jobapps.map((jobapp, i) => (
          <li
            className={
              "list-group-item cursor-pointer " +
              (this.state.ids === true ? "" : (this.state.ids.includes(i) ? "" : "notActive"))
            }
            key={i}
            onClick={() => {
              this.handleActive(i);
            }}
          >
            {jobapp.text} {jobapp.whenApplied} {jobapp.from} {jobapp.description}
          </li>
        ))}
      </ul>
      </>
    );
  }

  render() {
    let { jobapps } = this.props;
    return jobapps.length > 0 ? (
      this.renderJobApps(jobapps)
    ) : (
      <div className="alert alert-primary" role="alert">
        No Job Applications to display
      </div>
    );
  }
}
