import React, { useContext, useState } from "react";
import {useNavigate} from 'react-router-dom'
import "./loginregister.css";
import { Link } from "react-router-dom";
import BannerBackground from "./home-banner-background.png";
import Header from "../Header";
import axios from "axios";
import LoginContext from "../CustomQuizz/context/LoginContext";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [role, setRole] = useState("user");
  const [isError, setisError] = useState(false);
  const [error, setError] = useState("Some Error Occured!");

  const navigate = useNavigate();

  const {setloginId} = useContext(LoginContext);

  const check = async (e) => {
    e.preventDefault();
    if (role === "user") {
      setisError(false);
      if (!email || !pass) {
        setError("Some Fields are Missing!");
        setisError(true);
        return;
      }

      try {
        const response = await axios.post("http://localhost:8000/login-user", {
          email: email,
          password: pass,
        });
        // console.log(response);
        if (!response) {
          setisError(true);
          setError("Something went wrong");
          return;
        } else {
          setisError(false);
        }
        if (response.data.message === "User does not exist") {
          // window.alert('User does not exist')
          setisError(true)
          setError(response.data.message);
          return;
        } else if (response.data.message === "Invalid Password") {
          setisError(true)
          setError("Invalid email or Password");
          return ;
        }
        setloginId({userId: response.data.userInfo._id, userName: response.data.userInfo.name, userEmail: response.data.userInfo.email, quizIds: response.data.userInfo.attemptedQuizes}) 
        // console.log('here is data recieved',response)

        navigate('/user')
        // window.alert("User Login successfully");
      } catch (error) {
        setisError(true);
        setError("An error occurred during login");
      }
    } else {
      setisError(false);
      if (!email || !pass) {
        setError("Some Fields are Missing!");
        setisError(true);
        return;
      }

      try {
        const response = await axios.post("http://localhost:8000/login-admin", {
          email: email,
          password: pass,
        });
        // console.log(response);
        if (!response) {
          setisError(true);
          setError("Something went wrong");
          return;
        } else {
          setisError(false);
        }
        if (response.data.message === "Admin does not exist") {
          setError(response.data.message);
          setisError(true);
          return;
        } else if (response.data.message === "Invalid Password") {
          setisError(true);
          setError("Invalid email or Password");
          return ;
        } 
        setloginId({adminId: response.data.adminId, adminName: response.data.adminName, adminEmail: response.data.adminEmail, quizIds: response.data.quizIds});
        navigate('/admin');
        // window.alert("Admin Login successfully");
      } catch (error) {
        setisError(true);
        setError("An error occurred during login");
      }
    }
  };

  return (
    <div>
      <Header />
      <div>
      
     
      <div className="body">
      <div className="home-bannerImage-container">
          <img src={BannerBackground} alt="" />
        </div>
        <div className="auth-form-container">
          
          <div style={{ marginBottom: "30px" }}>
            <h2>Login</h2>
          </div>
          <div className="forms">
            <form className="register-form">
              <div className="input-field">
                <label htmlFor="email">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="youremail@gmail.com"
                  id="email"
                  name="email"
                />
              </div>

              <div className="input-field">
                <label htmlFor="password">Password</label>
                <input
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  type="password"
                  placeholder="********"
                  id="password"
                  name="password"
                />
              </div>

              <div className="input-field">
                <label htmlFor="role" style={{ marginRight: "55px" }}>
                  Role
                </label>
                <select
                  style={{ marginRight: "auto" }}
                  className="drop"
                  id="role"
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <button
                style={{ marginTop: "30px" }}
                className="button-30"
                role="button"
                onClick={check}
              >
                Login
              </button>
              {isError ? (
                <div className="error" style={{ marginTop: "20px" }}>
                  <span style={{ color: "red" }}>{error}</span>
                </div>
              ) : (
                ""
              )}
            </form>
          </div>
          <div style={{ marginTop: "30px", color: "#22092c" }}>
            <Link to={"/register"}>
              <span style={{ color: "#22092c" }}>
                Don't have an account? Register here.
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Login;
