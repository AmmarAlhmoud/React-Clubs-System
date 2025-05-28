import ReactDom from "react-dom";
import { useDispatch } from "react-redux";
import { eventsActions } from "../../store/events-slice";

import ColoreButton from "../UI/ColoredButton";

import styles from "./EventDelModal.module.css";
import { useTranslation } from "react-i18next";

const EventDelModal = ({
  open,
  onClose,
  icon,
  title,
  clubId,
  EventName,
  EventId,
}) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  if (!open) {
    return null;
  }

  const deleteClubHandler = () => {
    dispatch(eventsActions.addDeletedEvent({ clubId, EventName, EventId }));
  };

  return ReactDom.createPortal(
    <>
      <div className={styles.overlay} />
      <div className={styles.modal}>
        <img src={icon} alt="club logo" />
        <div className={styles.text}>
          <h1>{t("events-list.event-item.event-del-model.question")}</h1>
          <h2>{`${title} ?`}</h2>
        </div>
        <div className={styles.btns}>
          <ColoreButton onClick={onClose}>
            {t("events-list.event-item.event-del-model.cancel")}
          </ColoreButton>
          <ColoreButton red={true} onClick={deleteClubHandler}>
            {t("events-list.event-item.event-del-model.delete")}
          </ColoreButton>
        </div>
      </div>
    </>,
    document.getElementById("portal")
  );
};

export default EventDelModal;
