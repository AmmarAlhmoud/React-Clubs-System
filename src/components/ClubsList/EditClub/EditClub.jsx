import { getAuthUserType } from "../../../util/auth";
import { useNavigate } from "react-router-dom";
import ClubEditReq from "../../Requests/ClubEditReq/ClubEditReq";
import ColoreButton from "../../UI/ColoredButton";

import styles from "./EditClub.module.css";
import { useTranslation } from "react-i18next";

const EditClub = () => {
  const { t } = useTranslation();

  const userType = getAuthUserType();
  const navigate = useNavigate();

  return (
    <ClubEditReq
      className={styles.container}
      title={t("clubs-list.club-card.edit-page.title")}
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
          {t("clubs-list.club-card.edit-page.cancel")}
        </ColoreButton>
        <ColoreButton type="submit">
          {t("clubs-list.club-card.edit-page.apply")}
        </ColoreButton>
      </div>
    </ClubEditReq>
  );
};

export default EditClub;
