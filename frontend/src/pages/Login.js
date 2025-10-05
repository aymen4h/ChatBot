import { useTranslation } from "react-i18next";
import { useAtom } from "jotai";
import { useNavigate } from "react-router";
import {userAtom} from "../store/Store";
import {loginCall} from "../store/ApiCall";
import { useState } from 'react';
import { LogIn } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [, setUser] = useAtom(userAtom);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await loginCall({ username, password });
      // const response = await fetch(`${API_BASE}/auth/login/`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ username, password })
      // });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        setUser({ "username": username, "id": data.id });
        navigate('/chatbot');
      } else {
        setError(t('Invalid_credentials'));
      }
    } catch (err) {
      setError(t('Network_error'));
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 px-4 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="card w-full max-w-md bg-base-100 shadow-2xl">
        <div className="card-body">
          <div className="flex justify-center mb-4">
            <LogIn className="w-16 h-16 text-primary" />
          </div>

          <h2 className="card-title text-3xl justify-center mb-6">{t("login_title")}</h2>

          {error && (
            <div className="alert alert-error mb-4">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">{t("username")}</span>
              </label>
              <input 
                type="text" 
                placeholder={t("username")}
                className="input input-bordered w-full" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">{t("password")}</span>
              </label>
              <input 
                type="password" 
                placeholder={t("password")}
                className="input input-bordered w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-full">
              {t("login_button")}
            </button>
          </form>

          <div className="divider">{t("no_account")}</div>

          <button onClick={() => navigate('/signup')} className="btn btn-ghost w-full">
            {t("signup_link")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;