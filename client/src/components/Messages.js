import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { SplitButton } from "primereact/splitbutton";
import { Message } from "primereact/message";
import { Button } from 'primereact/button';
import { useEffect, useState } from 'react';
import { PrimeIcons } from 'primereact/api';
import { useNavigate } from 'react-router-dom';
import userService from '../services/user.service';
// import "./Messages.css";

function Messages({ currentUser, setCurrentUser }) {
  const [messages, setMessages] = useState([]);
  const [senders, setSenders] = useState(new Map());
  const [newMessagesCheck, setNewMessagesCheck] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      const getMessages = () => {
        userService
          .getAllUsersBySenderId()
          .then(data => {
            const map = new Map();
            data.users.forEach(user => {
              map.set(user.sender_id, user);
            });
            setSenders(map);
          });
        userService
          .getUserMessages(currentUser)
          .then(data => {
            const messgs = data.messages.sort(
              (a, b) => new Date(b.created_date) - new Date(a.created_date)
            );
            setMessages(messgs);
          });
      }

      getMessages();

      setNewMessagesCheck(
        setInterval(getMessages, 5000)
      );
    }
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="alert-container">
        <Message style={{ margin: "50px 20px 0 0" }} severity="warn" text="Before visiting this page you have to enter the user name!" />
        <Button label="Enter name" icon="pi pi-arrow-right" iconPos="right" onClick={() => navigate("/")} />
      </div>
    )
  }

  const items = [
    {
        label: 'Refresh name',
        icon: 'pi pi-refresh',
        command: (e) => {
          setCurrentUser(null);
          clearInterval(newMessagesCheck);
          navigate("/");
        }
    },
  ];

  const handleGoToMail = (id) => {
    clearInterval(newMessagesCheck);
    navigate(`/messages/${id}`, { state: { id } });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <SplitButton
          icon={PrimeIcons.SEND}
          style={{ margin: "25px 0" }}
          model={items}
          label="Send message"
          aria-label="Submit"
          onClick={() => navigate("/send-message")}
        />
      <div className="container">
        <DataTable value={messages} responsiveLayout="scroll">
          <Column field="title" header="Title" body={
            ({title}) => <div className="title-field field_limited">{title}</div>
          }/>
          <Column field="sender_id" header="From" body={
            ({sender_id}) => <div className="field_limited">{senders.get(sender_id)?.name}</div>
          }/>
          <Column field="created_date" header="Date" body={
            ({created_date}) => <div>{created_date}</div>
          }/>
          <Column body={
            ({id}) => <Button
              onClick={() => handleGoToMail(id)}
              tooltip="Go to mail"
              tooltipOptions={{position: 'bottom'}}
              icon="pi pi-arrow-right"
              className="p-button p-button-info p-button-outlined"
            />
          }/>
        </DataTable>
      </div>
    </div>
  )
}

export default Messages;