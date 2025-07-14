// Fyrane/client/src/App.tsx

import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import HomePage from './pages/Home';
import CoreTest from './components/CoreStatus';
import Login from './pages/Login'


function App() {


  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/APIStatus" element={<CoreTest/>} />
        <Route path="/Login" element={<Login/>} />
      </Routes>
    </Router>
  );
}

export default App;