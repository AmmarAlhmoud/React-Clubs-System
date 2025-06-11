import accepted from "../../assets/icons/CM-Dashboard/accepted.png";
import rejected from "../../assets/icons/CM-Dashboard/rejected.png";

import { useTranslation } from "react-i18next";

import styles from "./JoinReqList.module.css";

const JoinReqList = ({ title, type }) => {
  const { t } = useTranslation();

  const trimText = (text) => {
    if (text.length > 14) {
      return text.slice(0, 14) + "...";
    }
    return text;
  };

  return (
    <div className={styles.container}>
      <h4>{title}</h4>
      <div className={styles.itemContainer}>
        <div className={styles.item}>
          <div>
            <span>department | </span>
            <span title="ammar alhmoud">{trimText("ammar alhmoud")}</span>
          </div>
          <div>
            {type === "request" && <img src={accepted} alt="accept" />}
            <img src={rejected} alt="reject" />
          </div>
        </div>
      </div>
      <div className={styles.searchContainer}>
        <svg
          className={styles.icon}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103 10.5a7.5 7.5 0 0013.15 6.15z"
          />
        </svg>
        <input
          type="text"
          placeholder={t("cm-dashboard.student-name")}
          className={styles.input}
        />
      </div>
    </div>
  );
};

export default JoinReqList;
