import './App.css'
import Chat from './components/Chat'
import Login from './components/Login'
import SignUp from './components/SignUp'
import axios from 'axios'
import { useEffect, useState } from 'react'


function App() {

  axios.defaults.baseURL = 'https://mernchatserver.onrender.com';
  axios.defaults.withCredentials = true

  const[isLogged,setIsLogged] = useState(true);
  const[run,setRun] = useState(true);
  const[isAuth,setIsAuth] = useState(false);
  const[data,setData] = useState({
    name:'',
    email:'',
    profilePic:''
  });

  const checkAuth = async ()=>{
    const token = localStorage.getItem('uid');
    if(!token){
      setIsAuth(false);
      return;
    }
    try{
      const res = await axios.post('/user/auth',{token});
      if(res.data.response){
        setIsAuth(true);
        setData({
          name:res.data.name,
          email:res.data.email,
          profilePic:res.data.profilePic
        })
      }
      else{
        setIsAuth(false);
      }
    }
    catch(err){
      console.log(err);
    }}

  useEffect(()=>{
    checkAuth();
  },[])

  return (
    <>
     {   
      isAuth ? <Chat setIsAuth={setIsAuth} data={data} checkAuth={checkAuth}  setIsLogged={setIsLogged}/> : isLogged ? <Login setIsLogged={setIsLogged} setIsAuth={setIsAuth} setData={setData} /> :  <SignUp setIsAuth={setIsAuth} setIsLogged={setIsLogged} setData={setData}/> 
    }
    </>
  )
}

export default App
