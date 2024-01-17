import Workspace from './pages/Workspace';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {Toaster} from 'react-hot-toast'
import Main from './pages/Main';


function App() {
  return (
    <>
      <Toaster/>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/workspace/:id" element={<Workspace />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
