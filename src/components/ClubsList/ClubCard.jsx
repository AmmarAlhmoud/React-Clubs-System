/* eslint-disable react/prop-types */
import { useState } from "react";
import { useDispatch } from "react-redux";
import { clubActions } from "../../store/club-slice";
import { getAuthUserType } from "../../util/auth";

import ClubDelModal from "./ClubDelModal";
import ColoreButton from "../UI/ColoredButton";
import CateItem from "../EventsList/CateItem";

import delIcon from "../../assets/icons/ClubsList/delete.png";
import setIcon from "../../assets/icons/ClubsList/settings.png";

import styles from "./ClubCard.module.css";
import CateList from "../EventsList/CateList";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ClubCard = ({ clubData }) => {
  const { t } = useTranslation();

  // For Club Deletion Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { clubId, clubName, description, categories, clubIcon } = clubData;

  const clubInfoPageHandler = () => {
    dispatch(clubActions.setCurrentClubInfo(clubData));
  };

  const openingClubPageHandler = () => {
    dispatch(clubActions.setCurrentClubInfo(clubData));
    navigate(`club-page/${clubId}`);
  };

  return (
    <>
      <div className={styles.card}>
        <div className={styles.cardBody}>
          <div className={styles.clubLogo}>
            <img src={clubIcon} alt="club icon" />
            {getAuthUserType() === "Ad" && (
              <div className={styles.icons}>
                <button onClick={() => setIsModalOpen(true)}>
                  <img src={delIcon} alt="delete" />
                </button>
                <Link to={`edit-club/${clubId}`} onClick={clubInfoPageHandler}>
                  <img src={setIcon} alt="edit" />
                </Link>
              </div>
            )}
          </div>
          <h1>{clubName}</h1>
          <div className={styles.clubDesc}>
            <p>{description}</p>
          </div>
        </div>
        <div className={styles.cardFooter}>
          <CateList className={styles.cardCategories}>
            {categories?.map((category, index) => (
              <CateItem
                key={index}
                className={styles["cate-item"]}
                cateName={t(`cate-list-value.${category?.value}`)}
              />
            ))}
          </CateList>
          <ColoreButton onClick={openingClubPageHandler}>
            {t("clubs-list.club-card.discover")}
          </ColoreButton>
        </div>
      </div>
      <ClubDelModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        icon={clubIcon}
        title={clubName}
        clubId={clubId}
        clubName={clubName}
      />
    </>
  );
};

export default ClubCard;
