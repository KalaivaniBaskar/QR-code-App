import { Routes, Route } from 'react-router-dom';
import './App.css';
import CreateQR from './Components/CreateQR';
import ScanQR from './Components/ScanQR';
import HeaderNav from './Components/HeaderNav';

function App() {
  return (
    <div className="App"> 
      <HeaderNav />
      <Routes>
          <Route path= '/' element={ <CreateQR />} ></Route>
          <Route path = '/scan' element ={ <ScanQR />}></Route>
      </Routes>
    </div>
  );
}

export default App;
