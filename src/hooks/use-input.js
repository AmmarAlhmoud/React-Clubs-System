/* eslint-disable no-prototype-builtins */
import { useState } from "react";

const useInput = (testCases, inputType) => {
  const [enterdValue, setEnterdValue] = useState("");
  const [isTouched, setIsTouched] = useState(false);

  const userTypeFinder = (email) => {
    const types = ["Ad", "Cl", "St"];
    // Loop through each initial
    for (const type of types) {
      if (email.toLowerCase().includes(`@${type}.`)) {
        return type; // Return the found user type
      }
    }
    return null; // No match found
  };

  const runTestCases = (value, testCases) => {
    const firstCheck = [];
    for (const testCase in testCases) {
      if (testCases.hasOwnProperty(testCase)) {
        const testFunction = testCases[testCase];
        const actual = testFunction(value);
        // this will keep only the test cases did not pass the test
        if (!actual) {
          const type = userTypeFinder(value);
          firstCheck.push({ testCase, value: actual, userType: type });
        }
      }
    }

    let results = {};

    if (inputType === "Email") {
      let tempNotPassedTest = []; // has all null type test cases.
      let userTypeChecker = []; // for the filltering the test cases with user types does not pass the test.
      let userType = ""; // has the user type test case.
      let filterdCases = []; // has the filterd test cases without the user type test cases
      let lastCheck = []; // combine the filterd test cases with the user type test case..

      const emailCaseAdmin =
        "Valid email format for Admin - name.surname@Ad.uskudar.com";
      const emailCaseClubManager =
        "Valid email format for Club Manager - name.surname@Cl.uskudar.com";
      const emailCaseStudent =
        "Valid email format for Student - name.surname@St.uskudar.com";

      tempNotPassedTest = firstCheck.filter((item) => item.userType === null);

      // to filter the test cases for the user type that does't pass the test.
      for (const notPassed of tempNotPassedTest) {
        if (
          notPassed.testCase === emailCaseAdmin ||
          notPassed.testCase === emailCaseClubManager ||
          notPassed.testCase === emailCaseStudent
        ) {
          userTypeChecker.push(notPassed);
        }
      }
      // to Check the different user types and if the matching case doesn't match then the user
      //  type is the third user type we have
      if (userTypeChecker.length === 2) {
        const firstType = userTypeChecker[0].testCase;
        const secondType = userTypeChecker[1].testCase;
        if (firstType !== emailCaseAdmin && secondType !== emailCaseAdmin) {
          userType = "Ad";
        }
        if (
          firstType !== emailCaseClubManager &&
          secondType !== emailCaseClubManager
        ) {
          userType = "Cl";
        }
        if (firstType !== emailCaseStudent && secondType !== emailCaseStudent) {
          userType = "St";
        }
      }

      // to fillter the passed use cases after finding the user type from the an passed user types.
      const filterByTestCase = (arr1, arr2) => {
        const filteredArr1 = arr1.filter((item1) => {
          // Check if any object in arr2 has a matching testCase property
          return !arr2.some((item2) => item1.testCase === item2.testCase);
        });
        return filteredArr1;
      };
      // to start filltering only if there is user type exisiting else wise return all the
      // test cases doesn't pass the test.
      if (userType) {
        filterdCases = filterByTestCase(tempNotPassedTest, userTypeChecker);
        lastCheck.push(...filterdCases);
        results = { testItems: lastCheck, userType };
        return results;
      } else {
        lastCheck.push(...tempNotPassedTest);
        results = { testItems: lastCheck, userType };
        return results;
      }
    }
    // if it's a password input type we just return the items that does not pass the test.
    if (inputType === "Password") {
      results = { testItems: firstCheck };
      return results;
    }
  };

  const areAllTrue = (results) => {
    for (const testCase of results.testItems) {
      if (!testCase.value) {
        return false; // Found a false test case, return false
      }
    }
    return true; // All test cases are true
  };

  const allTestCases = runTestCases(enterdValue, testCases);
  const enterdValueIsValid = areAllTrue(allTestCases);
  const hasError = !enterdValueIsValid && isTouched; // if the field is not valid and blured

  const valueChangeHandler = (event) => {
    setEnterdValue(event.target.value.trim());
    setIsTouched(false); // to make the input lose focus
  };

  const valueBlurHandler = () => {
    setIsTouched(true);
  };

  const reset = () => {
    setEnterdValue("");
    setIsTouched(false);
  };

  return {
    value: enterdValue,
    isValid: enterdValueIsValid,
    testCases: allTestCases,
    hasError,
    valueChangeHandler,
    valueBlurHandler,
    reset,
  };
};

export default useInput;
