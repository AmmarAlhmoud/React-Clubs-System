import { useDispatch } from "react-redux";
import { uiActions } from "../../store/ui-slice";

import styles from "./Modal.module.css";
import Button from "./Button";
import successful from "../../assets/images/CL/successful.png";
import confirmation from "../../assets/images/CL/confirmation.png";
import error from "../../assets/images/CL/error.png";
import { useTranslation } from "react-i18next";

function Modal({ err, onClick, marginTop, padding }) {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const dismissHandler = () => {
    dispatch(uiActions.toggleModal(false));
  };

  let type = {
    mType: null,
    alt: "",
  };

  if (err?.type === "confirmation") {
    type.mType = confirmation;
    type.alt = "confirmation";
    type.action = (
      <div className={styles["error-modal-actions"]}>
        <Button
          id={`${err?.id}_cancel`}
          onClick={dismissHandler}
          className={styles.cancel}
        >
          {t("login.model.cancel")}
        </Button>
        <Button id={`${err?.id}_confirm`} onClick={onClick}>
          {t("login.model.confirm")}
        </Button>
      </div>
    );
  } else if (err?.type === "error") {
    type.mType = error;
    type.alt = "error";
    type.action = (
      <Button
        id={`${err?.id}_tryagain`}
        onClick={dismissHandler}
        style={{ marginTop: marginTop, padding: padding }}
      >
        {t("login.model.try-again")}
      </Button>
    );
  } else {
    type.mType = successful;
    type.alt = "successful";
    type.action = (
      <Button id={`${err?.id}_continue`} onClick={dismissHandler}>
        {t("login.model.continue")}
      </Button>
    );
  }

  return (
    <>
      <div className={styles.backdrop} />
      <div className={styles["error-modal-container"]}>
        <div className={styles["error-modal"]}>
          <img src={type.mType} alt={type.alt} />
          <h2 className={styles["error-modal-h2"]}>{err?.title}</h2>
          <p className={styles["error-modal-p"]}>{err?.message}</p>
          {type.action}
        </div>
      </div>
    </>
  );
}

export default Modal;
