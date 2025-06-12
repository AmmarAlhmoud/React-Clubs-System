import ReactDom from "react-dom";
import Button from "../UI/Button";

import styles from "./DelModal.module.css";
import { useTranslation } from "react-i18next";

const ClubDelModal = ({
  open,
  onClose,
  icon,
  title,
  join,
  deleteMemberReq,
  joinClubReq,
  rejectMemberReq,
  onConfirmDelete,
}) => {
  const { t } = useTranslation();

  if (!open) {
    return null;
  }

  return ReactDom.createPortal(
    <>
      <div className={styles.overlay} />
      <div className={styles.modal}>
        <img src={icon} alt="club logo" />
        <div className={styles.text}>
          {join && !joinClubReq && !deleteMemberReq && !rejectMemberReq && (
            <h1>{t("cm-dashboard.join-model.question")}</h1>
          )}
          {!join && !joinClubReq && !deleteMemberReq && !rejectMemberReq && (
            <h1>{t("cm-dashboard.delete-model.question")}</h1>
          )}
          <h2>{title}</h2>
        </div>
        {join && !joinClubReq && !deleteMemberReq && !rejectMemberReq && (
          <div className={`${styles.btns} ${styles.joinBtns}`}>
            <Button stiffness={200} scale={1.06} onClick={onClose}>
              {t("cm-dashboard.join-model.cancel")}
            </Button>
            <Button stiffness={200} scale={1.06} onClick={onConfirmDelete}>
              {t("cm-dashboard.join-model.join")}
            </Button>
          </div>
        )}
        {!join && !joinClubReq && !deleteMemberReq && !rejectMemberReq && (
          <div className={styles.btns}>
            <Button stiffness={200} scale={1.06} onClick={onClose}>
              {t("cm-dashboard.delete-model.cancel")}
            </Button>
            <Button stiffness={200} scale={1.06} onClick={onConfirmDelete}>
              {t("cm-dashboard.delete-model.delete")}
            </Button>
          </div>
        )}
        {deleteMemberReq && (
          <div className={styles.btns}>
            <Button stiffness={200} scale={1.06} onClick={onClose}>
              {t("cm-dashboard.join-model.close")}
            </Button>
            <Button stiffness={200} scale={1.06} onClick={onConfirmDelete}>
              {t("cm-dashboard.delete-model.kick")}
            </Button>
          </div>
        )}
        {joinClubReq && (
          <div className={`${styles.btns} ${styles.joinBtns}`}>
            <Button stiffness={200} scale={1.06} onClick={onClose}>
              {t("cm-dashboard.join-model.close")}
            </Button>
            <Button stiffness={200} scale={1.06} onClick={onConfirmDelete}>
              {t("cm-dashboard.join-model.accept")}
            </Button>
          </div>
        )}
        {rejectMemberReq && (
          <div className={styles.btns}>
            <Button stiffness={200} scale={1.06} onClick={onClose}>
              {t("cm-dashboard.join-model.close")}
            </Button>
            <Button stiffness={200} scale={1.06} onClick={onConfirmDelete}>
              {t("cm-dashboard.join-model.reject")}
            </Button>
          </div>
        )}
      </div>
    </>,
    document.getElementById("portal")
  );
};

export default ClubDelModal;
