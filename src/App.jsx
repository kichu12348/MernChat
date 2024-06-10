import "./App.css";
import Chat from "./components/Chat";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import axios from "axios";
import { useEffect, useState } from "react";
import SocketProvider from "./context/socketContext";

function App() {
  //axios defaults
  axios.defaults.baseURL = "https://mernchatserver-mup6.onrender.com";  //https://mernchatserver-mup6.onrender.com
  axios.defaults.withCredentials = true;

  ///////////////////////////////////////////
  

  //state variables
  const [isLogged, setIsLogged] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    profilePic: "",
  });
  ///////////////////////////////////////////

  //check if user is authenticated
  const checkAuth = async () => {
    const token = localStorage.getItem("uid");
    if (!token) {
      setIsAuth(false);
      return;
    }
    try {
      //check if token is valid
      const res = await axios.post("/user/auth", { token });

      //if token is valid, set isAuth to true and set data to the user's data from the server
      if (res.data.response) {
        setIsAuth(true);
        setData({
          name: res.data.name,
          email: res.data.email,
          profilePic: res.data.profilePic,
        });
      } else {
        setIsAuth(false);
      }
    } catch (err) {
      console.log(err);
      setIsAuth(false);
    }
  };

  useEffect(() => {
    /*
    check if user is authenticated whenever the 
    app is loaded/reloaded/re-rendered
    */
    checkAuth();
  }, []);

  return (
    <SocketProvider>
    <>
      {isAuth ? (
        <Chat
          setIsAuth={setIsAuth}
          data={data}
          checkAuth={checkAuth}
          setIsLogged={setIsLogged}
        />
      ) : isLogged ? (
        <Login
          setIsLogged={setIsLogged}
          setIsAuth={setIsAuth}
          setData={setData}
        />
      ) : (
        <SignUp
          setIsAuth={setIsAuth}
          setIsLogged={setIsLogged}
          setData={setData}
        />
      )}
    </>
    </SocketProvider>
  );
}

export default App;
