import { zodResolver } from "@hookform/resolvers/zod";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Button,
  IconButton,
  InputAdornment,
  LinearProgress,
  TextField,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ApiResponse } from "../../../shared/types/ApiResponse";
import { loginSchema } from "../helpers/login.helper";
import { logIn } from "../service/login.service";
import "./login.component.scss";

const Login = () => {
  const [viewPassword, setViewPassword] = useState(false);
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; pwd: string }) => {
      return logIn(data);
    },
    onSuccess: (data) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: ApiResponse<any> = data.data;
      sessionStorage.setItem("accessToken", res.payload);
      navigate("/home");
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const submitForm = (data: any) => {
    const { email, password: pwd } = data;
    loginMutation.mutate({ email, pwd });
  };

  return (
    <div id="login">
      <div className="left-side">
        <h1 className="main-title text-center">Mémolingua</h1>
      </div>
      <div className="right-side">
        <div className="form-container">
          <form
            className={`form ${loginMutation.isPending && "loading"}`}
            onSubmit={form.handleSubmit(submitForm)}
          >
            <div className="form-input">
              <h2 className="text-center">Admin</h2>
            </div>
            <div className="form-input">
              <TextField
                label="Email"
                {...form.register("email")}
                error={!!form.formState.errors["email"]}
                helperText={form.formState.errors["email"]?.message as string}
              />
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
                {...form.register("password")}
                error={!!form.formState.errors["password"]}
                helperText={
                  form.formState.errors["password"]?.message as string
                }
              />
            </div>
            <div className="form-submit">
              {loginMutation.isError && (
                <p className="text-danger" color="error">
                  {loginMutation.error.message}
                </p>
              )}
              <Button color="secondary" variant="contained" type="submit">
                Se connecter
              </Button>
            </div>
            {loginMutation.isPending && (
              <>
                <div className="blur" />
                <LinearProgress
                  style={{ width: "100%" }}
                  className="linear-progress"
                />
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
