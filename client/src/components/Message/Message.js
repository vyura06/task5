import { Button } from "primereact/button";
import { Divider } from 'primereact/divider';
import { SplitButton } from 'primereact/splitbutton';
import { Editor } from 'primereact/editor';
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import userService from "../../services/user.service";
import "./Message.css";

function Message({ currentUser }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (location.state.id && currentUser) {
      userService
        .getMessage(currentUser, location.state.id)
        .then(data => {
          setMessage(data.message);
        });
    }
  }, [currentUser, location.state.id]);

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
        label: 'Reply to mail',
        icon: 'pi pi-reply',
        command: (e) => {
          const replyMessageSetup = `<br/><br/><br/>
            ____________________________________________<br/><br/>
            <strong>From:</strong> ${message.sender}<br/>
            <strong>Sent:</strong> ${message.created_date}<br/>
            <strong>To:</strong> ${message.receiver}<br/>
            <strong>Title:</strong> ${message.title}<br/><br/>` + message.message;

          message.message = replyMessageSetup;
          navigate("/send-message", { state: { reply_to: message } })
        }
    },
  ];

  return (
    <div className="message container" style={{ border: "none" }}>
      <div className="message__actions">
        <SplitButton
            icon="pi pi-arrow-left"
            className="p-button-sm p-button-outlined p-button-secondary"
            label="Return to messages"
            model={items}
            aria-label="Return"
            onClick={() => navigate("/messages")}
          />
      </div>
      <section className="message__header">
        <h2 className="message__title">{message?.title}</h2>
        <small className="message__created">{message?.created_date}</small>
      </section>
      <section className="message__info">
        <div style={{ marginBottom: 10 }}>
          <span>From: </span>
          <Button className="p-button p-button-outlined p-button-help p-button-sm" label={message?.sender} />
        </div>
        <div style={{ marginBottom: 10 }}>
          <span>To: </span>
          <Button className="p-button p-button-outlined p-button-secondary p-button-sm" label={message?.receiver} />
        </div>
      </section>
      <Divider align="center" style={{ marginBottom: 20 }}>
        <i className="pi pi-envelope" style={{ marginRight: 7, opacity: 0.4, fontSize: 12 }} />
        <small className="divider__text">Message</small>
      </Divider>
      
      <Editor readOnly="true" headerTemplate={[]} style={{ width: 640 }} value={message?.message} disabled />
      {/* <section className="message__body" dangerouslySetInnerHTML={{__html: message?.message }} /> */}
    </div>
  );
}

export default Message;