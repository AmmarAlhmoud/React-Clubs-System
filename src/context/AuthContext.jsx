/* eslint-disable react/prop-types */
import React, { useContext, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { clubActions } from "../store/club-slice";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  // updateProfile,
} from "firebase/auth";
import { auth } from "./../firebase.js";

const AuthContext = React.createContext();

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();
  const dispatch = useDispatch();

  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userType");
    localStorage.removeItem("CMName");
    return signOut(auth);
  };

  // const appendClubToUser = async (createdMG, clubId) => {
  //   return updateProfile(createdMG, {
  //     providerId: clubId,
  //   })
  //     .then(() => {
  //       // Profile updated!
  //       // ...
  //       console.log("Profile updated");
  //     })
  //     .catch((error) => {
  //       // An error occurred
  //       // ...
  //       console.log("failed to update the profile!", error);
  //     });
  // };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (localStorage.getItem("userId") === null) {
          setCurrentUser(user);
          localStorage.setItem("userId", user.uid);
        }
        if (localStorage.getItem("userType") !== "Ad") {
          setCurrentUser(user);
        }
        // don't use this method because we will change the user loged in and replace it with
        // .. new created user this method is not safe it's a
        if (localStorage.getItem("userId") !== user.uid) {
          dispatch(clubActions.setCreatedManager(user.uid));
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [dispatch]);

  const value = {
    currentUser,
    signup,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
