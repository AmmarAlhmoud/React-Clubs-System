import ReactDom from "react-dom";
import { useDispatch } from "react-redux";
import { eventsActions } from "../../store/events-slice";

import ColoreButton from "../UI/ColoredButton";

import styles from "./EventDelModal.module.css";

const EventDelModal = ({
  open,
  onClose,
  icon,
  title,
  clubId,
  EventName,
  EventId,
}) => {
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

export default EventDelModal;
