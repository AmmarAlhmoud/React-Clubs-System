import { useTranslation } from "react-i18next";

import styles from "./LanguageSelector.module.css";

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const handleChange = (e) => {
    i18n.changeLanguage(e.target.value);
    localStorage.setItem("i18nextLng", e.target.value);
  };

  return (
    <div className={styles.wrapper}>
      <select
        className={styles.select}
        value={i18n.language}
        onChange={handleChange}
      >
        <option value="tr">Türkçe</option>
        <option value="en">English</option>
      </select>
    </div>
  );
};

export default LanguageSelector;
