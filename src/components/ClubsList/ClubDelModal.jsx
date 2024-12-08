import ReactDom from "react-dom";
import { useDispatch } from "react-redux";
import { clubActions } from "../../store/club-slice";

import ColoreButton from "../UI/ColoredButton";

import styles from "./ClubDelModal.module.css";

const ClubDelModal = ({ open, onClose, icon, title, clubId, clubName }) => {
  const dispatch = useDispatch();

  if (!open) {
    return null;
  }

  const deleteClubHandler = () => {
    dispatch(clubActions.addDeletedClub({ clubId, clubName }));
  };

  return ReactDom.createPortal(
    <>
      <div className={styles.overlay} />
      <div className={styles.modal}>
        <img src={icon} alt="club logo" />
        <div className={styles.text}>
          <h1>Are you sure you want to delete</h1>
          <h2>{title}</h2>
        </div>
        <div className={styles.btns}>
          <ColoreButton onClick={onClose}>Cancel</ColoreButton>
          <ColoreButton red={true} onClick={deleteClubHandler}>
            Delete
          </ColoreButton>
        </div>
      </div>
    </>,
    document.getElementById("portal")
  );
};

export default ClubDelModal;
