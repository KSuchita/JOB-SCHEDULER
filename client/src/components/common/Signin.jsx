import React from "react";
import { SignIn } from "@clerk/clerk-react";

function Signin() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
         // Light blue color
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <SignIn />
    </div>
  );
}

export default Signin;
