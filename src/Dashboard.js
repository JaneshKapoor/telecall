import React, { useState, useEffect } from 'react';
import { auth, db } from './firebaseConfig';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import { doc, setDoc } from "firebase/firestore";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Dashboard.css';
import userSvg from './user.svg'; // Import the default user image

const Dashboard = () => {
  const [description, setDescription] = useState('');
  const [csvFile, setCsvFile] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [questionsAndAnswers, setQuestionsAndAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [photoURL, setPhotoURL] = useState(null); // State to hold photoURL
  const navigate = useNavigate();

  useEffect(() => {
    // Set the user's photoURL if available
    const user = auth.currentUser;
    if (user) {
      setPhotoURL(user.photoURL);
    }
  }, []);

  const handleLogout = () => {
    auth.signOut()
      .then(() => {
        toast.success("Logged out successfully");
        navigate('/');
      })
      .catch((error) => {
        toast.error("Error logging out: " + error.message);
      });
  };

  const handleLogoClick = () => {
    navigate('/'); // Redirect to the Home page
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const parseCsv = () => {
    return new Promise((resolve, reject) => {
      if (!csvFile) {
        reject("No CSV file provided");
        return;
      }

      Papa.parse(csvFile, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.data.length === 0) {
            reject("Parsed CSV data is empty");
            return;
          }
          console.log("Parsed CSV data:", results.data);
          setCsvData(results.data);
          resolve(results.data);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  };

  const generateQuestionsAndAnswers = async () => {
    try {
      const response = await fetch("http://localhost:3001/generate-qa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate questions and answers");
      }

      const data = await response.json();
      setQuestionsAndAnswers(data.questionsAndAnswers);
      return data.questionsAndAnswers; // Return the generated Q&A for saving
    } catch (error) {
      toast.error("Error generating Q&A: " + error.message);
      throw error;
    }
  };

  const handleCall = async (customer) => {
    try {
      const fullPhoneNumber = `+${customer['Country Code']}${customer.Number}`;

      const response = await fetch('http://localhost:3001/make-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: customer.Name,
          customerNumber: fullPhoneNumber,
          productDescription: description,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to initiate call');
      }

      toast.success('Call initiated successfully');
    } catch (error) {
      toast.error('Error initiating call: ' + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User is not authenticated");
      }

      const parsedCsvData = await parseCsv();

      const generatedQnA = await generateQuestionsAndAnswers();

      const userDocRef = doc(db, 'users', user.uid);
      const formData = {
        description,
        csvData: parsedCsvData,
        questionsAndAnswers: generatedQnA,
        uploadedAt: new Date(),
      };

      await setDoc(userDocRef, formData, { merge: true });

      toast.success("Description, CSV data, and Q&A generated successfully.");
      setLoading(false);
      navigate('/dashboard');
    } catch (error) {
      console.error("Error during processing:", error);
      toast.error("Error processing data: " + error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#078dfb] via-black to-[#101724] text-white relative overflow-hidden">
      {/* Navigation Bar */}
      <nav className="w-full fixed top-0 left-0 bg-black bg-opacity-70 backdrop-filter backdrop-blur-lg z-30">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div
            onClick={handleLogoClick} // Add onClick handler to navigate to Home page
            className="cursor-pointer text-2xl font-bold bg-gradient-to-r from-blue-500 via-blue-400 to-red-500 bg-clip-text text-transparent"
          >
            Telecalli
          </div>
          <div className="hidden md:flex space-x-8 items-center">
            <a
              href="/dashboard"
              className="text-lg font-medium transition relative text-transparent text-white"
            >
              Dashboard
            </a>
            {/* User Image or Default User SVG */}
            <img
              src={photoURL || userSvg}
              alt="User"
              className="w-10 h-10 rounded-full object-cover mr-4"
            />
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-full shadow-lg hover:from-indigo-600 hover:to-blue-500 transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="relative z-10 text-center mt-20 flex flex-col items-center justify-center max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-bold mb-10 bg-gradient-to-r from-blue-500 via-blue-400 to-red-500 bg-clip-text text-transparent">Dashboard</h2>
        
        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-6">
            <label htmlFor="description" className="block text-left text-lg font-medium text-gray-300 mb-2">
              Product/Service Description:
            </label>
            <textarea
              id="description"
              value={description}
              onChange={handleDescriptionChange}
              className="w-full p-4 bg-gray-700 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="csvFile" className="block text-left text-lg font-medium text-gray-300 mb-2">
              Upload CSV File:
            </label>
            <input
              type="file"
              id="csvFile"
              accept=".csv"
              onChange={handleFileChange}
              className="w-full p-4 bg-gray-700 text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-full shadow-lg hover:from-indigo-600 hover:to-blue-500 transition-all"
          >
            {loading ? "Processing..." : "Submit"}
          </button>
        </form>

        {csvData.length > 0 && (
          <div className="mt-10 w-full">
            <h3 className="text-2xl font-bold mb-4 text-white">Parsed CSV Data:</h3>
            <table className="w-full table-auto text-black bg-white">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Number</th>
                  <th className="px-4 py-2 text-left">Country Code</th>
                  <th className="px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {csvData.map((row, index) => (
                  <tr key={index}>
                    <td className="border-t border-gray-700 px-4 py-2">{row.Name || "No Name"}</td>
                    <td className="border-t border-gray-700 px-4 py-2">{row.Number || "No Number"}</td>
                    <td className="border-t border-gray-700 px-4 py-2">{row['Country Code'] || "No Country Code"}</td>
                    <td className="border-t border-gray-700 px-4 py-2">
                      <button
                        onClick={() => handleCall(row)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-full shadow-lg hover:from-indigo-600 hover:to-blue-500 transition-all"
                      >
                        Call
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {questionsAndAnswers.length > 0 && (
          <div className="mt-10 w-full">
            <h3 className="text-2xl font-bold mb-4 text-white">Generated Questions and Answers:</h3>
            <ul className="list-disc list-inside text-black bg-white p-4 rounded-lg">
              {questionsAndAnswers.map((qa, index) => (
                <li key={index} className="mb-2">{qa}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
