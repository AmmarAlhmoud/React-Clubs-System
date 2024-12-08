import { getAuthUserType } from "../../../util/auth";
import ClubEditReq from "../../Requests/ClubEditReq/ClubEditReq";
import ColoreButton from "../../UI/ColoredButton";

import styles from "./EditClub.module.css";

const EditClub = () => {
  const userType = getAuthUserType();

  return (
    <ClubEditReq
      className={styles.container}
      title="Edit Club Information"
      type={userType === "Ad" ? "edit-club-Ad" : "edit-my-club"}
      Editable={true}
    >
      <div className={styles.actions}>
        <ColoreButton red={true}>Cancel</ColoreButton>
        <ColoreButton type="submit">Apply</ColoreButton>
      </div>
    </ClubEditReq>
  );
};

export default EditClub;
