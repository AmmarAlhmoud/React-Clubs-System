import { useDispatch, useSelector } from "react-redux";
import { eventsActions } from "../../store/events-slice";

import CloseBtn from "../UI/CloseBtn";
import Image from "../UI/Image";

import CMLogo from "../../assets/icons/EventsList/club_manager_logo.png";
import CLogo from "../../assets/icons/EventsList/club_manager_logo.png";

import Club_Post_Img from "../../assets/icons/EventsList/event_image.png";

import styles from "./ClubPostRequestDetails.module.css";
import { useTranslation } from "react-i18next";

const ClubPostRequestDetails = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const postDetails = useSelector((state) => state.events.currentPostDetails);

  const { id, CName, CMName, PostName, CLogo, CMLogo, PostImage, description } =
    postDetails;

  const closeDetailsHandler = () => {
    // close the event details
    dispatch(eventsActions.setCurrentPostDetails(null));
    dispatch(eventsActions.setShowPostDetails(false));
  };

  return (
    <section className={styles["club-post"]}>
      <CloseBtn onClick={closeDetailsHandler} />
      <section className={styles.sec1}>
        <div className={styles["post-image"]}>
          <Image src={PostImage} alt="post image" />
        </div>
      </section>
      <section className={styles.sec2}>
        <h2 className={styles.h2}>
          {t("requests.club-post-req.post-details.title")}
        </h2>
        <div>
          <h2 className={styles.h2}>{PostName}</h2>
          <p className={styles["post-desc"]}>{description}</p>
        </div>
      </section>
      <section className={styles.sec3}>
        <div className={styles["logo-name-conatiner"]}>
          <img src={CLogo} alt={CName + " Logo"} />
          <p>{CName}</p>
        </div>
        <div className={styles["logo-name-conatiner"]}>
          <img src={CMLogo} alt={CMName + " Logo"} />
          <p>{CMName}</p>
        </div>
      </section>
    </section>
  );
};

export default ClubPostRequestDetails;
