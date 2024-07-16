// import { useState, FormEvent, ChangeEvent } from "react";
// import { useNavigate } from "react-router-dom";
// import { signInWithEmailAndPassword, UserCredential } from "firebase/auth";
// import { auth } from "../../firebase";
// import { message } from "antd";
// import { useDispatch } from "react-redux";
// import { login } from "../../store/userSlice";
// import "antd/dist/reset.css";
// import style from "./style.module.css";

// interface LoginData {
//   email: string;
//   password: string;
// }

// function Login() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [logindata, setLoginData] = useState<LoginData>({
//     email: "",
//     password: "",
//   });

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     if (!logindata.email || !logindata.password) {
//       message.error("Please fill out all fields.");
//       return;
//     }

//     try {
//       const userCredential: UserCredential = await signInWithEmailAndPassword(
//         auth,
//         logindata.email,
//         logindata.password
//       );
//       const user = userCredential.user;
//       console.log("Logged in user:", user);
//       dispatch(login(user)); // Add this line to dispatch the login action
//       message.success("Successfully logged in!");
//       navigate("/");
//     } catch (error) {
//       console.error("Error signing in with password and email", error);
//       message.error("Invalid email or password.");
//     }
//   };

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setLoginData({ ...logindata, [name]: value });
//   };

//   return (
//     <div className={style.wrapper}>
//       <h2 className={style.t}>Login</h2>
//       <form className={style.box} onSubmit={handleSubmit}>
//         <div className={style.emailDiv}>
//           <p className={style.inputText}>Email</p>
//           <input
//             type="email"
//             name="email"
//             className={style.input}
//             value={logindata.email}
//             onChange={handleChange}
//           />
//         </div>
//         <div className={style.passwordDiv}>
//           <p className={style.inputText}>Password</p>
//           <input
//             type="password"
//             name="password"
//             className={style.input}
//             value={logindata.password}
//             onChange={handleChange}
//           />
//         </div>
//         <button type="submit" className={style.btn}>
//           LOGIN
//         </button>
//         <div className={style.lastDiv}>
//           <p className={style.lastText}>Not a member yet?</p>
//         </div>
//       </form>
//     </div>
//   );
// }

// export default Login;
import { useState, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  User as FirebaseUser,
  UserCredential,
} from "firebase/auth";
import { auth } from "../../firebase";
import { message } from "antd";
import { useDispatch } from "react-redux";
import { login } from "../../store/userSlice";
import "antd/dist/reset.css";
import style from "./style.module.css";
import { User } from "../../types";

interface LoginData {
  email: string;
  password: string;
}

const mapFirebaseUserToUser = (firebaseUser: FirebaseUser): User => {
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email || "",
    emailVerified: firebaseUser.emailVerified,
    apiKey: "", // Add a default value or handle accordingly
    appName: "", // Add a default value or handle accordingly
    createdAt: firebaseUser.metadata.creationTime || "",
    isAnonymous: firebaseUser.isAnonymous,
    lastLoginAt: firebaseUser.metadata.lastSignInTime || "",
    providerData: firebaseUser.providerData.map((provider) => ({
      providerId: provider.providerId,
      uid: provider.uid,
      displayName: provider.displayName || null,
      email: provider.email || "",
      phoneNumber: provider.phoneNumber || null,
      photoURL: provider.photoURL || null,
    })),
    stsTokenManager: {
      refreshToken: "", // Add a default value or handle accordingly
      accessToken: "", // Add a default value or handle accordingly
      expirationTime: 0, // Add a default value or handle accordingly
    },
  };
};

function Login() {
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
      const firebaseUser = userCredential.user;
      console.log("Logged in user:", firebaseUser);

      const user = mapFirebaseUserToUser(firebaseUser);
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
}

export default Login;
