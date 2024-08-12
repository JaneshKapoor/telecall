// // src/Signup.js
// import React, { useState } from 'react';
// import { auth, db } from './firebaseConfig';
// import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// import { Link, useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { doc, setDoc, getDoc } from "firebase/firestore";  // Firestore methods
// import 'react-toastify/dist/ReactToastify.css';

// const Signup = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);  // Loading state
//   const navigate = useNavigate();

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     setLoading(true);  // Start loading
//     try {
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;

//       // Use UID as the document ID
//       const userDocRef = doc(db, 'users', user.uid);
//       const docSnap = await getDoc(userDocRef);
//       if (!docSnap.exists()) {
//         // Create a new document
//         await setDoc(userDocRef, {
//           email: user.email,
//           createdAt: new Date(),
//           // Add any other user-specific information you need to store
//         });
//         toast.success("User doc created");
//       } else {
//         toast.info("User doc already exists");
//       }

//       toast.success("Account created successfully");
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

//       // Use UID as the document ID
//       const userDocRef = doc(db, 'users', user.uid);
//       const docSnap = await getDoc(userDocRef);
//       if (!docSnap.exists()) {
//         // Create a new document with additional fields
//         await setDoc(userDocRef, {
//           email: user.email,
//           name: user.displayName,
//           photoURL: user.photoURL,
//           createdAt: new Date(),
//         });
//         toast.success("User doc created");
//       } else {
//         toast.info("User doc already exists");
//       }

//       toast.success("Account created successfully");
//       navigate('/dashboard');
//     } catch (error) {
//       toast.error(error.message);
//     } finally {
//       setLoading(false);  // Stop loading
//     }
//   };

//   return (
//     <div className="auth-container">
//       <h2>Signup</h2>
//       <form onSubmit={handleSignup}>
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
//           {loading ? "Loading..." : "Create Account"}
//         </button>
//       </form>
//       <button onClick={handleGoogleSignIn} disabled={loading}>
//         {loading ? "Loading..." : "Sign in with Google"}
//       </button>
//       <p>Already have an account? <Link to="/login">Login</Link></p>
//     </div>
//   );
// };

// export default Signup;




// src/Signup.js


import React, { useState } from 'react';
import { auth, db } from './firebaseConfig';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { toast } from 'react-toastify';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import 'react-toastify/dist/ReactToastify.css';

const Signup = ({ closeLogin, openLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDocRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userDocRef);
      if (!docSnap.exists()) {
        await setDoc(userDocRef, {
          email: user.email,
          createdAt: new Date(),
        });
        toast.success("User doc created");
      } else {
        toast.info("User doc already exists");
      }

      toast.success("Account created successfully");
      navigate('/dashboard'); // Redirect to the dashboard page
      closeLogin(); // Close the login/signup dialog
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
        toast.info("User doc already exists");
      }

      toast.success("Account created successfully");
      navigate('/dashboard'); // Redirect to the dashboard page
      closeLogin(); // Close the login/signup dialog
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
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
          {loading ? "Loading..." : "Create Account"}
        </button>
      </form>
      <button onClick={handleGoogleSignIn} disabled={loading}>
        {loading ? "Loading..." : "Sign up with Google"}
      </button>
      <p>Already have an account? <span onClick={openLogin} className="text-blue-500 cursor-pointer">Login</span></p>
    </div>
  );
};

export default Signup;
