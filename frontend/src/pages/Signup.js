import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import {signupCall} from "../store/ApiCall";
import { useState } from 'react';
import { UserPlus } from 'lucide-react';

const SignupPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError(t("password_not_match"));
      return;
    }

    try {
      const response = await signupCall({ username, password });
      // const response = await fetch(`${API_BASE}/auth/signup/`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ username, password })
      // });
      
      if (response.ok) {
        navigate('/login');
      } else {
        const data = await response.json();
        setError(t('Signup_failed'));
      }
    } catch (err) {
      setError(t('Network_error'));
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 px-4 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="card w-full max-w-md bg-base-100 shadow-2xl">
        <div className="card-body">
          <div className="flex justify-center mb-4">
            <UserPlus className="w-16 h-16 text-primary" />
          </div>

          <h2 className="card-title text-3xl justify-center mb-6">{t("signup_title")}</h2>

          {error && (
            <div className="alert alert-error mb-4">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
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

            <div className="form-control">
              <label className="label">
                <span className="label-text">{t("confirm_password")}</span>
              </label>
              <input 
                type="password" 
                placeholder={t("confirm_password")}
                className="input input-bordered w-full"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-full">
              {t("signup_button")}
            </button>
          </form>

          <div className="divider">{t("have_account")}</div>

          <button onClick={() => navigate('/login')} className="btn btn-ghost w-full">
            {t("login_link")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;