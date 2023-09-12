import React from "react";

export default class JobAppList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeIndex: 0,
      activeColumn: 'from',
      ids: true
    };
  }

  handleActive(index) {
    this.setState({
      activeIndex: index,
    });
  }

  handleSearch(data, keyword) {
    this.setState({
      ids: data.map((jobapp, i) => ({
        id: i,
        from: jobapp.text,
        sendDate: jobapp.whenApplied,
        source: jobapp.from,
        desc: jobapp.description
      })).filter((item) => item[this.state.activeColumn].includes(keyword)).map(d => d['id']),
    });
  }

  handleColumn(col) {
    this.setState({
      activeColumn: col,
    });
  }

  renderJobApps(jobapps) {
    return (
      <>
      <fieldset>
      <legend>Wyszukiwarka po rekordach</legend>
      <div className="row g-2">
        <div className="col-md">
          <div className="input-group mb-3">
            <label className="input-group-text" htmlFor="search-category">Kolumna</label>
            <select id="search-category" className="form-select" onChange = {(event) => {this.handleColumn(event.target.value)}} defaultValue="from">
              <option value="from">Do kogo</option>
              <option value="sendDate">Data wysłania</option>
              <option value="source">Źródło</option>
              <option value="desc">Opis</option>
            </select>
          </div>
        </div>
        <div className="col-md">
          <div>
            <input id="searchId" name="search" className="form-control" placeholder="Szukaj..." type='text' onChange = {(event) => {this.handleSearch(jobapps, event.target.value)}}/>
          </div>
        </div>
      </div>
      </fieldset>
      <div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Do kogo</th>
            <th>Data wysłania</th>
            <th>Źródło</th>
            <th>Uwagi</th>
          </tr>
        </thead>
        <tbody>
        {jobapps.map((jobapp, i) => (
          <tr 
              className={
                (this.state.ids === true ? "" : (this.state.ids.includes(i) ? "" : "notActive"))
              }
              key={i}
          >
            <td>{i}</td>
            <td>{jobapp.text}</td>
            <td>{jobapp.whenApplied}</td>
            <td>{jobapp.from}</td>
            <td>{jobapp.description}</td>
          </tr>
        ))}
        </tbody>
      </table>
      </div>
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
