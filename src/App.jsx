import "./App.css";
import { Routes, Route } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { MainHomePage } from "./pages/MainHomePage";
import { OthersJourneyPage } from "./pages/OthersJourneyPage";
import MyArchive from "./pages/MyArchive";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/main" element={<MainHomePage />} />
      <Route path="/others-journeys" element={<OthersJourneyPage />} />

      <Route path="/my-archive" element={<MyArchive />} />
    </Routes>
  );
}

export default App;
