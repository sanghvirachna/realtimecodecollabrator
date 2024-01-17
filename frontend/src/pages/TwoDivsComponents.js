import React from 'react';
import './TwoDivsComponent.css';
import img from './images/finalb2.png';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
const TwoDivsComponent = () => {
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
            <h3>📈 Increased Productivity, Happy Coding.</h3>
            <img src="https://cdn-icons-png.flaticon.com/256/1457/1457898.png" alt="join"></img>
          </div>
        </div>

      </div>
      <div className='second-container'>
        <div className="grid-item-1">
          <div className="image-text-box">
            <img
              src={img}
              alt="Your Image"
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
          <p>Create new <span>Workspace ID</span></p>
          <TextField
            label="Enter Workspace Id"
            InputLabelProps={{ style: { color: 'white' } }}
            variant="outlined"
            className="input-field"
            sx={{ marginBottom: 2,color:'black', backgroundColor: 'transparent', borderRadius: '8px' }}
          />
         
          <TextField
            label="Enter your Username"
            InputLabelProps={{ style: { color: 'white' } }}
            variant="outlined"
            className="input-field"
            sx={{ marginBottom: 2, backgroundColor: 'transparent', borderRadius: '8px' }}
          />
          <Button
            variant="contained"
            color="primary"
            className="submit-button"
            sx={{ marginTop: 2, color: 'white', backgroundColor: 'blue', borderRadius: '8px' }}
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
