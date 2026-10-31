// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { useContext } from 'react';
// import { AuthProvider, AuthContext } from './context/AuthContext';
// import Navbar from './components/Navbar';
// import Home from './pages/Home';
// import Login from './pages/Login';
// import Register from './pages/Register';
//  import ForgotPassword from './pages/ForgotPassword';
// import VerifyOTP from './pages/VerifyOTP';
// import ResetPassword from './pages/ResetPassword';
// import GoogleCallback from './pages/GoogleCallback';
// import Campaigns from './pages/Campaigns';
// import DonateForm from './pages/DonateForm';
// import UserDashboard from './pages/UserDashboard';
// import AdminDashboard from './pages/AdminDashboard';

// // Protected Route Component
// const ProtectedRoute = ({ children, adminOnly = false }) => {
//   const { user, loading, isAdmin } = useContext(AuthContext);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-xl text-gray-600">Loading...</div>
//       </div>
//     );
//   }

//   if (!user) {
//     return <Navigate to="/login" />;
//   }

//   if (adminOnly && !isAdmin) {
//     return <Navigate to="/dashboard" />;
//   }

//   return children;
// };

// function AppContent() {
//   return (
//     <Router>
//       <div className="min-h-screen bg-gray-50">
//         <Navbar />
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/campaigns" element={<Campaigns />} />
//             <Route path="/forgot-password" element={<ForgotPassword />} />
//             <Route path="/verify-otp" element={<VerifyOTP />} />
//             <Route path="/reset-password" element={<ResetPassword />} />
//             <Route path="/google-callback" element={<GoogleCallback />} />
          
//            <Route
//             path="/donate/:campaignId"
//             element={
//               <ProtectedRoute>
//                 <DonateForm />
//               </ProtectedRoute>
//             }
//           />
          
//            <Route
//             path="/dashboard"
//             element={
//               <ProtectedRoute>
//                 <UserDashboard />
//               </ProtectedRoute>
//             }
//           />
          
//            <Route
//              path="/admin"
//              element={
//                <ProtectedRoute adminOnly={true}>
//                  <AdminDashboard />
//                </ProtectedRoute>
//              }
//            />
//          </Routes>
//        </div>
//      </Router>
//    );
//  }

//  function App() {
//    return (
//      <AuthProvider>
//        <AppContent />
//      </AuthProvider>
//    );
//  }

// export default App; 


// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { useContext } from 'react';
// import { AuthProvider, AuthContext } from './context/AuthContext';
// import Navbar from './components/Navbar';
// import Home from './pages/Home';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import ForgotPassword from './pages/ForgotPassword';
// import VerifyOTP from './pages/VerifyOTP';
// import ResetPassword from './pages/ResetPassword';
// import GoogleCallback from './pages/GoogleCallback';
// import Campaigns from './pages/Campaigns';
// import DonateForm from './pages/DonateForm';
// import UserDashboard from './pages/UserDashboard';
// import AdminDashboard from './pages/AdminDashboard';

// // Protected Route Component
// const ProtectedRoute = ({ children, adminOnly = false }) => {
//   const { user, loading, isAdmin } = useContext(AuthContext);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-xl text-gray-600">Loading...</div>
//       </div>
//     );
//   }

//   if (!user) {
//     return <Navigate to="/login" />;
//   }

//   if (adminOnly && !isAdmin) {
//     return <Navigate to="/dashboard" />;
//   }

//   return children;
// };

// function AppContent() {
//   return (
//     <Router>
//       <div className="min-h-screen bg-gray-50">
//         <Navbar />
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/forgot-password" element={<ForgotPassword />} />
//           <Route path="/verify-otp" element={<VerifyOTP />} />
//           <Route path="/reset-password" element={<ResetPassword />} />
//           <Route path="/google-callback" element={<GoogleCallback />} />
//           <Route path="/campaigns" element={<Campaigns />} />
          
//           <Route
//             path="/donate/:campaignId"
//             element={
//               <ProtectedRoute>
//                 <DonateForm />
//               </ProtectedRoute>
//             }
//           />
          
//           <Route
//             path="/dashboard"
//             element={
//               <ProtectedRoute>
//                 <UserDashboard />
//               </ProtectedRoute>
//             }
//           />
          
//           <Route
//             path="/admin"
//             element={
//               <ProtectedRoute adminOnly={true}>
//                 <AdminDashboard />
//               </ProtectedRoute>
//             }
//           />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// function App() {
//   return (
//     <AuthProvider>
//       <AppContent />
//     </AuthProvider>
//   );
// }

// export default App;



import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOTP from './pages/VerifyOTP';
import ResetPassword from './pages/ResetPassword';
import GoogleCallback from './pages/GoogleCallback';
import Campaigns from './pages/Campaigns';
import DonateForm from './pages/DonateForm';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, authLoading, isAdmin } = useContext(AuthContext); // ✅ authLoading fix

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-emerald-50">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4" />
        <p className="text-emerald-700 font-bold tracking-widest uppercase text-xs">ZakatCare Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

function AppContent() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 overflow-x-hidden">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/google-callback" element={<GoogleCallback />} />

          <Route
            path="/donate/:campaignId"
            element={
              <ProtectedRoute>
                <DonateForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;