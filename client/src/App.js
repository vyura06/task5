import { useState } from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import StartPage from "./components/StartPage/StartPage";
import NotExistingPage from "./components/NotExistingPage";
import Messages from "./components/Messages";
import Message from "./components/Message/Message";
import SendMessage from "./components/SendMessage/SendMessage";
import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<StartPage setCurrentUser={setCurrentUser} />} />
          <Route path="/messages" element={<Messages currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
          <Route path="/send-message" element={<SendMessage currentUser={currentUser} />} />
          <Route path="/messages/:id" element={<Message currentUser={currentUser} />} />
          <Route path="*" element={<NotExistingPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
