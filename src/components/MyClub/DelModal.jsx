import ReactDom from "react-dom";
import ColoredButton from "../UI/ColoredButton";

import styles from "./DelModal.module.css";

const ClubDelModal = ({ open, onClose, icon, title, onConfirmDelete }) => {
  if (!open) {
    return null;
  }

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
          <ColoredButton onClick={onClose}>Cancel</ColoredButton>
          <ColoredButton onClick={onConfirmDelete}>Delete</ColoredButton>
        </div>
      </div>
    </>,
    document.getElementById("portal")
  );
};

export default ClubDelModal;
