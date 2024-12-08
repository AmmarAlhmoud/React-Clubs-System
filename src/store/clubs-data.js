import { clubActions } from "./club-slice";
import { toast } from "sonner";

export const fetchClubsData = () => {
  // we return a function in an action creater the redux kit will ansure to give us the dispatch function.
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await fetch(
        `https://et-clubs-system-dev-default-rtdb.firebaseio.com/clubslist.json`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch clubs list data!");
      }
      const data = await response.json();
      return data;
    };

    try {
      const data = await fetchData();
      const clubsData = data;
      dispatch(clubActions.replaceClubsList(clubsData));
    } catch (error) {
      // alert(error.message);
    }
  };
};

// an action creater function
export const sendClubsData = (clubsData, sendType) => {
  return async () => {
    console.log("sendClubsData: ", clubsData);
    const sendRequest = async () => {
      // the PUT request will overwrite the existing node in the database.
      const response = await fetch(
        `https://et-clubs-system-dev-default-rtdb.firebaseio.com/clubslist.json`,
        {
          method: "PUT",
          body: JSON.stringify(clubsData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send clubs list data!");
      }
    };

    try {
      // we need the await here because the sendRequest function returns a promise.
      await sendRequest();
      if (sendType === "New") {
        toast.success("A new club has been added successfully");
      }
      if (sendType === "Edit") {
        toast.success("The club has been edited successfully");
      }
    } catch (error) {
      if (sendType === "New") {
        toast.error("An error has occurred while creating new club");
      }
      if (sendType === "Edit") {
        toast.error("An error has occurred while creating new club");
      }
    }
  };
};
