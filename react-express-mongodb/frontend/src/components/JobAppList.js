import React from "react";
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'from',
    headerName: 'Do kogo',
    width: 150,
    editable: true,
  },
  {
    field: 'sendDate',
    headerName: 'Data wysłania',
    width: 150,
    editable: true,
  },
  {
    field: 'source',
    headerName: 'Źródło',
    width: 110,
    editable: true,
  },
  {
    field: 'desc',
    headerName: 'Uwagi',
    description: 'Uwagi odnośnie danej aplikacji.',
    editable: true,
    width: 160,
  },
];

export default class JobAppList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeIndex: 0,
    };
  }

  handleActive(index) {
    this.setState({
      activeIndex: index,
    });
  }

  renderJobApps(jobapps) {
    return (
      <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={jobapps.map((jobapp, i) => ({
          id: i,
          from: jobapp.text,
          sendDate: jobapp.whenApplied,
          source: jobapp.from,
          desc: jobapp.description
        }))}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
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
