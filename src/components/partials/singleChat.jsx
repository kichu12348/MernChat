import styled from "styled-components";
import send from "../../assets/send.svg";
import close from "../../assets/close.svg";
import {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import io from "socket.io-client";
import axios from "axios";

const ENDPOINT = "https://mernchatserver-mup6.onrender.com";

const SingleChat = forwardRef(({ messager, newdata, closeBtn }, ref) => {
  // sending ref to parent component
  useImperativeHandle(ref, () => {
    return {
      getMessages: getMessages,
    };
  });

  //refs
  const messageEndRef = useRef();

  //state variables
  const [socketConnected, setSocketConnected] = useState(false);
  const token = localStorage.getItem("uid");
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([{}]);
  const [runOnce, setRunOnce] = useState(true);
  /////////////////////////////////////////////////////////////////////////////

  //socket.io
  const socket = io(ENDPOINT);

  //FUNCTIONS//////////////////////////////////////////////////

  //sends message to server
  async function sendMessage(e, roomID) {
    e.preventDefault();
    if (message === "") return;
    setMessage("");
    try {
      await axios.post("/message/sendmessage", { token, message, roomID });
      socket.emit("message", {
        message,
        roomID,
        from:newdata.id
      });
    } catch (err) {
      console.log(err);
    }
  }

  //gets messages from server when a room is joined/opened
  async function getMessages(roomID) {
    try {
      socket.emit("joinRoom", roomID);
      const data = await axios.post("/message", { token, roomID });
      setMessageList(data.data);
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      setMessageList([]);
      console.log(err);
    }
  }

  ////////////////////////////////////////////////////////////
  useEffect(() => {
    if (runOnce) {
      const userID = newdata.id;
      getMessages(messager.roomID);
      socket.emit("setup", userID);

      socket.on("connection", () => {
        setSocketConnected(true);
      });

      setRunOnce(false);
    }
  }, []);
  ///////////////////////////////////////////////////////////////

  //socket.io listeners
  async function newMessageListener() {
    socket.on("newMessage", (data) => {
      setMessageList(prev=>[...prev,data]);
    });
  }

  useEffect(() => {
    newMessageListener();
    messageEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [
    messageList,
    token,
    messager.roomID,
    newdata.id,
    socket,
    socketConnected,
    newMessageListener,
    !message,
  ]);

  //////////////////

  return (
    <>
      <div className="MessageHeader">
        <img
          src={`data:image/svg+xml;utf8,${encodeURIComponent(
            messager.profilePic
          )}`}
          alt="profile"
          className="profileIMG"
        />
        <img
          src={close}
          alt="close"
          className="close"
          onClick={() => {
            closeBtn();
            setRunOnce(true);
          }}
        />
        <h1>{messager.name}</h1>
      </div>

      <AllMessages>
        <div className="MessageBody">
          {messageList.map((item, index) => {
            return (
              <div
                key={index}
                className={
                  item.from === newdata.id ? "messageRight" : "messageLeft"
                }
              >
                <div
                  className={item.from === newdata.id ? "rightMSG" : "leftMSG"}
                >
                  <p>
                    <span>
                      <span>
                        {item.from === newdata.id ? "You" : messager.name}
                      </span>
                      <img
                        src={`data:image/svg+xml;utf8,${encodeURIComponent(
                          item.from === newdata.id
                            ? newdata.profilePic
                            : messager.profilePic
                        )}`}
                      />
                    </span>
                    <br />
                    {item.message}
                  </p>
                </div>
              </div>
            );
          })}
          <div className="refDIV" ref={messageEndRef}></div>
        </div>
      </AllMessages>

      <div className="MessageFooter">
        <form
          className="inputMessages"
          onSubmit={(e) => sendMessage(e, messager.roomID)}
        >
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            type="text"
            placeholder="Type in a message. . . . . . ."
          />
          <button type="submit">
            <img src={send} alt="send" />
          </button>
        </form>
      </div>
    </>
  );
});

export default SingleChat;

const AllMessages = styled.div`
  height: 80%;
  width: 95%;

  .MessageBody {
    height: 100%;
    width: 100%;
    overflow-y: scroll;
    padding: 0;
    margin: 0;

    &::-webkit-scrollbar {
      width: 0.5em;
      background-color: transparent;
    }

    &::-webkit-scrollbar-track {
      background-color: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #373737;
      border-radius: 10px;
    }

    .refDIV {
      height: 1px;
      width: 1px;
    }

    .messageRight {
      display: flex;
      justify-content: flex-end;
      margin: 10px 5px 10px 0;
    }
    .messageLeft {
      display: flex;
      justify-content: flex-start;
      margin: 10px 0 10px 5px;
    }

    .leftMSG,
    .rightMSG {
      display: flex;
      justify-content: center;
      align-items: center;
      max-width: 95%;
      border-radius: 10px;
      word-wrap: break-word;
      p {
        padding: 2px;
        min-width: 50px;
        margin: 0;
        border-radius: 10px;
        color: white;
        text-align: center;

        span {
          color: rgba(255, 255, 255, 0.7);
          width: 100%;
          display: flex;
          align-items: flex-start;

          span {
            font-size: 0.8rem;
            margin: 5px 5px 0 5px;
            padding: 0;
            background-color: transparent;
            box-shadow: none;
          }

          img {
            width: 20px;
            height: 20px;
            border-radius: 50px;
            margin: 0 5px;
          }
        }
      }
    }

    .leftMSG {
      p {
        background-color: rgba(0, 255, 21, 0.7);
        box-shadow: 0 0 5px rgba(0, 255, 21, 0.765);
        span {
          justify-content: flex-start;
          flex-direction: row-reverse;

          span {
            justify-content: start;
          }
        }
      }
    }
    .rightMSG {
      p {
        background-color: rgba(200, 0, 255, 0.7);
        box-shadow: 0 0 5px rgba(200, 0, 255, 0.765);
        span {
          justify-content: flex-end;
          flex-direction: row;

          span {
            justify-content: end;
          }
        }
      }
    }
  }
`;
