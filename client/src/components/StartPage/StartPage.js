import { InputText } from 'primereact/inputtext';
import { Button } from "primereact/button";
import { useState } from 'react';
import userService from '../../services/user.service';
import "./StartPage.css";
import { useNavigate } from 'react-router-dom';

function StartPage({ setCurrentUser }) {
  const [name, setName] = useState("");
  const navigation = useNavigate();
  const [isDisabled, setIsDisabled] = useState(false);

  const handleSubmit = (e) => {
    setIsDisabled(true);
    e.preventDefault();

    setName(name.trim());
    
    userService
      .createUser(name)
      .then(res => {
        setCurrentUser(res.user);
        setName("");
        setIsDisabled(false);
        navigation("/messages");
      })
  }

  return (
    <div className="start-page">
      <form className="container" onSubmit={handleSubmit}>
        <span className="p-float-label" style={{ width: "100%" }}>
            <InputText
              id="username"
              name="name"
              autoComplete="off"
              style={{ width: "100%" }}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <label htmlFor="username">Username</label>
        </span>
        <Button
          disabled={isDisabled}
          iconPos="right"
          loading={isDisabled}
          style={{ marginTop: 25 }}
          label="Submit"
          aria-label="Submit"
        />
      </form>
    </div>
  )
}

export default StartPage;