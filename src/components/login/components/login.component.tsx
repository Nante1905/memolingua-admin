import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import "./login.component.scss";

const Login = () => {
  const [viewPassword, setViewPassword] = useState(false);

  return (
    <div id="login">
      <div className="left-side">
        <h1 className="main-title text-center">Mémolingua</h1>
      </div>
      <div className="right-side">
        <div className="form-container">
          <form className="form">
            <div className="form-input">
              <h2 className="text-center">Admin</h2>
            </div>
            <div className="form-input">
              <TextField label="Email" />
            </div>
            <div className="form-input">
              <TextField
                label="Mot de passe"
                type={viewPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => {
                          setViewPassword(!viewPassword);
                        }}
                        edge="end"
                      >
                        {viewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <p className="paragraph">
                <small>Mot de passe oublié ?</small>
              </p>
            </div>
            <div className="form-submit">
              <Button color="secondary" variant="contained">
                Se connecter
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
