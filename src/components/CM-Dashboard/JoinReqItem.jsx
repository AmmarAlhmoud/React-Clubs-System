import { useDispatch } from "react-redux";
import { uiActions } from "../../store/ui-slice";

import accepted from "../../assets/icons/CM-Dashboard/accepted.png";
import rejected from "../../assets/icons/CM-Dashboard/rejected.png";

import styles from "./JoinReqItem.module.css";

const JoinReqItem = ({ type, studentId, userName, data }) => {
  const dispatch = useDispatch();

  const trimText = (text) => {
    if (text.length > 14) {
      return text.slice(0, 14) + "...";
    }
    return text;
  };

  const acceptStdJoinReqHandler = () => {
    dispatch(uiActions.setStatusModal("accepted"));
    const newStatus = { ...data?.status, status: "accepted" };
    dispatch(
      uiActions.setReqBoxStatusData({
        info: data?.info,
        status: newStatus,
      })
    );
  };

  const rejectOrDeleteStdHandler = () => {
    let newStatus = {};
    // To rejet member joining to club.
    if (type === "request") {
      dispatch(uiActions.setStatusModal("rejected"));
      newStatus = { ...data?.status, status: "rejected" };
      dispatch(
        uiActions.setReqBoxStatusData({
          info: data?.info,
          status: newStatus,
        })
      );
      return;
    }
    dispatch(uiActions.setStatusModal("deleted"));
    newStatus = { ...data?.status, status: "deleted" };
    // To delete member from club.
    dispatch(
      uiActions.setReqBoxStatusData({
        info: data?.info,
        status: newStatus,
      })
    );
  };

  return (
    <div className={styles.item}>
      <div>
        <span>{studentId} | </span>
        <span title={userName}>{trimText(userName)}</span>
      </div>
      <div>
        {type === "request" && (
          <img onClick={acceptStdJoinReqHandler} src={accepted} alt="accept" />
        )}
        <img onClick={rejectOrDeleteStdHandler} src={rejected} alt="reject" />
      </div>
    </div>
  );
};

export default JoinReqItem;
