import "./App.css";
import { Routes, Route } from "react-router-dom";
import { LandingPage } from "./pages/Landing";
import { LoginPage } from "./pages/Login";
import { OthersJourneyPage } from "./pages/OthersJourney";
import { MyArchive } from "./pages/MyArchive/MyArchivePage";
import { MyArchiveDetails } from "./pages/MyArchive/MyArchiveDetailsPage";
import { InputTripInfo1 } from "./pages/InputTripInfo/InputTripInfo1";
import { InputTripInfo2 } from "./pages/InputTripInfo/InputTripInfo2";
import { MyPage } from "./pages/MyPage/MyPage";
import Notification from "./pages/Notification";
import { MainHomePage } from "./pages/Main";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/main" element={<MainHomePage />} />
      <Route path="/others-journeys" element={<OthersJourneyPage />} />
      <Route path="/my-archive" element={<MyArchive />} />
      <Route path="/my-archive/details/:id" element={<MyArchiveDetails />} />
      <Route path="/my-page" element={<MyPage />} />
      <Route path="/input-trip-info1" element={<InputTripInfo1 />} />
      <Route path="/input-trip-info2" element={<InputTripInfo2 />} />
      <Route path="/notification" element={<Notification />} />
    </Routes>
  );
}

export default App;
