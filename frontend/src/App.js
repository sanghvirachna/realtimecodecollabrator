import Workspace from './pages/Workspace';
import Home from './pages/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {Toaster} from 'react-hot-toast'


function App() {
  return (
    <>
      <Toaster/>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/workspace/:id" element={<Workspace />} />

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
