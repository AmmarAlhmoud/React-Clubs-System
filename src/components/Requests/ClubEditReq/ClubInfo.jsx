import { useDispatch } from "react-redux";
import { clubActions } from "../../../store/club-slice";

import ClubEditReq from "./ClubEditReq";
import ColoreButton from "../../UI/ColoredButton";

import styles from "./ClubInfo.module.css";
import { useTranslation } from "react-i18next";

const ClubInfo = () => {
  const { t } = useTranslation();

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
            {t("requests.club-edit-req.reject")}
          </ColoreButton>
          <ColoreButton
            type="submit"
            name="approve"
            onClick={getSubmittingName.bind(this)}
          >
             {t("requests.club-edit-req.approve")}
          </ColoreButton>
        </div>
      </ClubEditReq>
    </main>
  );
};

export default ClubInfo;
