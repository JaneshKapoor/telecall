// // src/Login.js
// import React, { useState } from 'react';
// import { auth, db } from './firebaseConfig';
// import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// import { Link, useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { doc, getDoc, setDoc } from "firebase/firestore";  // Firestore methods
// import 'react-toastify/dist/ReactToastify.css';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);  // Loading state
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);  // Start loading
//     try {
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;

//       // Check if the document already exists
//       const userDocRef = doc(db, 'users', user.uid);
//       const docSnap = await getDoc(userDocRef);
//       if (docSnap.exists()) {
//         toast.info("Doc already exists");
//       }

//       toast.success("Logged in successfully");
//       navigate('/dashboard');
//     } catch (error) {
//       toast.error(error.message);
//     } finally {
//       setLoading(false);  // Stop loading
//     }
//   };

//   const handleGoogleSignIn = async () => {
//     setLoading(true);  // Start loading
//     const provider = new GoogleAuthProvider();
//     try {
//       const userCredential = await signInWithPopup(auth, provider);
//       const user = userCredential.user;

//       // Check if the document already exists
//       const userDocRef = doc(db, 'users', user.uid);
//       const docSnap = await getDoc(userDocRef);
//       if (!docSnap.exists()) {
//         // Create a new document if it doesn't exist
//         await setDoc(userDocRef, {
//           email: user.email,
//           name: user.displayName,
//           photoURL: user.photoURL,
//           createdAt: new Date(),
//         });
//         toast.success("User doc created");
//       } else {
//         toast.info("Doc already exists");
//       }

//       toast.success("Logged in successfully");
//       navigate('/dashboard');
//     } catch (error) {
//       toast.error(error.message);
//     } finally {
//       setLoading(false);  // Stop loading
//     }
//   };

//   return (
//     <div className="auth-container">
//       <h2>Login</h2>
//       <form onSubmit={handleLogin}>
//         <input 
//           type="email" 
//           value={email} 
//           onChange={(e) => setEmail(e.target.value)} 
//           placeholder="Email" 
//           required 
//         />
//         <input 
//           type="password" 
//           value={password} 
//           onChange={(e) => setPassword(e.target.value)} 
//           placeholder="Password" 
//           required 
//         />
//         <button type="submit" disabled={loading}>
//           {loading ? "Loading..." : "Login"}
//         </button>
//       </form>
//       <button onClick={handleGoogleSignIn} disabled={loading}>
//         {loading ? "Loading..." : "Login with Google"}
//       </button>
//       <p>Don't have an account? <Link to="/signup">Signup</Link></p>
//     </div>
//   );
// };

// export default Login;



// src/Login.js
import React, { useState } from 'react';
import { auth, db } from './firebaseConfig';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { toast } from 'react-toastify';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import 'react-toastify/dist/ReactToastify.css';

const Login = ({ closeLogin, openSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();  // Initialize useNavigate
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDocRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        toast.info("Doc already exists");
      }

      toast.success("Logged in successfully");
      closeLogin();
      navigate('/dashboard');  // Redirect to dashboard
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      const userDocRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userDocRef);
      if (!docSnap.exists()) {
        await setDoc(userDocRef, {
          email: user.email,
          name: user.displayName,
          photoURL: user.photoURL,
          createdAt: new Date(),
        });
        toast.success("User doc created");
      } else {
        toast.info("Doc already exists");
      }

      toast.success("Logged in successfully");
      closeLogin();
      navigate('/dashboard');  // Redirect to dashboard
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Email" 
          required 
        />
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Password" 
          required 
        />
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
      <button onClick={handleGoogleSignIn} disabled={loading}>
        {loading ? "Loading..." : "Login with Google"}
      </button>
      <p>Don't have an account? <span onClick={openSignup} className="text-blue-500 cursor-pointer">Signup</span></p>
    </div>
  );
};

export default Login;
