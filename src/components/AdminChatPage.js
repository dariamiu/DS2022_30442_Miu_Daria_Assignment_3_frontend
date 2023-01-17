import { ChatMessage, ReceiveMsgRequest, Empty } from "../chat_pb";
import Chat from "./Chat"
import ChatAdmin from "./ChatAdmin"
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { ChatServiceClient } from "../chat_grpc_web_pb";


export default function AdminChatPage() {
    const chat_user = new ChatServiceClient("http://localhost:8081", null, null);
    const [users, setUsers] = useState([]);
    const [msgList, setMsgList] = useState([]);
    const [msgList1, setMsgList1] = useState([]);
    const [msgList2,setMsgList2] = useState([])
    //const {state} = useLocation()
    const navigate = useNavigate()
    const username = "admin1"
   // const chat_user = state.chat_user
    const [showTyping, setShowTyping] = useState(false)
    const [activeUser, setActiveUser] = useState('')
    const [conversations,setConversations] = useState([]);

    // useEffect(() => {
    //   const strRq = new ReceiveMsgRequest();
    //   strRq.setUser(username);
    //   console.log(username)
  
    //   var chatStream = chat_user.receiveMsg(strRq, {});
    //   chatStream.on("data", (response) => {
    //     const from = response.getFrom();
    //     const msg = response.getMsg();
    //     const time = response.getTime();
    //     const to = response.getTo();
        
    //     if(msg === "Lose focus") {
    //       setShowTyping(false)
    //     } else if(msg === "Typing...") {
    //       if(from !== username)
    //       setShowTyping(true)
    //     } else {
    //       if (from === username) {
    //       //var messages = map.get(currentConvo)
    //       //if (messages == null) {
    //      //   messages = []
    //      // }
        
    //       //map.set(from, [...messages, {from,msg,time,mine: true}] )
    //       if( to === "anamaria") {
    //           setMsgList1((oldArray) => [
    //        ...oldArray,
    //          { from, msg, time, mine: true },
    //       ]);
    //       }
    //       if ( to === "daria") {
    //         setMsgList2((oldArray) => [
    //           ...oldArray,
    //             { from, msg, time, mine: true },
    //          ]);
    //       }
          
    //     } else {
    //       //const messages = map.get(from)
    //       //map.set(from, [...messages, {from,msg,time}])
    //       if( to === "anamaria") {
    //         setMsgList1((oldArray) => [
    //      ...oldArray,
    //        { from, msg, time },
    //     ]);
    //     }
    //     if ( to === "daria") {
    //       setMsgList2((oldArray) => [
    //         ...oldArray,
    //           { from, msg, time },
    //        ]);
    //     }
    //     //setMsgList((oldArray) => [...oldArray, { from, msg, time }]);
    //     }
    //     }
        
    //   });
  
    //   chatStream.on("status", function (status) {
    //     console.log(status.code, status.details, status.metadata);
    //   });
  
    //   chatStream.on("end", () => {
    //     console.log("Stream ended.");
    //   });
    // }, []);
  
    useEffect(() => {
      getAllUsers();
    }, []);
  
    function getAllUsers() {
      chat_user.getAllUsers(new Empty(), null, (err, response) => {
        let usersList = response?.getUsersList() || [];
        usersList = usersList
          .map((user) => {
            return {
              id: user.array[0],
              name: user.array[1],
            };
          })
          .filter((u) => u.name !== username);
        setUsers(usersList);
      });
    }
  
    // function sendMessage(message) {
    //   const msg = new ChatMessage();
    //   msg.setMsg(message);
    //   msg.setFrom(username);
    //   msg.setTime(new Date().toLocaleString());
    //   console.log(activeUser)
    //   msg.setTo("anamaria")
    //   chat_user.sendMsg(msg, null, (err, response) => {
    //     console.log(response);
    //   });
    // }

    // function sendTyping() {
    //   const msg = new ChatMessage();
    //   msg.setMsg("Typing...");
    //   msg.setFrom(username);
    //   msg.setTime(new Date().toLocaleString());
    //   msg.setTo(activeUser)
    //   chat_user.sendMsg(msg, null, (err, response) => {
    //     console.log(response);
    //   });
    // }

    // function loseFocus() {
    //   const msg = new ChatMessage();
    //   msg.setMsg("Lose focus");
    //   msg.setFrom(username);
    //   msg.setTime(new Date().toLocaleString());
    //   msg.setTo(activeUser)
    //   chat_user.sendMsg(msg, null, (err, response) => {
    //     console.log(response);
    //   });
    // }

    // function handleBlur() {
    //   console.log("papapapa")
    //   loseFocus()
    // }

    function UserCard({ user, onClick}) {
      return (
        <div className="usercard" onClick={onClick}>
          <div className="usercard-img"></div>
          <div>
            <div className="usercard-name">
              <h3>{user?.name || "No Username"}</h3>
            </div>
          </div>
        </div>
      );
    }

    const showChat = ({user,e}) => {
        // e.preventDefault()
        // const temp = [...conversations]
        // if(!temp.find((str) => str === user.name)){
        //    temp.push(user.name)
        //    setConversations({conversations:temp})
        // }

        navigate('/admin/chat-with-client',
        {
            state: {
                activeUser : user.name,
                username : username,
                chat_user : chat_user
            }
        })

    
    }
  
    return (
    <div>
        <div className = "row">
                <div className = "greenTitle"style={{marginLeft : 50, fontSize : 50}}>Energy Utility Platform</div>
         </div>
        <hr></hr>
      <div className="chatpage" style={{marginTop : 50}}>
        <div className="userslist-section">
          <div
            style={{ paddingBottom: "4px", borderBottom: "1px solid darkgray" }}
          >
            <div>
              <button onClick={getAllUsers} className="btn">REFRESH</button>
            </div>
            {/* <div>
              <span>
                Logged in as <b>{username}</b>
              </span>
            </div> */}
          </div>
          <div className="userslist">
        {users?.map((user, i) => {
          return <UserCard user={user} key={i} onClick={(e) => showChat({user,e})}/>;
        })}
      </div>
        </div>
        {/* <div className="chatpage-section"> */}
          {/* {conversations?.map((child,index) => {return <ChatAdmin key={index} activeUser={child} username={username} chat_user={chat_user}/>}) }
          <Chat msgList={msgList} sendMessage={sendMessage} sendTyping = {sendTyping} showTyping = {showTyping} handleBlur = { handleBlur} /> */}
        {/* </div> */}
      </div>
      </div>
    );
  }