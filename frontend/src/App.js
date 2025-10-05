// import './App.css';
// import { useTranslation } from "react-i18next";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/Landing';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import AccountPage from './pages/Account';
import ChatbotPage from './pages/Chatbot';


function App() {
  // const { t, i18n } = useTranslation();
  return (
    <Router>
          <div className="min-h-screen">
            <Navbar />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/chatbot" element={<ChatbotPage />} />
            </Routes>
          </div>
    </Router>
  );
}

export default App;



// <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
//       <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4">
//         <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
//           ChatBot Project {t("welcome")}
//         </h1>
        
//         <p className="text-green-500 text-center font-semibold mb-6">
//           ✅ Tailwind CSS fonctionne !
//         </p>
//         <div className="space-y-4">
//           <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200">
//             Premier bouton
//           </button>
//           <button className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200">
//             Second bouton
//           </button>
//           <button 
//             onClick={() => i18n.changeLanguage(i18n.language === "en" ? "ar" : "en")}
//             className="px-4 py-2 bg-blue-500 text-white rounded-lg"
//           >
//             {t("button")}
//           </button>
//         </div>
//       </div>
//     </div>