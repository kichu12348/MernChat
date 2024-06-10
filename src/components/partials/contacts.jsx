import styled from "styled-components";
import search from "../../assets/search.svg";
import threeDots from "../../assets/threeDots.svg";
import deleteBtnSVg from "../../assets/delete.svg";
import {useState } from "react";
import axios from "axios";
import { useSocket } from "../../context/socketContext";



export default function ContactsComp({
  query,
  queryContact,
  queryList,
  addContact,
  contact,
  openMessage,
  newdata,
  visibleQuery,
  setMessageOpen,
  messager,
  displayConatcts,
}) {

// state variables
  const[visibleDelete,setVisibleDelete] = useState(false);

//uid
const token = localStorage.getItem('uid');

//socket
const socket = useSocket();

//functions///

const ContactEnableOrDisable = (item) => {
  if(!visibleDelete)openMessage(item)
}

  const deleteContact = async (item) => {
    await axios.post('/user/deleteContact',{id:item.id ,token})
    displayConatcts()
    setVisibleDelete(false);
    socket.emit('contactDeleted',{id:item.id,userId:newdata.id,name:newdata.name});
  };

  const displayDelete = () => {
    if(contact.length === 0)return;
    setVisibleDelete(!visibleDelete);
  }



  return (
    <Contacts>
      <SearchBar visiblequery={visibleQuery && !visibleDelete ? "true" : "false" } onSubmit={e=>e.preventDefault()}>
        <input
          type="text"
          placeholder="Search"
          value={query}
          onChange={queryContact}
          onSubmit={e=>e.preventDefault()}
        />
        <img src={search} className="searchIMG" />
        <div className="searchQueryList">
          <ul>
            {queryList.map((item, index) => {
              return (
                <li key={index} onClick={() => addContact(item.id)}>
                  <img
                    src={`data:image/svg+xml;utf8,${encodeURIComponent(
                      item.profilePic
                    )}`}
                    alt="profilepic"
                  />
                  <p>{item.name}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </SearchBar>
      <ContactList visibledelete={visibleDelete.toString()}>
        <ul>
          {contact.map((item, id) => {
            return (
              <li key={id} onClick={() => ContactEnableOrDisable(item)}>
                <img
                  src={`data:image/svg+xml;utf8,${encodeURIComponent(
                    item.profilePic
                  )}`}
                  alt=""
                />
                <p>{item.name}</p>
                <img src={deleteBtnSVg} className="deletebtnSVg" onClick={()=>deleteContact(item)} />
              </li>
            );
          })}
        </ul>
      </ContactList>
      <div className="contactFooter">
        <img
          src={`data:image/svg+xml;utf8,${encodeURIComponent(
            newdata.profilePic
          )}`}
          alt="profile"
        />
        <p>{newdata.name}</p>
        <img src={threeDots} className="threeDots" onClick={()=>displayDelete()}/>
      </div>
    </Contacts>
  );
}

const Contacts = styled.div`
  height: 95%;
  width: 30%;
  border: none;
  border-radius: 30px;
  background-color: rgba(255, 255, 255, 0.199);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;

  .contactFooter {
    height: 10%;
    width: 100%;
    border: none;
    border-radius: 0 0 30px 30px;
    background-color: rgba(255, 255, 255, 0.199);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    color: #fff;
    position: relative;

    img {
      width: 2rem;
      height: 2rem;
      box-shadow: 0 0 5px 1px rgba(255, 255, 255, 0.577);
      border-radius: 50px;
    }

    p {
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0.5rem 0 0.5rem 0.5rem;
    }

    .threeDots {
      width: 1.5rem;
      height: 1.5rem;
      cursor: pointer;
      box-shadow: none;
      position: absolute;
      right: 10px;
    }
  }

  @media screen and (max-width:768px){
        width: 100%;
        height: 100%;
  }

`;

const SearchBar = styled.form`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-color: rgba(87, 87, 87, 0.7);
  border-radius: 30px;
  height: 5%;
  width: 95%;
  margin: 0.5rem;
  z-index: 8;
  position: relative;

  .searchQueryList {
    position: absolute;
    max-height: 10rem;
    top: 100%;
    left: 0;
    width: 100%;
    color: #fff;
    background-color: rgba(87, 87, 87, 0.9);
    border-radius: 10px;
    border: none;
    margin-top: 0.5rem;
    overflow-y: scroll;
    display: ${(props) => (props.visiblequery === "true" ? "block" : "none")};

    &::-webkit-scrollbar {
      width: 0.5rem;
      overflow: hidden;

      &-thumb {
        background-color: #3f3f3f;
        border-radius: 10px;
        height: 1px;
        margin: 0.5rem;
      }
    }

    ul {
      list-style: none;
      padding: 0.5rem;
      margin: 0;
      li {
        padding: 0.5rem;
        border-radius: 10px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 1rem;
        flex-direction: row;
        transition: 0.3s;

        &:hover {
          background-color: #3f3f3f;
        }
      }
    }
  }

  input {
    width: 90%;
    background-color: transparent;
    border-radius: 10px;
    outline: none;
    border: none;
    font-size: 1rem;
    color: #fff;
    font-weight: 600;
    margin-left: 0.5rem;
  }
  img {
    width: 1.5rem;
    height: 1.5rem;
    cursor: pointer;
    margin: 0.5rem;
  }
`;

const ContactList = styled.div`
  height: 95%;
  width: 100%;
  border: none;
  background: transparent;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  color: #fff;
  overflow-y: scroll;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 0.5rem;
    overflow: hidden;

    &-thumb {
      background-color: #3f3f3f;
      border-radius: 10px;
      height: 1px;
      margin: 0.5rem;
    }
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    width: 90%;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    li {
      padding: 1rem;
      width: 90%;
      border-radius: 10px;
      cursor: pointer;
      transition: 0.3s;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 1rem;
      flex-direction: row;
      position: relative;
      &:hover {
        background-color: rgba(63, 63, 63, 0.67);
      }

      img {
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        margin: 0.5rem;
      }

      p {
        font-size: 1.5rem;
        font-weight: 600;
        color: #fff;
      }

      .deletebtnSVg {
        width: 2rem;
        height: 2rem;
        cursor: pointer;
        position: absolute;
        right: 0;
        transition: all 0.3s ease-in-out;
        display: ${(props) => (props.visibledelete === "true" ? "block" : "none")};

        &:hover {
          transform: scale(1.1);
        }
      }
    }
  }
`;
