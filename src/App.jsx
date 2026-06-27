import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/global.css';

import Dashboard   from './pages/Dashboard';
import UserDetails from './pages/UserDetails';
import NotFound    from './pages/NotFound';
import { TOAST_OPTIONS } from './utils/constants';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer {...TOAST_OPTIONS} />
      <Routes>
        <Route path="/"          element={<Dashboard />}   />
        <Route path="/users/:id" element={<UserDetails />} />
        <Route path="*"          element={<NotFound />}    />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
