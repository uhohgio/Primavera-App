import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import PropertyDetail from './PropertyDetail';

function Main() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/property/:id" element={<PropertyDetail />} />
      </Routes>
    </Router>
  );
}

export default Main;
