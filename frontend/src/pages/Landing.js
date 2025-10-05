import { Brain, Languages, Database } from 'lucide-react';
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useAtom } from "jotai";
import { userAtom } from '../store/Store';

const LandingPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useAtom(userAtom);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className={`min-h-screen ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-secondary text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">{t("hero_title")}</h1>
          <p className="text-xl mb-8">{t("hero_subtitle")}</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button onClick={() => user ? navigate('/chatbot') : navigate('/signup')} className="btn btn-lg bg-white text-primary hover:bg-gray-100">
              {t("get_started")}
            </button>
            <a href="#features" className="btn btn-lg btn-outline text-white border-white hover:bg-white hover:text-primary">
              {t("learn_more")}
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id='features' className="py-20 px-4 bg-base-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">{t("features_title")}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body items-center text-center">
                <Brain className="w-12 h-12 text-primary mb-4" />
                <h3 className="card-title">{t("feature1_title")}</h3>
                <p>{t("feature1_desc")}</p>
              </div>
            </div>
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body items-center text-center">
                <Languages className="w-12 h-12 text-primary mb-4" />
                <h3 className="card-title">{t("feature2_title")}</h3>
                <p>{t("feature2_desc")}</p>
              </div>
            </div>
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body items-center text-center">
                <Database className="w-12 h-12 text-primary mb-4" />
                <h3 className="card-title">{t("feature3_title")}</h3>
                <p>{t("feature3_desc")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 bg-base-200">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">{t("about_title")}</h2>
          <p className="text-lg">{t("about_desc")}</p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;