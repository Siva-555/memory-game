import { Route, Routes } from "react-router-dom";
import "./App.css";
import MemoryGamePage from "./Pages/MemoryGamePage";
import Header from "./Header/Header";

function App() {
  return (
    <div className="">
      <Header />
      <Routes>
        <Route path="/" element={<MemoryGamePage />} />
      </Routes>
    </div>
  );
}

export default App;
