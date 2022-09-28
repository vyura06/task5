import { Editor } from 'primereact/editor';
import { AutoComplete } from "primereact/autocomplete";
import { Button } from 'primereact/button';
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import userService from '../../services/user.service';
import "./SendMessage.css";

function SendMessage({ currentUser }) {
  const location = useLocation();
  const reply_to = location?.state?.reply_to;
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState(reply_to?.message ?? "");
  const [selectedUsers, setSelectedUsers] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState(null);
  const [isReceiverSelected, setIsReceiverSelected] = useState(true);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      userService
        .getAllUsers()
        .then(data => {
          setUsers(data.users);
        });

      if (reply_to) {
        setSelectedUsers([{
          id: reply_to.sender_id,
          name: reply_to.sender
        }]);
      }
    }
  }, [currentUser, reply_to]);

  if (!currentUser) {
    return (
      <div className="alert-container">
        <Message style={{ margin: "50px 20px 0 0" }} severity="warn" text="Before visiting this page you have to enter the user name!" />
        <Button label="Enter name" icon="pi pi-arrow-right" iconPos="right" onClick={() => navigate("/")} />
      </div>
    )
  }

  const searchUsers = (event) => {
    setTimeout(() => {
      let _filteredUsers = [];
      if (!event.query.trim().length) {
        _filteredUsers = [...users];
      }
      else {
        _filteredUsers = users.filter((user) => {
          return user.name.toLowerCase().includes(event.query.toLowerCase());
        });
      }

      setFilteredUsers(_filteredUsers);
    }, 250);
  }

  const resetFields = () => {
    setTitle("");
    setSelectedUsers(null);
    setMessage("");
  }

  const changeSuccessAlertVisibility = () => {
    setShowSuccessAlert(true);
    setTimeout(() => {
      setShowSuccessAlert(false);
    }, 2000);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (selectedUsers === null || selectedUsers?.length === 0) {
      setIsReceiverSelected(false);
    } else {
      setIsReceiverSelected(true);
      selectedUsers.forEach(receiver => {
        userService.sendMessage({
          title,
          message,
          sender_id: currentUser.id,
          receiver_id: receiver.id,
          reply_message_id: reply_to ? reply_to?.id : null,
        })
      });
      
      resetFields();
      changeSuccessAlertVisibility();
    }
  }

  const handleSelectChange = (e) => {
    setSelectedUsers(e.value);
    setIsReceiverSelected(true);
  }

  return (
    <form style={{ margin: "0 auto",  width: 700 }} onSubmit={handleSubmit}>
      <h1 className="send-mail-header">Send message</h1>
      <span className="p-float-label">
        <InputText required autoComplete="off" name="name" style={{ width: "100%" }} id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <label htmlFor="title">Title</label>
      </span>
      <div className="p-fluid form__field" style={{ margin: "15px 0 20px" }}>
        <span>To: </span>
        <AutoComplete
          required
          disabled={reply_to !== undefined}
          className={{"p-invalid": !isReceiverSelected}}
          field="name"
          value={selectedUsers}
          suggestions={filteredUsers}
          completeMethod={searchUsers}
          onChange={handleSelectChange}
          aria-label="Receiver"
          multiple
        />
      </div>
      
      <Editor placeholder="Message" style={{ height:'320px' }} value={message} onTextChange={(e) => setMessage(e.htmlValue)} />
      <div className="form__buttons">
        <Button type="submit" onClick={() => navigate("/messages")} label="Return to messages" icon="pi pi-arrow-left" />
        <Button label="Send" icon="pi pi-send" iconPos="right" />
      </div>

      <Message className={`send-message-alert ${showSuccessAlert ? "appearing" : ""}`}
        severity="success" text="The message has been sent!" />
    </form>
  )
}

export default SendMessage;