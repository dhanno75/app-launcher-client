import React, { useState } from "react";
import { AiFillHome } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

let initialFormValues = {
  appName: "",
  appConfig: "",
  appIcon: "",
};

const Settings = () => {
  const [formDetails, setFormDetails] = useState(initialFormValues);
  const navigate = useNavigate();

  const handleChange = (e) => {
    e.preventDefault();
    setFormDetails({ ...formDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await fetch(
        "https://app-launcher-server.vercel.app/launcher",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formDetails),
        }
      );
      await data.json();
      // To make the input fields empty after submitting the form
      setFormDetails(initialFormValues);
      navigate(-1);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="form-wrapper">
        <div className="form-container">
          <h1>Add an app</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="appName"
              placeholder="App name"
              onChange={handleChange}
            />
            <input
              type="text"
              name="appConfig"
              placeholder="Config (URL of the app)"
              onChange={handleChange}
            />
            <input
              type="text"
              name="appIcon"
              placeholder="Image URL"
              onChange={handleChange}
            />
            <div className="btn">
              <button type="submit">Submit</button>
            </div>
          </form>
        </div>
      </div>
      <div className="settings home" onClick={() => navigate("/")}>
        <AiFillHome />
      </div>
    </>
  );
};

export default Settings;
