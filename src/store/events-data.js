import { getAuthUserId } from "../util/auth";
import { eventsActions } from "./events-slice";

export const fetchEventsData = () => {
  // we return a function in an action creater the redux kit will ansure to give us the dispatch function.
  return async (dispatch) => {
    const userId = getAuthUserId();

    const fetchData = async () => {
      const response = await fetch(
        `https://et-clubs-system-dev-default-rtdb.firebaseio.com/eventslist/${userId}.json`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch events list data!");
      }
      const data = await response.json();
      return data;
    };

    try {
      const data = await fetchData();
      const eventsData = data.eventsList;
      // if the items doesn't exist in the fetched data we need to set the events to the inintial events limits.
      dispatch(
        eventsActions.replaceEventsData({
          eventsList: eventsData || [],
        })
      );
    } catch (error) {
      // alert(error.message);
    }
  };
};

// an action creater function
export const sendEventsData = (userId, eventsList) => {
  return async () => {
    const sendRequest = async () => {
      // the PUT request will overwrite the existing node in the database.
      const response = await fetch(
        `https://et-clubs-system-dev-default-rtdb.firebaseio.com/eventslist/${userId}.json`,
        {
          method: "PUT",
          body: JSON.stringify({
            eventsList,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send events list data!");
      }
    };

    try {
      // we need the await here because the sendRequest function returns a promise.
      await sendRequest();
    } catch (error) {
      // alert(error.message);
    }
  };
};
