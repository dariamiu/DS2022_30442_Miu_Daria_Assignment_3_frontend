import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import AdminAddClient from "./components/AdminAddClient";
import AdminAddDevice from "./components/AdminAddDevice";
import AdminInitialView from "./components/AdminInitialView";
import AdminManageClients from "./components/AdminManageClients";
import AdminManageDevices from "./components/AdminManageDevices";
import LoginAdmin from "./components/LoginAdmin";
import LoginClient from "./components/LoginClient";
import StartPage from "./components/StartPage";
import ClientInitialView from "./components/ClientInitialView";
import ClientChatPage from "./components/ClientChatPage";
import AdminChatPage from "./components/AdminChatPage";
import ChatAdmin from "./components/ChatAdmin";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path ="/" element={<StartPage />} />
        <Route exact path="/client" element={<LoginClient/>}/>
        <Route exact path="/admin" element={<LoginAdmin />}/>
        <Route exact path="/admin/initial-view" element={<AdminInitialView />}/>
        <Route exact path="/admin/add-client" element={<AdminAddClient/>}/>
        <Route exact path="/admin/add-device" element={<AdminAddDevice/>}/>
        <Route exact path="/admin/manage-devices" element={<AdminManageDevices/>}/>
        <Route exact path="/admin/manage-clients" element={<AdminManageClients/>}/>
        <Route exact path="/client/initial-view" element={<ClientInitialView/>}/>
        <Route exact path="/client/chat-page" element={<ClientChatPage/>}/>
        <Route exact path="/admin/chat-page" element={<AdminChatPage/>}/>
        <Route exact path="/admin/chat-with-client" element={<ChatAdmin/>}/>
      </Routes>
    </Router>
  );
}

export default App;
