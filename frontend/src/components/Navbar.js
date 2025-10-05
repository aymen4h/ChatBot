import { useAtom } from "jotai";
import {userAtom} from '../store/Store';
import { Menu, X, Globe, LogOut} from 'lucide-react';
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useState} from 'react';


const Navbar = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [user, setUser] = useAtom(userAtom);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isRTL = i18n.language === 'ar';

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    navigate('/');
  };

  return (
    <nav className={`bg-base-200 shadow-lg ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/')}
              className="text-2xl font-bold text-primary"
            >
              AI Chat
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <button onClick={() => navigate('/account')} className="btn btn-ghost">
                  {t("nav_account")}
                </button>
                <button onClick={() => navigate('/chatbot')} className="btn btn-ghost">
                  {t("nav_chatbot")}
                </button>
                <button onClick={handleLogout} className="btn btn-ghost">
                  <LogOut className="w-4 h-4" />
                  {t("nav_logout")}
                </button>
              </>
            ) : (
              <button onClick={() => navigate('/login')} className="btn btn-primary">
                {t("nav_login")}
              </button>
            )}
            <button 
              onClick={() => i18n.changeLanguage(i18n.language === "en" ? "ar" : "en")}
              className="btn btn-ghost btn-circle"
            >
              <Globe className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden btn btn-ghost btn-circle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-base-300 px-4 py-4">
          {user ? (
            <>
              <button onClick={() => { navigate('/account'); setMobileMenuOpen(false); }} className="btn btn-ghost w-full justify-start mb-2">
                {t("nav_account")}
              </button>
              <button onClick={() => { navigate('/chatbot'); setMobileMenuOpen(false); }} className="btn btn-ghost w-full justify-start mb-2">
                {t("nav_chatbot")}
              </button>
              <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="btn btn-ghost w-full justify-start mb-2">
                {t("nav_logout")}
              </button>
            </>
          ) : (
            <button onClick={() => { navigate('/login'); setMobileMenuOpen(false); }} className="btn btn-primary w-full mb-2">
              {t("nav_login")}
            </button>
          )}
          <button 
            onClick={() => i18n.changeLanguage(i18n.language === "en" ? "ar" : "en")}
            className="btn btn-ghost w-full justify-start"
          >
            <Globe className="w-5 h-5" />
            {t("language")}
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;