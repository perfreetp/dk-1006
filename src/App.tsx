import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProjectList from '@/pages/ProjectList';
import Requirements from '@/pages/Requirements';
import Planning from '@/pages/Planning';
import Risk from '@/pages/Risk';
import Field from '@/pages/Field';
import Delivery from '@/pages/Delivery';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProjectList />} />
        <Route path="/projects/:id/requirements" element={<Requirements />} />
        <Route path="/projects/:id/planning" element={<Planning />} />
        <Route path="/projects/:id/risk" element={<Risk />} />
        <Route path="/projects/:id/field" element={<Field />} />
        <Route path="/projects/:id/delivery" element={<Delivery />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
