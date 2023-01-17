import { ChatMessage, ReceiveMsgRequest, Empty } from "../chat_pb";
import UsersList from "./UserList"
import Chat from "./Chat"
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"
import { ChatServiceClient } from "../chat_grpc_web_pb";

export default function ClientChatPage() {
    const [users, setUsers] = useState([]);
    const [msgList, setMsgList] = useState([]);
    const {state} = useLocation()
    const username = state.name;
    const chat_user = state.chat_user
    const [showTyping, setShowTyping] = useState(false)
  
    useEffect(() => {
      const strRq = new ReceiveMsgRequest();
      strRq.setUser(username);
      console.log(username)
  
      var chatStream = chat_user.receiveMsg(strRq, {});
      chatStream.on("data", (response) => {
        const from = response.getFrom();
        const msg = response.getMsg();
        const time = response.getTime();
        const to = response.getTo()
            console.log(from)

        if(msg === "Lose focus") {
          setShowTyping(false)
        } else if(msg === "Typing...") {
          if(from !== username && to === username)
          setShowTyping(true)
        } else {
          setShowTyping(false)
        if (from === username) {
          setMsgList((oldArray) => [
            ...oldArray,
            { from, msg, time, mine: true },
          ]);
        } 
        if (from === "admin1" && to === username ){
          setMsgList((oldArray) => [...oldArray, { from, msg, time }]);
        }
        }
        
      });
  
      chatStream.on("status", function (status) {
        console.log(status.code, status.details, status.metadata);
      });
  
      chatStream.on("end", () => {
        console.log("Stream ended.");
      });
    }, []);
  
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
  
    function sendMessage(message) {
      const msg = new ChatMessage();
      msg.setMsg(message);
      msg.setFrom(username);
      msg.setTo("admin1")
      msg.setTime(new Date().toLocaleString());
  
      chat_user.sendMsg(msg, null, (err, response) => {
        console.log(response);
      });
    }

   
    function sendTyping() {
      const msg = new ChatMessage();
      msg.setMsg("Typing...");
      msg.setFrom(username);
      msg.setTime(new Date().toLocaleString());
      msg.setTo("admin1")
      chat_user.sendMsg(msg, null, (err, response) => {
        console.log(response);
      });
    }

    function loseFocus() {
      const msg = new ChatMessage();
      msg.setMsg("Lose focus");
      msg.setFrom(username);
      msg.setTime(new Date().toLocaleString());
      msg.setTo("admin1")
      chat_user.sendMsg(msg, null, (err, response) => {
        console.log(response);
      });
    }

    function handleBlur() {
      console.log("papapapa")
      loseFocus()
    }

    return (
    <div>
        <div className = "row">
                <div className = "greenTitle"style={{marginLeft : 50, fontSize : 50}}>Energy Utility Platform</div>
         </div>
        <hr></hr>
      <div className="chatpage" style={{marginTop : 50}}>
        <div className="chatpage-section" style={{marginRight : 100, marginLeft : 100}}>
          <Chat msgList={msgList} sendMessage={sendMessage} sendTyping = { sendTyping} showTyping = {showTyping} handleBlur = { handleBlur}/>
        </div>
      </div>
      </div>
    );
  }