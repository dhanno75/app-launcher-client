import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Launcher from "./components/Launcher";
import Settings from "./components/Settings";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Launcher />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
  );
}

export default App;
