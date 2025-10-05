import { useTranslation } from "react-i18next";
import { useAtom } from "jotai";
import {userAtom, selectedModelAtom} from '../store/Store';
import { User, Globe, Download } from 'lucide-react';
import { useState } from 'react';
import { generate_summary } from "../store/ApiCall";
import jsPDF from "jspdf";


const AccountPage = () => {
  const [user] = useAtom(userAtom);
  const [selectedModel] = useAtom(selectedModelAtom);
  const [summary_en, setSummary_en] = useState('');
  const [summary_ar, setSummary_ar] = useState('');
  const [loading, setLoading] = useState(false);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

    const handleGenerateSummary = async () => { 
    try {
      setLoading(true);

      const body = JSON.stringify({
        user_id: user?.id,
        model: selectedModel || "mistral", 
      });

      const res = await generate_summary(body);
      const data = await res.json();

      if (res.ok && data?.summary_en && data?.summary_ar) {
        setSummary_en(data.summary_en);
        setSummary_ar(data.summary_ar);
      } else {
        alert(t('Network_error'));
      }
    } catch (error) {
      console.error("Error generating summary:", error);
      alert(t('Network_error'));
    } finally {
      setLoading(false);
    }
  };

    const handleDownloadPDF = () => {
    const doc = new jsPDF({
      orientation: "p",
      unit: "pt",
      format: "a4",
    });

    const lang = i18n.language;
    const title = lang === "en" ? "User Summary" : "ملخص المستخدم";
    const summaryText = lang === "en" ? summary_en : summary_ar;

    // Police pour l'arabe (optionnelle mais utile si texte arabe)
    if (lang === "ar") {
      doc.setFont("helvetica", ""); // helvetica supporte basiquement RTL mais pas parfait
      doc.text(title, 300, 40, { align: "center" });
      doc.setFontSize(12);
      doc.text(summaryText || "لا يوجد ملخص بعد", 550, 80, {
        align: "right",
        maxWidth: 500,
      });
    } else {
      doc.setFontSize(18);
      doc.text(title, 40, 50);
      doc.setFontSize(12);
      doc.text(summaryText || "No summary available.", 40, 80, {
        maxWidth: 500,
      });
    }

    doc.save(`summary_${lang}.pdf`);
  };

  return (
    <div className={`min-h-screen bg-base-200 py-8 px-4 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-2xl mx-auto">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body items-center text-center">
            
              <div className="bg-primary text-white rounded-full w-24 h-24 flex items-center justify-center text-white">
                <User className="w-20 h-20" />
              </div>
            
            <h2 className="card-title text-3xl mb-2">{t("account_title")}</h2>
            <div className="badge badge-primary badge-lg mb-6">{user?.username}</div>
            
            <div className="w-full">
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text font-semibold">
                    {i18n.language === 'en' ? 'Summary (English)' : 'الملخص (بالعربية)'}
                  </span>
                </label>

          
                <div
                  className={`border rounded-lg p-4 min-h-32 bg-base-200 text-sm ${
                    i18n.language === 'ar' ? 'text-right' : 'text-left'
                  }`}
                >
                  {i18n.language === 'en'
                    ? summary_en || t("no_summary")
                    : summary_ar || "لا يوجد ملخص بعد"}
                </div>
              </div>

       
              <button
                className={`btn btn-primary w-full ${loading ? "btn-disabled loading" : ""}`}
                onClick={handleGenerateSummary}
                disabled={loading}
              >
                {loading ? t("generating") : t("generate_summary")}
              </button>
              <button
                  className="btn btn-outline flex-1"
                  onClick={handleDownloadPDF}
                  disabled={!summary_en && !summary_ar}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {t("download_pdf")}
              </button>
            </div>

            <div className="divider"></div>
            
            <div className="flex gap-2 items-center">
              <Globe className="w-5 h-5" />
              <span>{t("language")}: {i18n.language === 'en' ? 'English' : 'العربية'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;