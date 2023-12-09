import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import { Popover } from "antd";
import { AiFillHome, AiFillSetting } from "react-icons/ai";
import { SlOptionsVertical } from "react-icons/sl";
import { HiPencil, HiTrash } from "react-icons/hi2";
import { RotatingLines } from "react-loader-spinner";
import {
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useMediaQuery,
  Button,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

const Launcher = () => {
  const [apps, setApps] = useState([]);
  const [delay, setDelay] = useState(false);
  const [open, setOpen] = useState(false);
  const [appName, setAppName] = useState("");
  const [appConfig, setAppConfig] = useState("");
  const [appIcon, setAppIcon] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const setAppData = (app) => {
    console.log(app);
    localStorage.setItem("appId", app._id);
    setAppName(app.appName);
    setAppConfig(app.appConfig);
    setAppIcon(app.appIcon);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`https://app-launcher-server.vercel.app/launcher/${id}`, {
        method: "DELETE",
      });
      fetchApps();
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = async (id) => {
    try {
      const data = await fetch(
        `https://app-launcher-server.vercel.app/launcher/${id}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ appName, appConfig, appIcon }),
        }
      );
      await data.json();
      fetchApps();
    } catch (err) {
      console.log(err);
    }
  };

  const fetchApps = async () => {
    try {
      const details = await fetch(
        "https://app-launcher-server.vercel.app/launcher"
      );
      const { data } = await details.json();
      setApps(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleClick = (link) => {
    setDelay(true);
    setTimeout(() => {
      window.location.href = link;
      setDelay(false);
    }, 3000);
  };

  useEffect(() => {
    fetchApps();
  }, []);

  return (
    <div className="launcher" style={{ height: "100vh" }}>
      <Container style={{ padding: "50px" }}>
        <h1 className="header">app launcher</h1>
        <div className="wrapper">
          {delay ? (
            <div className="loader">
              <RotatingLines
                strokeColor="grey"
                strokeWidth="5"
                animationDuration="0.75"
                width="96"
                visible={true}
              />
              <AiFillHome
                onClick={() => window.location.reload(false)}
                style={{
                  cursor: "pointer",
                  color: "rgb(112,130,246)",
                  fontSize: "90px",
                }}
              />
            </div>
          ) : (
            apps.map((el) => (
              <div
                key={el._id}
                style={{
                  cursor: "pointer",
                  borderRadius: "10px",
                  boxShadow: "0 8px 10px 8px rgba(0,0,0,0.2)",
                  padding: "7px",
                }}
              >
                <div
                  className="image-wrapper"
                  onClick={() => handleClick(el.appConfig)}
                >
                  <img src={el.appIcon} alt={el.appName} className="icon" />
                </div>
                <div className="app-name-wrapper">
                  <div className="app-name">{el.appName}</div>
                  <Popover
                    placement="bottom"
                    content={
                      <div className="pop">
                        <ul>
                          <li
                            onClick={() => {
                              handleClickOpen();
                              setAppData(el);
                            }}
                          >
                            <HiPencil /> <span> Edit</span>
                          </li>
                          <li onClick={() => handleDelete(el._id)}>
                            <HiTrash /> <span> Delete</span>
                          </li>
                          {el._id === localStorage.getItem("appId") ? (
                            <Dialog
                              fullScreen={fullScreen}
                              open={open}
                              onClose={handleClose}
                              aria-labelledby="responsive-dialog-title"
                            >
                              <DialogTitle id="responsive-dialog-title">
                                {"Edit your app"}
                              </DialogTitle>
                              <DialogContent>
                                <TextField
                                  autoFocus
                                  margin="dense"
                                  id="name"
                                  label="App Name"
                                  type="text"
                                  value={appName}
                                  onChange={(e) => setAppName(e.target.value)}
                                  name="title"
                                  fullWidth
                                  variant="standard"
                                />
                                <TextField
                                  autoFocus
                                  margin="dense"
                                  id="name"
                                  label="Config"
                                  type="text"
                                  onChange={(e) => setAppConfig(e.target.value)}
                                  value={appConfig}
                                  name="text"
                                  fullWidth
                                  variant="standard"
                                  style={{ marginBottom: "6px" }}
                                />
                                <TextField
                                  autoFocus
                                  margin="dense"
                                  id="name"
                                  label="Image URL"
                                  type="text"
                                  onChange={(e) => setAppIcon(e.target.value)}
                                  value={appIcon}
                                  name="text"
                                  fullWidth
                                  variant="standard"
                                  style={{ marginBottom: "6px" }}
                                />
                              </DialogContent>
                              <DialogActions>
                                <Button autoFocus onClick={handleClose}>
                                  Cancel
                                </Button>
                                <Button
                                  onClick={() => {
                                    handleClose();
                                    handleEdit(el._id);
                                  }}
                                  autoFocus
                                >
                                  Edit
                                </Button>
                              </DialogActions>
                            </Dialog>
                          ) : (
                            ""
                          )}
                        </ul>
                      </div>
                    }
                  >
                    <SlOptionsVertical />
                  </Popover>
                </div>
              </div>
            ))
          )}
        </div>
      </Container>
      <div className="settings" onClick={() => navigate("/settings")}>
        <AiFillSetting className="settings-icon" />
      </div>
    </div>
  );
};

export default Launcher;
