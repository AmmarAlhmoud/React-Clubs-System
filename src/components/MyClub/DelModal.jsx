import ReactDom from "react-dom";
import Button from "../UI/Button";

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
          <Button stiffness={200} scale={1.06} onClick={onClose}>
            Cancel
          </Button>
          <Button stiffness={200} scale={1.06} onClick={onConfirmDelete}>
            Delete
          </Button>
        </div>
      </div>
    </>,
    document.getElementById("portal")
  );
};

export default ClubDelModal;
