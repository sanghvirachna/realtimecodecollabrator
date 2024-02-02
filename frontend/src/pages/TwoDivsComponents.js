import React, { useState } from 'react';
import './TwoDivsComponent.css';
import img from './images/finalb2.png';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import toast from 'react-hot-toast'
import { makeStyles } from '@material-ui/core/styles';



const TwoDivsComponent = () => {
  const navigate = useNavigate()
  const [workspaceId, setWorkspaceId] = useState('')
  const [username, setUsername] = useState('')
  const generateWorkspaceId = () => {
    const id = uuidv4()
    setWorkspaceId(id)
    toast.success('Workspace id generated', {
      position: "top-center"
    })
  }
  const joinWorkspace = (e) => {
    e.preventDefault()
    if (workspaceId === '' || username === '') {
      toast.error('Please enter workspace id and username', {
        position: "top-center"
      })
    } else {
      navigate(`/workspace/${workspaceId}`, {
        state: {
          workspaceId,
          username,
        }
      })
    }
  }
  const useStyles = makeStyles({
    root: {
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: 'white', // Change this to your desired color
        },
        '&:hover fieldset': {
          borderColor: 'white', // Change this to your desired color
        },
        '&.Mui-focused fieldset': {
          borderColor: 'white', // Change this to your desired color
        },
      },
    },
  });
  const classes = useStyles();

  return (
    <div className="main-container">
      <div className='grid-item-3'>
        <h1>How it Works ?</h1>
        <div className='work-container'>
          <div className="work">
            <h3>👥 Join a thriving code community.</h3>
            <img src="https://cdn-icons-png.flaticon.com/256/5836/5836191.png" alt="join"></img>
          </div>
          <div className='work'>
            <h3>🎨 Craft your code and share the vision.</h3>
            <img src="https://cdn-icons-png.flaticon.com/256/3242/3242120.png" alt="join"></img>
          </div>
          <div className="work">
            <h3>🤝 Collaborate with fellow creators.</h3>
            <img src="https://cdn-icons-png.flaticon.com/256/10841/10841416.png" alt="join"></img>
          </div>
          <div className='work'>
            <h3>🚀 Execute your masterpiece.</h3>
            <img src="https://cdn-icons-png.flaticon.com/256/5958/5958810.png" alt="join"></img>
          </div>
          <div className='work'>
            <h3>📈 Boost your Efficiency</h3>
            <img src="https://cdn-icons-png.flaticon.com/256/1457/1457898.png" alt="join"></img>
          </div>
        </div>

      </div>
      <div className='second-container'>
        <div className="grid-item-1">
          <div className="image-text-box">
            <img
              src={img}
              alt="A person coding"
              className="main-image"
            />
            <h3>
              Instant execution, seamless teamwork.
            </h3>
            <h3>
              Elevate your coding experience with us.
            </h3>
          </div>
        </div>
        {/* Second div */}
        <div className="grid-item-2">
          <h3>Get started by joining Workspace</h3>
          <div className='input-box'>
            <p>Create new <span onClick={generateWorkspaceId}>Workspace ID</span></p>
            <TextField
              label="Enter Workspace Id"
              InputLabelProps={{ style: { color: 'white', fontWeight: 'medium', fontFamily: 'Poppins' } }}
              InputProps={{ style: { color: 'white', fontWeight: 'medium', fontFamily: 'Poppins' } }}
              variant="outlined"
              className={`${classes.root} input-field`}
              sx={{ marginBottom: 2, color: 'black', backgroundColor: 'transparent', borderRadius: '8px' }}
              value={workspaceId} onChange={(e) => setWorkspaceId(e.target.value)}
            />

            <TextField
              label="Enter your Username"
              InputLabelProps={{ style: { color: 'white', fontWeight: 'medium', fontFamily: 'Poppins' } }}
              InputProps={{ style: { color: 'white', fontWeight: 'medium', fontFamily: 'Poppins' } }}
              variant="outlined"
              className={`${classes.root} input-field`}
              sx={{ marginBottom: 2, backgroundColor: 'transparent', borderRadius: '8px' }}
              value={username} onChange={(e) => setUsername(e.target.value)}
            />
            <a style={{ textAlign: 'center', textDecoration: 'underline', cursor: 'pointer' }} href="https://github.com/sanghvirachna/realtimecodecollabrator/blob/main/README.md" target='_blank' rel="noreferrer">Learn more about it</a>
            <Button
              variant="contained"
              color="primary"
              className="submit-button"
              sx={{ marginTop: 2, color: 'white', backgroundColor: 'blue', borderRadius: '8px', fontWeight: 'bold' }}
              onClick={joinWorkspace}
            >
              Join Workspace
            </Button>


          </div>
        </div>
      </div>

    </div>
  );
};

export default TwoDivsComponent;
