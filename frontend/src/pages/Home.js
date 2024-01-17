// import React, { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { v4 as uuidv4 } from 'uuid'
// import  toast  from 'react-hot-toast'
// const Home = () => {
//     const navigate = useNavigate()
//     const [workspaceId, setWorkspaceId] = useState('')
//     const [username, setUsername] = useState('')
//     const generateWorkspaceId = () => {
//         const id = uuidv4()
//         setWorkspaceId(id)
//         toast.success('Workspace id generated', {
//             position: "top-center"
//           })
//      }
//     const joinWorkspace = (e) => {
//         e.preventDefault()
//         if (workspaceId === '' || username === '') {
//             toast.error('Please enter workspace id and username', {
//                 position: "top-center"
//               })
//         } else {
//             navigate(`/workspace/${workspaceId}`,{
//                 state:{
//                     username
//                 }
//             })
//             // toast.success(`${username} joined workspace`, {
//             //     position: "top-center"
//             //   })  

//         }
//     }


//     return (
//         <form onSubmit={joinWorkspace}>
//             <div>
//             <input type="text" placeholder='Enter your workspace id' value={workspaceId} onChange={(e) => setWorkspaceId(e.target.value)} />
//             <input type="text" placeholder='Enter your username' value={username} onChange={(e) => setUsername(e.target.value)} />
//             <button type='submit'>Join </button>
//             <p>Create new workspace by  generating <b onClick={generateWorkspaceId} > new id</b></p>
//         </div>
//         </form>
//     )
// }

// export default Home
import React from "react";
import "./Home.css";

const Home = () => {
  return (
    <div>
      <div className="content">
        <div className="logo">CollabCode</div>
        <h1 className="title">
        Code.Collab.Compile.
          <div className="aurora">
            <div className="aurora__item"></div>
            <div className="aurora__item"></div>
            <div className="aurora__item"></div>
            <div className="aurora__item"></div>
          </div>
        </h1>
      </div>
      <div>
      <h2 className="about ">Code as one, no matter where you are.</h2>
      </div>
      
    </div>
  );
};

export default Home;




