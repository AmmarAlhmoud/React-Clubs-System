/*
  useInput hook leveraging i18n translation keys for validation
*/
import { useState } from "react";

/**
 * Test cases keyed by translation keys for react-i18next
 */
export const testCasesForEmailKeys = {
  "email.invalid": (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  "email.noAt": (value) => value.includes("@"),
  "email.noSpaces": (value) => !/\s/.test(value),
  "email.adminFormat": (value) =>
    /^[a-zA-Z]+(\.[a-zA-Z]+)*@\bAd\b\.uskudar\.com$/.test(value),
  "email.clubManagerFormat": (value) =>
    /^[a-zA-Z]+(\.[a-zA-Z]+)*@\bCl\b\.uskudar\.com$/.test(value),
  "email.studentFormat": (value) =>
    /^[a-zA-Z]+(\.[a-zA-Z]+)*@\bSt\b\.uskudar\.com$/.test(value),
};

export const testCasesForPasswordKeys = {
  "password.notBlank": (value) => value.length !== 0,
  "password.minLength": (value) => value.length >= 8,
  "password.noSpaces": (value) => !/\s/.test(value),
};

/**
 * Custom hook that runs validation test cases over an input value.
 * @param {Object} testCases - object mapping translation keys to test functions
 * @param {"Email"|"Password"} inputType
 */
const useInput = (testCases, inputType) => {
  const [enteredValue, setEnteredValue] = useState("");
  const [isTouched, setIsTouched] = useState(false);

  const userTypeFinder = (email) => {
    const lowerEmail = email.toLowerCase();
    const types = ["Ad", "Cl", "St"];
    for (const type of types) {
      if (lowerEmail.includes(`@${type.toLowerCase()}.`)) {
        return type;
      }
    }
    return null;
  };

  const runTestCases = (value) => {
    const failures = [];
    for (const key of Object.keys(testCases)) {
      const passed = testCases[key](value);
      if (!passed) failures.push({ key, passed });
    }

    if (inputType === "Email") {
      const formatKeys = {
        Ad: "email.adminFormat",
        Cl: "email.clubManagerFormat",
        St: "email.studentFormat",
      };
      const userType = userTypeFinder(value);
      const genericFailures = failures.filter(
        (f) => !Object.values(formatKeys).includes(f.key)
      );
      let results = { testItems: [], userType };

      if (userType && formatKeys[userType]) {
        const formatFailure = failures.find(
          (f) => f.key === formatKeys[userType]
        );
        results.testItems = [...genericFailures];
        if (formatFailure) results.testItems.push(formatFailure);
      } else {
        results.testItems = failures;
      }
      return results;
    }

    if (inputType === "Password") {
      return { testItems: failures };
    }

    return { testItems: failures };
  };

  const results = runTestCases(enteredValue);
  const isValid = results.testItems.length === 0;
  const hasError = !isValid && isTouched;

  const valueChangeHandler = (e) => {
    setEnteredValue(e.target.value);
    setIsTouched(false);
  };
  const valueBlurHandler = () => setIsTouched(true);
  const reset = () => {
    setEnteredValue("");
    setIsTouched(false);
  };

  return {
    value: enteredValue,
    isValid,
    testResults: results,
    hasError,
    valueChangeHandler,
    valueBlurHandler,
    reset,
  };
};

export default useInput;
