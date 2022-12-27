import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import LoadingButton from '@mui/lab/LoadingButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import Chip from '@mui/material/Chip';
import PhotoCameraFrontIcon from '@mui/icons-material/PhotoCameraFront';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import { DataGrid } from '@mui/x-data-grid';
import { getViolationInfos } from '../../api/violationAPI';
import './ViolationPage.css';


const UpdateIntervalSelect = ({updateInterval}) => {
  const [value, setValue] = React.useState(5);
  const handleChange = (event: SelectChangeEvent) => {
    setValue(event.target.value);
    updateInterval(event.target.value);
  };
  return (
    <FormControl className='select-container' size='small'>
      <InputLabel>Update Interval</InputLabel>
      <Select
        value={value}
        label="Update Interval"
        onChange={handleChange}
        
      >
        <MenuItem value={2}>2 seconds</MenuItem>
        <MenuItem value={5}>5 seconds</MenuItem>
        <MenuItem value={10}>10 seconds</MenuItem>
        <MenuItem value={30}>30 seconds</MenuItem>
        <MenuItem value={60}>1 minute</MenuItem>
        <MenuItem value={300}>5 minute</MenuItem>
      </Select>
    </FormControl>
  );
}

const violationInfosColumns = [
  { field: 'pilotId', headerName: 'Pilot ID', minWidth: 150, align: "center", headerAlign: "center" },
  { field: 'firstName', headerName: 'First name', minWidth: 100, align: "center", headerAlign: "center" },
  { field: 'lastName', headerName: 'Last name', minWidth: 100, align: "center", headerAlign: "center" },
  { field: 'phoneNumber', headerName: 'Phone Number', minWidth: 150, align: "center", headerAlign: "center" },
  { field: 'email', headerName: 'Email', minWidth: 250, align: "center", headerAlign: "center" },
  { field: 'closestDist', headerName: 'Closest Comfirmed Distance', type: 'number', minWidth: 200, align: "center", headerAlign: "center" },
  { field: 'snapshotTimestamp', headerName: 'Last Detected Time', minWidth: 400, align: "center", headerAlign: "center" },
];

const DataTable = ({rows, columns, rowsPerPageOptions}) => {
  const [pageSize, setPageSize] = React.useState(10);
  return (
    <DataGrid
      rows={rows}
      columns={columns}
      pageSize={pageSize}
      checkboxSelection
      getRowId={(row) => row.pilotId}
      onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
      rowsPerPageOptions={rowsPerPageOptions}
      pagination
      autoHeight
    />
  );
}

const ViolationPage = () => {
    const [violationInfos, setViolationInfos] = React.useState([]);
    const [interval, updateInterval] = React.useState(5);
    const [loading, setLoading] = React.useState(false);
    const ref = React.useRef(null)

    const fetchViolationInfos = () => {
      setLoading(true);
      setTimeout(async () => {
        let violationInfosRes = await getViolationInfos();
        let violationInfos = violationInfosRes.data;
        for(let violationInfo of violationInfos){
          const lastDetectedTime = new Date(violationInfo.snapshotTimestamp * 1000);
          violationInfo.snapshotTimestamp = lastDetectedTime;
        }
        setViolationInfos(violationInfos);
        setLoading(false);
      }, 500);
      
    }

    React.useEffect(() => {
      fetchViolationInfos();
      if(ref.current){
        clearInterval(ref.current)
      }
      ref.current = setInterval(fetchViolationInfos, interval * 1000);
      return () => {
        if(ref.current){
          clearInterval(ref.current)
        }
      }
    }, [interval]);



    return (
        
        <div className="page-container">
          <div className='header-container'>
            <div className='title-container'>
              <Toolbar variant="dense">
                <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 1 }} onClick={() => {window.open("https://assignments.reaktor.com/birdnest");}}>
                  <PhotoCameraFrontIcon />
                </IconButton>
                <Typography variant="h6" color="inherit" component="div">
                Pilots who recently violated the NDZ perimeter
                </Typography>
              </Toolbar>
            </div>
            <div className='update-container'>
              <div style={{marginRight: 10}}>
                <UpdateIntervalSelect
                updateInterval={updateInterval}
                />
              </div>
              <div>
                <LoadingButton
                  onClick={fetchViolationInfos}
                  loading={loading}
                  loadingPosition="start"
                  startIcon={<RefreshIcon />}
                  variant="contained"
                >
                  Update
                </LoadingButton>
              </div>
            </div>

          </div>
          <div className='table-container'>
            <DataTable 
            rows={violationInfos} 
            columns={violationInfosColumns}
            pageSize={10}
            rowsPerPageOptions={[10, 20, 50, 100]}
            />
          </div>
        </div>
        
    )
}

export default ViolationPage;