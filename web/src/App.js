import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import './App.css';
import SideBar from "./components/SideBar";
import Header from "./components/Header"

function App() {
  return (
    <div className="App">
      <Header />
      <div id="content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
