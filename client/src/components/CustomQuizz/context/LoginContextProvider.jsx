import React, { useState } from "react";
import LoginContext from "./LoginContext";
const LoginContextProvider = ({children}) => {
    const [loginId, setloginId] = useState(null);
    return <LoginContext.Provider value={{loginId, setloginId}}>{children}</LoginContext.Provider>
}

export default LoginContextProvider;