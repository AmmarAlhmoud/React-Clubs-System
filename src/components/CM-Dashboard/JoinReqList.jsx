import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useState } from "react";

import styles from "./JoinReqList.module.css";
import JoinReqItem from "./JoinReqItem";

const JoinReqList = ({ title, type }) => {
  const { t } = useTranslation();
  const joinClubReqList = useSelector((state) => state.club.joinClubReqList);
  const [searchTerm, setSearchTerm] = useState("");

  const filterBySearch = (data) => {
    const member = data.info;
    const term = searchTerm.toLowerCase();
    return (
      member.userName.toLowerCase().includes(term) ||
      member.studentId.toLowerCase().includes(term)
    );
  };

  let filteredData = [];
  let fullData = [];

  if (joinClubReqList) {
    if (type === "request") {
      fullData = Object.values(joinClubReqList).filter(
        (data) => data.status.status === "pending"
      );
      filteredData = fullData.filter(filterBySearch);
    } else if (type === "members") {
      fullData = Object.values(joinClubReqList).filter(
        (data) => data.status.status === "accepted"
      );
      filteredData = fullData.filter(filterBySearch);
    }
  }

  // Disable search if no full data
  const isSearchDisabled = fullData.length === 0;

  return (
    <div className={styles.container}>
      <h4>{title}</h4>
      <div className={styles.itemContainer}>
        {fullData.length === 0 ? (
          type === "request" ? (
            <p>{t("cm-dashboard.no-pending-req")}</p>
          ) : (
            <p>{t("cm-dashboard.no-members-found")}</p>
          )
        ) : filteredData.length === 0 ? (
          <p>
            {t("cm-dashboard.no-result")} "{searchTerm}".
          </p>
        ) : (
          filteredData.map((data) => {
            const member = data.info;
            return (
              <JoinReqItem
                key={member.userId}
                type={type}
                studentId={member.studentId}
                clubId={member.clubId}
                userId={member.userId}
                userName={member.userName}
                data={data}
              />
            );
          })
        )}
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
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={isSearchDisabled} // disables search input when no items
        />
      </div>
    </div>
  );
};

export default JoinReqList;
