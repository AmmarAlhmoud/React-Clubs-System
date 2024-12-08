export const getAuthUserId = () => {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    return null;
  }

  return userId;
};

export const getAuthUserType = () => {
  const userType = localStorage.getItem("userType");

  if (!userType) {
    return null;
  }

  return userType;
};

export const checkAuthAdUserType = () => {
  const userType = localStorage.getItem("userType");

  if (!userType) {
    return null;
  }

  return userType === "Ad";
};

export const checkAuthClUserType = () => {
  const userType = localStorage.getItem("userType");

  if (!userType) {
    return null;
  }

  return userType === "Cl";
};

export const checkAuthStUserType = () => {
  const userType = localStorage.getItem("userType");

  if (!userType) {
    return null;
  }

  return userType === "St";
};

export const displayAuthUserType = () => {
  const userType = localStorage.getItem("userType");

  if (!userType) {
    return null;
  }
  if (userType === "Ad") {
    return "SKS";
  }
  if (userType === "Cl") {
    return "Club Manager";
  }
  if (userType === "St") {
    return "Student";
  }
};

export const displayAuthUserName = () => {
  const userType = localStorage.getItem("userType");
  const managerName = localStorage.getItem("CMName");

  if (!userType) {
    return null;
  }
  if (userType === "Ad") {
    return "Administrator";
  }
  if (userType === "Cl") {
    return managerName;
  }
  if (userType === "St") {
    return "Ali";
  }
};
