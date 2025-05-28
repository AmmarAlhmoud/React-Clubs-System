import styles from "./DetailsHidden.module.css";
import { useTranslation } from "react-i18next";

const DetailsHidden = ({ DName }) => {
  const { t } = useTranslation();

  return (
    <section className={styles["details-hidden"]}>
      <p className={styles.hint}>
        {t("requests.event-req.click-details", { DName })}
      </p>
    </section>
  );
};

export default DetailsHidden;
