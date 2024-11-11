// src/App.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import ChangePassword from './pages/ChangePassword';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import PatientRegister from './pages/PatientRegister';
import PatientRecordForm from './pages/PatientRecordForm';
import SearchPatient from './pages/SearchPatient';
import PatientDataForm from './pages/PatientDataForm';
import PatientRecordHistory from './pages/PatientRecordHistory';
import PatientGraphs from './pages/PatientGraphs';
import QRReaderPage from './pages/ScanQr';
import ProtectedRoute from './pages/ProtectedRoute';
import Layout from './components/Layout';


function App() {
    return (
        <Router>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} /> {/* ruta de registro temporalmente para facilitar la creación del admin */}
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/reset-password/:token" element={<ChangePassword />} />
                {/*RUtas protegidas */}
                <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
                <Route path="/register-patient" element={<ProtectedRoute><Layout><PatientRegister/></Layout></ProtectedRoute>} />
                <Route path="/qr-reader" element={<ProtectedRoute><Layout><QRReaderPage /></Layout></ProtectedRoute>} />
                {/* <Route path='/patient/:idPaciente/add-record' element={<PatientRecordForm />} /> */}
                <Route path="/patient/:idPaciente/add-record" element={<ProtectedRoute><Layout><PatientDataForm /></Layout></ProtectedRoute>} />
                <Route path="/patient/:idPaciente/records" element={<ProtectedRoute><Layout><PatientRecordHistory /></Layout></ProtectedRoute>} />
                <Route path="/patient/:idPaciente/graphs" element={<ProtectedRoute><Layout><PatientGraphs /></Layout></ProtectedRoute>} />
                <Route path="/search-patient" element={<ProtectedRoute><Layout><SearchPatient /></Layout></ProtectedRoute>} />
                <Route path="/admin-panel" element={<ProtectedRoute><Layout><AdminPanel /></Layout></ProtectedRoute>} />

                {/* Default route */}
                <Route path="*" element={<h1>404 Page Not Found</h1>} />

            </Routes>
        </Router>
    );
}

export default App;
