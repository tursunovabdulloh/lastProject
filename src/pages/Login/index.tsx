import React, { useState, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, UserCredential } from "firebase/auth";
import { auth } from "../../firebase";
import { message } from "antd";
import { useDispatch } from "react-redux";
import { login } from "../../store/userSlice";
import "antd/dist/reset.css"; // Ant Design CSS
import style from "./style.module.css";

interface LoginData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logindata, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!logindata.email || !logindata.password) {
      message.error("Please fill out all fields.");
      return;
    }

    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        auth,
        logindata.email,
        logindata.password
      );
      const user = userCredential.user;
      console.log("Logged in user:", user);
      dispatch(login(user)); // Add this line to dispatch the login action
      message.success("Successfully logged in!");
      navigate("/");
    } catch (error) {
      console.error("Error signing in with password and email", error);
      message.error("Invalid email or password.");
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData({ ...logindata, [name]: value });
  };

  return (
    <div className={style.wrapper}>
      <h2 className={style.t}>Login</h2>
      <form className={style.box} onSubmit={handleSubmit}>
        <div className={style.emailDiv}>
          <p className={style.inputText}>Email</p>
          <input
            type="email"
            name="email"
            className={style.input}
            value={logindata.email}
            onChange={handleChange}
          />
        </div>
        <div className={style.passwordDiv}>
          <p className={style.inputText}>Password</p>
          <input
            type="password"
            name="password"
            className={style.input}
            value={logindata.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className={style.btn}>
          LOGIN
        </button>
        <div className={style.lastDiv}>
          <p className={style.lastText}>Not a member yet?</p>
        </div>
      </form>
    </div>
  );
};

export default Login;
