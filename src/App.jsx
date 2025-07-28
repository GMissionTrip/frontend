import "./App.css";
import { Routes, Route } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { MainHomePage } from "./pages/MainHomePage";
import { OthersJourneyPage } from "./pages/OthersJourneyPage";
import { MyArchive } from "./pages/MyArchivePage";
import { MyArchiveDetails } from "./pages/MyArchiveDetailsPage";
import { InputTripInfo1 } from "./pages/InputTripInfo1";
import { InputTripInfo2 } from "./pages/InputTripInfo2";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/main" element={<MainHomePage />} />
      <Route path="/others-journeys" element={<OthersJourneyPage />} />
      <Route path="/my-archive" element={<MyArchive />} />
      <Route path="/my-archive/details/:id" element={<MyArchiveDetails />} />
      <Route path="/input-trip-info1" element={<InputTripInfo1 />} />
      <Route path="/input-trip-info2" element={<InputTripInfo2 />} />
    </Routes>
  );
}

export default App;
