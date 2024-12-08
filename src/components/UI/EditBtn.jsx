/* eslint-disable react/prop-types */
import Icon from "./Icon";
import Edit_Ic from "../../assets/icons/EventsList/edit.png";

import styles from "./EditBtn.module.css";

const EditBtn = ({ onClick }) => {
  return (
    <div onClick={onClick} className={styles.edit}>
      <Icon src={Edit_Ic} alt="Edit" />
    </div>
  );
};

export default EditBtn;
