import styled from 'styled-components';
import chatLogo from '../assets/chatLogo.svg';
import log_signUp from '../assets/backgroundImages/log_signUpPage.jpg';
import { useState } from 'react';
import axios from 'axios';

export default function Login(props) {

    const [email, setEmail] = useState('');
    const[password, setPassword] = useState('');

    const toSignUp = () => {
        props.setIsLogged(false);
        props.setIsAuth(false);
    }

    const handleSubmitLogin = async (e) => {
        e.preventDefault();
        const res = await axios.post('/user/login', {email, password});
        if(!res.data.response){
            alert(res.data.message);
            return;
        }
        localStorage.setItem('uid', res.data.token);
        props.setData({
            name:res.data.user,
            email:res.data.email,
            profilePic:res.data.profilePic
        })
        props.setIsAuth(true);
    }


    return(
       <LoginContainer>
        <form onSubmit={handleSubmitLogin}>
            <h1>
                <img src={chatLogo} alt="chat logo" />
                Login</h1>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email.." required/>
            <input type="text" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password..." required/>
            <span>New here?<a onClick={toSignUp}>Sign Up</a> </span>
            <button type="submit">Login</button>
        </form>
       </LoginContainer>
    )
}

const LoginContainer = styled.div`
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




 form{
    min-height: 45svh;
    max-height: 50svh;
    width: 25svw;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 1rem;
    border: none;
    box-shadow: 0 0 10px 0 rgba(0,0,0,0.1);
    border-radius: 30px;
    background-color: rgba(63, 63, 63, 0.637);
    color: #fff;

    h1{
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 1.5rem;
        font-weight: 600;
        color: #fff;

        img{
            width: 2.5rem;
            height: 2.5rem;
        }
    }

    input{
        width: 80%;
        padding: 1rem;
        background-color:rgba(87, 87, 87, 0.7) ;
        border-radius: 10px;
        outline: none;
        border: none;
        font-size: 1rem;
        color: #fff;
        font-weight: 600;

        
    }
    button{
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

        &:hover{
            background-color: #b983ff;
            box-shadow: 0 0 5px 1px #b983ff;
        }
    }

    span{
        a{
            color: #9550ff;
            text-decoration: none;
            font-weight: 600;
            margin-left: 0.5rem;
            transition: all 0.3s ease-in-out;
            cursor: pointer;

            &:hover{
                color: #b983ff;
            }
        }
    }
 }

 @media screen and (max-width: 768px){

    form{
     width:90svw;
    }

 }
`;

