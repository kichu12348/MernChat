import styled from "styled-components";
import chatLogo from "../assets/chatLogo.svg";
import { useEffect, useState } from "react";
import log_signUp from '../assets/backgroundImages/log_signUpPage.jpg';
import axios from 'axios';


export default function SignUp(props) {

//api key
const apiKey = "CglVv3piOwAuoJ";

const [user, setUser] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [span, setSpan] = useState({
  text:'Already have an account?',
  class:'spanNormal'
})

//handles the submit of the form
async function handleSubmit(e){
  e.preventDefault()
  if(user.length<3){
    setSpan({
      text:'*Username must have at least 3 characters',
      class:'spanError'
    })
    if(user.length>10){
      setSpan({
        text:'*Username must be max 10 characters',
        class:'spanError'
      })
    }
    
    window.setTimeout(()=>{
      setSpan({
        text:'Already have an account?',
        class:'spanNormal'
      })
    }, 3000)
    return
  };

  if(password.length<8){
    setSpan({
      text:'*Password must have at least 8 characters',
      class:'spanError'
    })
    window.setTimeout(()=>{
      setSpan({
        text:'Already have an account?',
        class:'spanNormal'
      })
    }, 3000)
    return
  };

  //sign up the user
  const res = await axios.post('/user/signup', {user, email, password});
  if(!res.data.response){
    setSpan({
      text:res.data.message,
      class:'spanError'
    })
    window.setTimeout(()=>{
      setSpan({
        text:'Already have an account?',
        class:'spanNormal'
      })
    }, 3000)
    return
  }
  else{
    setSpan({
      text:res.data.message,
      class:'spanNormal'
    })
    props.setIsAuth(true);
    localStorage.setItem('uid', res.data.token);
    props.setData({
      name:res.data.name,
      email:res.data.email,
      profilePic:res.data.profilePic
    })
  }


  
  
  
  
  setEmail('');
  setPassword('');
  setUser('');
}

const toLogin = () => {
  props.setIsLogged(true);
  props.setIsAuth(false);
};





  return (
    <SignUpContainer>
      <form onSubmit={handleSubmit}>
        <h1>
            <img src={chatLogo} alt="chat logo" />
            Sign Up</h1>
        <input type="text" value={user} onChange={e=>setUser(e.target.value)} placeholder="Username" required />
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)}  placeholder="Email" required />
        <input type="text" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" required />
        <span className={span.class}>
          <p>{span.text}</p><a onClick={toLogin}>Login</a>
        </span>
        <button type="submit">Sign Up</button>
      </form>
    </SignUpContainer>
  );
}

//data:image/png;base64,${avatar[0]}
// {avatar.map((av,i)=>{
//   return <input src={`data:image/png;base64,${av}`} alt="avatar" key={i} onClick={()=>console.log(av)} />
//  })}

//styles for the SignUp component

const SignUpContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100svw;
  height: 100svh;
  background-image: url(${log_signUp});
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    background-repeat: no-repeat;

  form {
    min-height: 45svh;
    max-height: 70svh;
    width: 25svw;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 1rem;
    border: none;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    border-radius: 30px;
    background-color: rgba(63, 63, 63, 0.637);
    color: #fff;

    h1 {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 1.5rem;
        font-weight: 600;
        color: #fff;

        img{
            width: 2.5rem,;
            height: 2.5rem;
        }
    }

    input {
      width: 80%;
      padding: 1rem;
      background-color: rgba(87, 87, 87, 0.7);
      border-radius: 10px;
      outline: none;
      border: none;
      font-size: 1rem;
      color: #fff;
      font-weight: 600;
    }
    button {
      padding: 1rem;
      width: 50%;
      border: none;
      outline: none;
      border-radius: 30px;
      background-color: #9550ff;
      color: #fff;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 600;
      transition: all 0.3s ease-in-out;
      margin-bottom: 1rem;

      &:hover {
        background-color: #b983ff;
        box-shadow: 0 0 5px 1px #b983ff;
      }
    }

    .spanNormal {
      display: flex;
      align-items: center;
      color: #fff;
      font-size: 1rem;
      font-weight: 600;
      flex-direction: row;
      a {
        display: block;
        color: #9550ff;
        text-decoration: none;
        font-weight: 600;
        margin-left: 0.5rem;
        transition: all 0.3s ease-in-out;
        cursor: pointer;

        &:hover {
          color: #b983ff;
        }
      }
    }

    .spanError {
      color: red;
      font-size: 0.8rem;
      font-weight: 600;

      a{
        display: none;
      }
    }
  }



  @media screen and (max-width: 768px) {
    form {
      width: 90svw;
    }
  }
`;
