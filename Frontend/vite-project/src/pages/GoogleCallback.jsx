// import { useEffect, useContext } from 'react';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext';
// import { motion } from 'framer-motion';
// import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
// import { toast } from 'react-hot-toast';

// const GoogleCallback = () => {
//   const [searchParams] = useSearchParams();
//   const { login } = useContext(AuthContext);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const handleCallback = async () => {
//       const token = searchParams.get('token');
//       const userString = searchParams.get('user');
//       const error = searchParams.get('error');

//       if (error) {
//         toast.error('Google authentication failed');
//         setTimeout(() => navigate('/login'), 2000);
//         return;
//       }

//       if (token && userString) {
//         try {
//           const userData = JSON.parse(decodeURIComponent(userString));
//           login(userData, token);
//           toast.success('Login successful!');
          
//           setTimeout(() => {
//             navigate(userData.role === 'admin' ? '/admin' : '/dashboard');
//           }, 1000);
//         } catch (err) {
//           console.error('Error parsing user data:', err);
//           toast.error('Authentication failed');
//           setTimeout(() => navigate('/login'), 2000);
//         }
//       } else {
//         toast.error('Invalid authentication data');
//         setTimeout(() => navigate('/login'), 2000);
//       }
//     };

//     handleCallback();
//   }, [searchParams, login, navigate]);

//   const error = searchParams.get('error');

//   return (
//     <div className="min-h-screen bg-emerald-50 flex items-center justify-center">
//       <motion.div 
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         className="bg-white p-12 rounded-3xl shadow-2xl text-center max-w-md"
//       >
//         {error ? (
//           <>
//             <motion.div
//               initial={{ scale: 0 }}
//               animate={{ scale: 1 }}
//               className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
//             >
//               <XCircle className="text-red-600" size={40} />
//             </motion.div>
//             <h2 className="text-2xl font-bold text-gray-800 mb-2">Authentication Failed</h2>
//             <p className="text-gray-600">Redirecting to login...</p>
//           </>
//         ) : (
//           <>
//             <motion.div
//               animate={{ rotate: 360 }}
//               transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
//               className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
//             >
//               <Loader2 className="text-emerald-600" size={40} />
//             </motion.div>
//             <h2 className="text-2xl font-bold text-gray-800 mb-2">Completing Sign In</h2>
//             <p className="text-gray-600">Please wait...</p>
//           </>
//         )}
//       </motion.div>
//     </div>
//   );
// };

// export default GoogleCallback;


import { useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Loader2, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');
      const userString = searchParams.get('user');
      const error = searchParams.get('error');

      if (error) {
        toast.error('Google authentication failed');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      if (token && userString) {
        try {
          const userData = JSON.parse(decodeURIComponent(userString));

          // ✅ Pehle localStorage mein save karo
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(userData));

          // ✅ Context update karo
          login(userData, token);

          toast.success('Login successful!');

          // ✅ Immediately navigate, no setTimeout
          navigate(userData.role === 'admin' ? '/admin' : '/dashboard', { replace: true });

        } catch (err) {
          console.error('Error parsing user data:', err);
          toast.error('Authentication failed');
          setTimeout(() => navigate('/login'), 2000);
        }
      } else {
        toast.error('Invalid authentication data');
        setTimeout(() => navigate('/login'), 2000);
      }
    };

    handleCallback();
  }, []); // ✅ Empty deps — sirf ek baar run ho

  const error = searchParams.get('error');

  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-12 rounded-3xl shadow-2xl text-center max-w-md"
      >
        {error ? (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <XCircle className="text-red-600" size={40} />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Authentication Failed</h2>
            <p className="text-gray-600">Redirecting to login...</p>
          </>
        ) : (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Loader2 className="text-emerald-600" size={40} />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Completing Sign In</h2>
            <p className="text-gray-600">Please wait...</p>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default GoogleCallback;