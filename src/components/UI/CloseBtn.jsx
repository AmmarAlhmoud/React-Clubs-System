/* eslint-disable react/prop-types */
import Icon from "./Icon";
import Close_Ic from "../../assets/icons/EventsList/close.png";

import styles from "./CloseBtn.module.css";

const CloseBtn = ({ onClick }) => {
  return (
    <div onClick={onClick} className={styles.close}>
      <Icon src={Close_Ic} alt="Close" />
    </div>
  );
};

export default CloseBtn;
