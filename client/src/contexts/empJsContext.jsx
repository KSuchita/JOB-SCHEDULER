import React, { createContext, useState } from "react";

// Create context object
export const empJsContextObj = createContext();

// Full implementation in the same file
function EmpJsContext({ children }) {
  const [currentJs, setcurrentJs] = useState({
    firstName: "",
    lastName: "",
    email: "",
    profileImageUrl: "",
    role: "",
  });

  // Return the provider with its children
  return (
    <empJsContextObj.Provider value={{ currentJs, setcurrentJs }}>
      {children}
    </empJsContextObj.Provider>
  );
}

export default EmpJsContext;
