import { ChatMessage, ReceiveMsgRequest, Empty } from "../chat_pb";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"
export default function ChatAdmin() {

    const [msgList, setMsgList] = useState([]);
    const [showTyping, setShowTyping] = useState(false)
    const {state} = useLocation()
    const activeUser = state.activeUser
    const username = state.username
    const chat_user = state.chat_user

    useEffect(() => {
        const strRq = new ReceiveMsgRequest();
        strRq.setUser(username);
        console.log(username)
    
        var chatStream = chat_user.receiveMsg(strRq, {});
        chatStream.on("data", (response) => {
          const from = response.getFrom();
          const msg = response.getMsg();
          const time = response.getTime();
          const to = response.getTo();
          
          if(msg === "Lose focus") {
            setShowTyping(false)
          } else if(msg === "Typing...") {
            if( from === activeUser)
                setShowTyping(true)
          } else {
            if (from === username) {
                console.log("hei")
                if( to === activeUser){
                    console.log("hei")
                    setMsgList((oldArray) => [...oldArray, { from, msg, time, mine:true }]);
                }   
          } else {
            if(from === activeUser) {     
                setMsgList((oldArray) => [...oldArray, { from, msg, time }]);
            }
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

    function sendMessage(message) {
        const msg = new ChatMessage();
        msg.setMsg(message);
        msg.setFrom(username);
        msg.setTime(new Date().toLocaleString());
        msg.setTo(activeUser)
        chat_user.sendMsg(msg, null, (err, response) => {
          console.log(response);
        });
      }
  
      function sendTyping() {
        const msg = new ChatMessage();
        msg.setMsg("Typing...");
        msg.setFrom(username);
        msg.setTime(new Date().toLocaleString());
        msg.setTo(activeUser)
        chat_user.sendMsg(msg, null, (err, response) => {
          console.log(response);
        });
      }
  
      function loseFocus() {
        const msg = new ChatMessage();
        msg.setMsg("Lose focus");
        msg.setFrom(username);
        msg.setTime(new Date().toLocaleString());
        msg.setTo(activeUser)
        chat_user.sendMsg(msg, null, (err, response) => {
          console.log(response);
        });
      }
  
      function handleBlur() {
        console.log("papapapa")
        loseFocus()
      }
    function handler() {
      var msg = window.msgTextArea.value;
      sendMessage(msg);
      window.msgTextArea.value = "";
    }
  
    return (
        <div>
                    <div className = "row">
                <div className = "greenTitle"style={{marginLeft : 50, fontSize : 50}}>Energy Utility Platform</div>
         </div>
        <hr></hr>
     { (activeUser!=='') && 
      <div className="chat" style={{marginTop : 50, marginRight : 100, marginLeft : 100}}>
        <div className="chat-header">
          <h3>Messages</h3>
        </div>
        <div className="chat-list">
          {msgList?.map((chat, i) => (
            <ChatCard chat={chat} key={i} />
          ))}
        </div>
        {
          showTyping &&  
          <div>
            "Typing..."
          </div>
        }
        <div className="chat-input">
          <div style={{ flex: "3 1 90%" }}>
            <textarea id="msgTextArea" onChange={sendTyping} onBlur = {handleBlur}/>
          </div>
          <div
            style={{
              paddingLeft: "5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <button onClick={handler} className="btn">Send</button>
          </div>
        </div>
      </div>
        }
        </div>
    );
  }

  function ChatCard({ chat }) {
    return (
      <>
        <div style={{ fontSize: "9px", marginLeft: "4px", paddingLeft: "8px" }}>
          <span>{chat?.from}</span>
        </div>
        <div
          className={
            chat?.mine ? "chatcard chatcard-mine" : "chatcard chatcard-friend"
          }
        >
          <div className="chatcard-msg">
            <span>{chat?.msg}</span>
          </div>
          <div className="chatcard-time">
            <span>{chat?.time}</span>
          </div>
        </div>
      </>
    );
  }