/* eslint-disable react/prop-types */
import { useState } from "react";
import { useDispatch } from "react-redux";
import { clubActions } from "../../store/club-slice";
import { getAuthUserId, getAuthUserType } from "../../util/auth";

import ClubDelModal from "./ClubDelModal";
import ColoreButton from "../UI/ColoredButton";
import CateItem from "../EventsList/CateItem";

import delIcon from "../../assets/icons/ClubsList/delete.png";
import setIcon from "../../assets/icons/ClubsList/settings.png";
import joinedImage from "../../assets/joined.png";

import styles from "./ClubCard.module.css";
import CateList from "../EventsList/CateList";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ClubCard = ({ clubData }) => {
  const { t } = useTranslation();
  const userId = getAuthUserId();

  // For Club Deletion Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { clubId, clubName, description, categories, clubIcon, members } =
    clubData;

  const clubInfoPageHandler = () => {
    dispatch(clubActions.setCurrentClubInfo(clubData));
  };

  const openingClubPageHandler = () => {
    dispatch(clubActions.setCurrentClubInfo(clubData));
    navigate(`club-page/${clubId}`);
  };

  const joinedClub = members && Object.keys(members).includes(userId);
  const numberOfMembers = (members && Object.keys(members).length) || 0;

  return (
    <>
      <div className={styles.card}>
        {joinedClub && (
          <img className={styles.joinedImage} src={joinedImage} alt="joined" />
        )}
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
          <div className={styles.infoContainer}>
            <p className={styles.members}>
              {numberOfMembers} {t("clubs-list.member")}
            </p>
            <CateList className={styles.cardCategories}>
              {categories?.map((category, index) => (
                <CateItem
                  key={index}
                  className={styles["cate-item"]}
                  cateName={t(`cate-list-value.${category?.value}`)}
                />
              ))}
            </CateList>
          </div>
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
