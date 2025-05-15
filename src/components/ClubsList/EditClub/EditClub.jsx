import { getAuthUserType } from "../../../util/auth";
import { useNavigate } from "react-router-dom";
import ClubEditReq from "../../Requests/ClubEditReq/ClubEditReq";
import ColoreButton from "../../UI/ColoredButton";

import styles from "./EditClub.module.css";

const EditClub = () => {
  const userType = getAuthUserType();
  const navigate = useNavigate();

  return (
    <ClubEditReq
      className={styles.container}
      title="Edit Club Information"
      type={userType === "Ad" ? "edit-club-Ad" : "edit-my-club"}
      Editable={true}
    >
      <div className={styles.actions}>
        <ColoreButton
          red={true}
          onClick={() => {
            navigate("/clubs-list");
          }}
        >
          Cancel
        </ColoreButton>
        <ColoreButton type="submit">Apply</ColoreButton>
      </div>
    </ClubEditReq>
  );
};

export default EditClub;
