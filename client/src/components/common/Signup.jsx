import React from "react";
import { SignUp } from "@clerk/clerk-react";

function Signup() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <SignUp />
    </div>
  );
}

export default Signup;
