import { useDispatch } from "react-redux";
import { clubActions } from "../../../store/club-slice";

import ClubEditReq from "./ClubEditReq";
import ColoreButton from "../../UI/ColoredButton";

import styles from "./ClubInfo.module.css";

const ClubInfo = () => {
  const dispatch = useDispatch();

  const getSubmittingName = (event) => {
    dispatch(clubActions.setSubmittingName(event.target.name));
  };

  return (
    <main className={styles.main}>
      <ClubEditReq type="old-info" />
      <ClubEditReq title="New Club information" type="new-info">
        <div className={styles.actions}>
          <ColoreButton
            red={true}
            type="submit"
            name="reject"
            onClick={getSubmittingName.bind(this)}
          >
            Reject
          </ColoreButton>
          <ColoreButton
            type="submit"
            name="approve"
            onClick={getSubmittingName.bind(this)}
          >
            Approve
          </ColoreButton>
        </div>
      </ClubEditReq>
    </main>
  );
};

export default ClubInfo;
