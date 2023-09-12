import React from "react";

export default class JobApp extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    const { value, sendDate, source, sources, desc } = e.target.elements;
    this.props.handleAddJobApp(value.value, sendDate.value, source.value, desc.value);
    e.target.reset();
  };

  render() {
    return (
      <form
        noValidate
        onSubmit={this.handleSubmit}
        className="new-jobapp form-group"
        style={{ display: 'grid', gridAutoColumns: 'max-content', gridAutoRows: 'auto', justifyContent: 'center' }}
      >
        <label htmlFor="value-id" className="form-label">Do kogo:</label>
        <input
          type="text"
          name="value"
          id="value-id"
          required
          minLength={1}
          className="form-control"
        />
        <label htmlFor="send-date" className="form-label">Data wysłania:</label>
        <input type="date" name="sendDate" id="send-date" />
        <label htmlFor="source-id" className="form-label">Źródło:</label>
        <input
          list="sources"
          type="text"
          name="source"
          id="source-id"
          required
          minLength={1}
          className="form-control"
        />
        <datalist id="sources">
          <option value="Pracuj.pl" />
          <option value="Praca.pl" />
          <option value="NoFluffJobs.com" />
          <option value="Linkedin" />
          <option value="TeamQuest" />
          <option value="Olx.pl" />
        </datalist>
        <label htmlFor="desc-id" className="form-label">Opis:</label>
        <textarea name="desc" id="desc-id" rows="4" cols="50"></textarea>
        <button className="btn btn-primary" type="submit" style={{ marginLeft: 'auto', marginTop: '3px', marginBottom: '3px' }}>
          Dodaj aplikacje do pracy
        </button>
      </form>
    );
  }
}
