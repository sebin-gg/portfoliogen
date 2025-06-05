import { Routes, Route } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import InputPage from "./pages/InputPage";
import ResultPage from "./pages/ResultPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/form" element={<InputPage />} />
      <Route path="/result" element={<ResultPage />} />
    </Routes>
  );
}

export default App;
