import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NameField from './components/NameField';
import GreetingPage from './pages/GreetingPage';
import FoodChooserPage from './pages/FoodChooserPage';
import ResultPage from './pages/ResultPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<NameField />} />
        <Route path="/greeting" element={<GreetingPage />} />
        <Route path="/food-chooser" element={<FoodChooserPage />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </Router>
  );
}

export default App;
