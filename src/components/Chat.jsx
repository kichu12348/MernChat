import styled from "styled-components";
import chatPage from "../assets/backgroundImages/chatPage.jpg";
import floatingGIF from "../assets/floatingGIF.gif";
import { useEffect, useState,useRef } from "react";
import axios from "axios";
import SingleChat from "./partials/singleChat";
import ContactsComp from "./partials/contacts";

//{`data:image/svg+xml;utf8,${encodeURIComponent(newdata.profilePic)}`} 😭

export default function Chat(props) {
  // getting token from local storage
  const token = localStorage.getItem("uid");
  const email = props.data.email;

  // state variables
  const [query, setQuery] = useState("");
  const [queryList, setQueryList] = useState([
    {
      name: "",
      id: "",
      profilePic: "",
    },
  ]);
  const [visibleQuery, setVisibleQuery] = useState(false);
  const [contact, setContact] = useState([]);
  const [newdata, setNewData] = useState({
    contact: [],
    profilePic: "",
    name: "",
    id: "",
  });
  const [run, setRun] = useState(true);
  const [messager, setMessager] = useState({
    name: "",
    profilePic: "",
    roomID: "",
  });
  const [messageOpen, setMessageOpen] = useState(false);
  const [isPhone, setIsPhone] = useState(false);
  const [isClosed, setIsClosed] = useState(true);
  const[rick,setRick]=useState(1);

  //refs

  const childRef = useRef();


  // function to get user data
  const getData = async (email) => {
    const res = await axios.post("/user/getData", { email, token });
    setNewData({
      contact: res.data.contact,
      profilePic: res.data.profilePic,
      name: res.data.name,
      id: res.data.id,
    });
  };
  
//self explanatory 
function rickBoll(){
  const song = new Audio('./rolls.mp3');
  song.play();
  
  window.setTimeout(()=>{
    setRick(2)
    song.pause()
  },10000)
}


  // function to query the contacts from db
  async function queryContact(e) {
    if (e.target.value === "") {
      setQueryList([]);
      setQuery(e.target.value);
      if (visibleQuery) setVisibleQuery(false);
      return;
    }

    setQuery(e.target.value);
    try {
      await axios
        .post("/user/queryContact", { query: e.target.value, token })
        .then((res) => {
          const names = res.data.names.filter(
            (name) =>
              name !== newdata.name &&
              name.toLowerCase().includes(e.target.value.toLowerCase())
          );
          const id = res.data.id.filter((id) => id !== newdata.id);
          const profilePics = res.data.profilePics.filter(
            (profilePic) => profilePic !== newdata.profilePic
          );
          setQueryList(
            names.map((name, index) => {
              return {
                name: name,
                id: id[index],
                profilePic: profilePics[index],
              };
            })
          );
        });

      if (!visibleQuery) setVisibleQuery(true);
    } catch (err) {
      console.log(err);
    }
  }

  // function to add contact
  const addContact = async (id) => {
    
    const res = await axios.post("/user/addContact", { id, token });
    if (!res.data.response) {
      setVisibleQuery(false);
      setQuery("");
      return;
    }
    setNewData({
      contact: res.data.contact,
      profilePic: newdata.profilePic,
      name: newdata.name,
      id: newdata.id,
    });
    displayConatcts();
    setVisibleQuery(false);
    setQuery("");
  };

  const CheckIfPhoneOrNot = () => {
    if (window.innerWidth <= 768) {
      setIsPhone(true);
    } else {
      setIsPhone(false);
    }
  };

  async function closeBtn() {
    displayConatcts();
    setIsClosed(true);
  }

  //runs when the component mounts/renders
  useEffect(() => {
    if (run) {
      getData(email);
      setRun(false);
    }
    CheckIfPhoneOrNot();
    displayConatcts();
  }, []);


 async function settingMessageOpen() {
    setMessageOpen(false);
 }

  

  async function displayConatcts() {
    const res = await axios.post("/user/getContactList", { email, token });
    setContact(res.data.contacts);
  }

  async function SignOutBtnChat() {
    if(rick>1){
    localStorage.removeItem("uid");
    props.setIsAuth(false);
    props.checkAuth();
    props.setIsLogged(true);
    setRun(true);
    return
    }
    else {
      rickBoll();
      }
    
  }

  async function openMessage(item) {
    setMessager({
      name: item.name,
      profilePic: item.profilePic,
      roomID: item.roomID,
    });
    setMessageOpen(true);
    setIsClosed(false);
    if(childRef.current)childRef.current.getMessages(item.roomID);
  }

  return (
    <ChatContainer>
      <SignOutBtn>
        <button onClick={() => SignOutBtnChat()}>Sign Out</button>
      </SignOutBtn>
      <ChatBox>
        {isPhone ? (
          isClosed ? (
            <ContactsComp
              query={query}
              queryContact={queryContact}
              queryList={queryList}
              addContact={addContact}
              contact={contact}
              openMessage={openMessage}
              newdata={newdata}
              visibleQuery={visibleQuery}
              setMessageOpen={settingMessageOpen}
              messager={messager}
              displayConatcts={displayConatcts}
            />
          ) : (
            <Messages>
              <SingleChat
                messager={messager}
                newdata={newdata}
                closeBtn={closeBtn}
                ref={childRef}
              />
            </Messages>
          )
        ) : (
          <>
            <ContactsComp
              query={query}
              queryContact={queryContact}
              queryList={queryList}
              addContact={addContact}
              contact={contact}
              openMessage={openMessage}
              newdata={newdata}
              visibleQuery={visibleQuery}
              setMessageOpen={settingMessageOpen}
              messageOpen={messageOpen}
              messager={messager}
              displayConatcts={displayConatcts}
            />
            <Messages>
              {messageOpen ? (
                <SingleChat
                  messager={messager}
                  newdata={newdata}
                  closeBtn={closeBtn}
                  ref={childRef}
                />
              ) : (
                <div className="startConvo">
                  <img src={floatingGIF} alt="floatingGIF" />
                  <h1>{`hey ${newdata.name}`}</h1>
                </div>
              )}
            </Messages>
          </>
        )}
      </ChatBox>
    </ChatContainer>
  );
}

const ChatContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100svw;
  height: 100dvh;
  position: relative;
  background-image: url(${chatPage});
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  background-repeat: no-repeat;
`;

const ChatBox = styled.div`
  height: 85svh;
  width: 80svw;
  border: none;
  border-radius: 30px;
  box-shadow: 0 0 10px 0 rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.2rem 1rem;

  @media screen and (max-width: 768px) {
    padding: 0;
  }
`;

const Messages = styled.div`
  height: 95%;
  width: 70%;
  border: none;
  border-radius: 30px;
  background-color: rgba(255, 255, 255, 0.199);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  .startConvo {
    height: 100%;
    width: 100%;
    border: none;
    border-radius: 30px;
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 1rem;
    color: #fff;

    img {
      width: 10rem;
      height: 10rem;
    }
  }

  .MessageHeader {
    height: 10%;
    width: 100%;
    border: none;
    border-radius: 30px 30px 0 0;
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: row;
    position: relative;

    h1 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #fff;
      margin: 0.5rem;
    }

    .profileIMG {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      margin: 0.5rem;
    }

    .close {
      position: absolute;
      top: 15px;
      right: 20px;
      width: 2rem;
      height: 2rem;
      border-radius: 50px;
      background-color: transparent;
      border: none;
      cursor: pointer;
      transition: all 0.3s ease-in-out;
      display: none;
      &:hover {
        background-color: rgba(255, 255, 255, 0.186);
      }
    }
  }

  .MessageFooter {
    height: 10%;
    width: 90%;
    border: none;
    border-radius: 0 0 30px 30px;
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;

    .inputMessages {
      height: 90%;
      width: 100%;
      border: none;
      border-radius: 30px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 1rem;
      background-color: rgba(87, 87, 87, 0.5);
      position: relative;

      input {
        height: 80%;
        width: 80%;
        border: none;
        color: #fff;
        background-color: transparent;
        border-radius: 30px;
        outline: none;
        font-size: 1rem;
        font-weight: 600;
        margin-left: 1rem;
      }

      button {
        height: 80%;
        width: 10%;
        border: none;
        border-radius: 30px;
        background-color: transparent;
        color: #000;
        font-size: 1rem;
        font-weight: 600;
        padding:0;
        cursor: pointer;
        position: absolute;
        right: 10px;

        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          transition: all 0.3s ease-in-out;

          &:hover {
            transform: scale(1.01);
          }
        }
      }
    }
  }

  @media screen and (max-width: 768px) {
    width: 100%;
    height: 100%;
    .MessageHeader {
      .close {
        display: block;
      }
    }
  }
`;

const SignOutBtn = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;

  button {
    height: 2rem;
    min-width: 5rem;
    border: none;
    outline: none;
    border-radius: 30px;
    background-color:#5e43f3;
    color: #ffffff;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    transition: all 0.3s ease-in-out;

    &:hover {
      background-color: #a688fa;
      box-shadow: 0 0 5px 1px rgba(166, 136, 250, 0.64);
    }

    @media screen and (max-width: 768px) {

      button{
        min-width: 3rem;
        font-size: 0.8rem;
      }
    }
  }

  @media screen and (max-width: 768px) {
    top: 10px;
    right: 20px;
  }
`;
