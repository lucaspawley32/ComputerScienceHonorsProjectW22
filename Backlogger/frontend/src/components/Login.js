import React, { Component } from "react";
import { useNavigate } from "react-router-dom";
import {Box,Grid, Typography,TextField,Button} from '@material-ui/core'
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Alert, IconButton, Input, InputAdornment } from "@mui/material";
const columns = [
    {field: "game", headerName: "Game", width:150},
    {field: "game", headerName: "Game", width:150},
    {field: "game", headerName: "Game", width:150},
    {field: "game", headerName: "Game", width:150},
    {field: "game", headerName: "Game", width:150},
    {field: "game", headerName: "Game", width:150},
]
class Login extends Component {
    constructor(props) {
        super(props);
        this.state={
            username:"",
            password:"",
            error:false,
            errText:"",
            passwordVisible:false
        }
        this.handleUsernameChange = this.handleUsernameChange.bind(this)
        this.handlePasswordChange = this.handlePasswordChange.bind(this)
        this.handleLogin = this.handleLogin.bind(this)
        this.handleVisibilityButtonPressed = this.handleVisibilityButtonPressed.bind(this)
        console.log("3")
    }
    handleUsernameChange(e){
        this.setState({
            username:e.target.value
        })
    }
    handlePasswordChange(e){
        this.setState({
            password:e.target.value
        })
    }
    handleVisibilityButtonPressed(){
        this.setState({
            passwordVisible: !this.state.passwordVisible
        })
    }
    handleLogin(){
        console.log(this.props)
        fetch('/api/login', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                'username': this.state.username,
                'password': this.state.password
            })
        }).then(response=>response.json()).then(response=>{
            if(response.data.authorized == true){
                this.props.authorized = true
                this.props.navigate('/')
            }else{
                this.setState({
                    error:true,
                    errText:"Username or Password incorrect"
                })
            }
        })
    }

    render() {
        return (
            <Box
                sx={{
                    width: 300,
                    height: 300,
                    margin:"auto"
                }}
            >
                {
                    this.state.error?<Alert severity="error">{this.state.errText}</Alert>:<div></div>
                }
                <Grid container spacing={1}>
                    <Grid item xs={12} align="center">
                        <Typography variant="h3">
                            Login
                        </Typography>
                    </Grid>
                    <Grid item xs={12} align="center">
                        <TextField
                            required
                            id="username"
                            label="Username"
                            fullWidth
                            value={this.state.username}
                            onChange={this.handleUsernameChange}
                        />
                    </Grid>
                    <Grid item xs={12} align="center">
                        <TextField
                            required
                            id="password"
                            label="Password"
                            type= {this.state.passwordVisible? "text": "password"}
                            InputProps={{
                                endAdornment:(
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="Toggle password visibility"
                                            onClick={this.handleVisibilityButtonPressed}
                                        >
                                            {this.state.passwordVisible? <VisibilityOff />: <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                            
                            fullWidth
                            value={this.state.password}
                            onChange={this.handlePasswordChange}
                        />
                    </Grid>
                    <Grid item xs={12} align="center">
                        <Button fullWidth variant="contained" color="primary" onClick={this.handleLogin}>Login</Button>
                    </Grid>
                    <Grid item xs={12} align="right">
                        <a href="/register">Register</a>
                    </Grid>
                </Grid>
            </Box>
            
        )
    }
}

export default function(props) {
    const navigate = useNavigate();
    return <Login {...props} navigate={navigate} />
}