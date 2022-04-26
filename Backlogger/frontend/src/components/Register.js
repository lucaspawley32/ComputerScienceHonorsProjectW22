import React, { Component } from "react";
import { useNavigate } from "react-router-dom";
import {Box,Grid, Typography,TextField,Button} from '@material-ui/core'
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Alert,IconButton, InputAdornment } from "@mui/material";
const columns = [
    {field: "game", headerName: "Game", width:150},
    {field: "game", headerName: "Game", width:150},
    {field: "game", headerName: "Game", width:150},
    {field: "game", headerName: "Game", width:150},
    {field: "game", headerName: "Game", width:150},
    {field: "game", headerName: "Game", width:150},
]
class Register extends Component {
    constructor(props) {
        super(props);
        this.state={
            fName: "",
            lName: "",
            email:"",
            username:"",
            password:"",
            confirmPassword:"",
            passwordVisible:false,
            error:false,
            errMsg:""
        }
        this.handleUsernameChange = this.handleUsernameChange.bind(this)
        this.handleFirstNameChange = this.handleFirstNameChange.bind(this)
        this.handleLastNameChange = this.handleLastNameChange.bind(this)
        this.handleEmailChange = this.handleEmailChange.bind(this)
        this.handlePasswordChange = this.handlePasswordChange.bind(this)
        this.handleConfirmPasswordChange = this.handleConfirmPasswordChange.bind(this)
        this.handleLogin = this.handleLogin.bind(this)
        this.handleVisibilityButtonPressed = this.handleVisibilityButtonPressed.bind(this)
        this.getCookie = this.getCookie.bind(this)
        this.validateMinimumLength = this.validateMinimumLength.bind(this)
        this.validatenumeric = this.validatenumeric.bind(this)
        this.validatePasswordsMatch = this.validatePasswordsMatch.bind(this)
        console.log("5")
    }
    getCookie(name) {
        let cookieValue = null;
    
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
    
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
    
                    break;
                }
            }
        }
    
        return cookieValue;
    }
    validateMinimumLength(password){
        if (password.length > 8){
            return true
        }else{
            return false
        }
    }
    validatenumeric(password){
        for(let i = 0; i< password.length; i++){
            if (!(password[i] == "0" || password[i] == "1" || password[i] == "2" || password[i] == "3" || 
                password[i] == "4" || password[i] == "5" || password[i] == "6" || password[i] == "7" || 
                password[i] == "8" || password[i] == "9")){
                    return true
                }
        }
        return false
    }
    validatePasswordsMatch(passwordA,passwordB){
        if (passwordA === passwordB){
            return true
        }else{
            return false
        }
    }
    handleFirstNameChange(e){
        this.setState({
            fName:e.target.value
        })
    }
    handleLastNameChange(e){
        this.setState({
            lName:e.target.value
        })
    }
    handleEmailChange(e){
        this.setState({
            email:e.target.value
        })
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
    handleConfirmPasswordChange(e){
        this.setState({
            confirmPassword:e.target.value
        })
    }
    handleVisibilityButtonPressed(){
        this.setState({
            passwordVisible: !this.state.passwordVisible
        })
    }
    handleLogin(){
        //check for password errors
        let error = false
        let errMsg = ""
        if (!this.validateMinimumLength(this.state.password)){
            errMsg = errMsg + "password must be at least 9 characters long,"
            error = true
        }
        if (!this.validatenumeric(this.state.password)){
            errMsg = errMsg + "password must contain at least one non-numeric character,"
            error = true
        }
        if (!this.validatePasswordsMatch(this.state.password,this.state.confirmPassword)){
            errMsg = errMsg + "passwords do not match"
            error = true
        }
        this.setState({
            error:error,
            errMsg: errMsg
        })

        if(!error){
            fetch('/api/register', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'X-CSRFToken': this.getCookie('csrftoken')
                },
                body: JSON.stringify({
                    'fName':this.state.fName,
                    'lName':this.state.fName,
                    'email':this.state.email,
                    'username': this.state.username,
                    'password': this.state.password
                })
            }).then(response=>response.json()).then(response=>{
                console.log(response)
                if(response.data.authorized == true){
                    this.props.authorized = true
                    this.props.navigate('/')
                }
            })
        }
        
    }

    render() {
        console.log(this.state)
        return (
            <Box
                sx={{
                    width: 300,
                    height: 300,
                    margin:"auto"
                }}
            >
                {
                    this.state.error?<Alert severity="error">{this.state.errMsg}</Alert>:<div></div>
                }
                <Grid container spacing={1}>
                    <Grid item xs={12} align="center">
                        <Typography variant="h3">
                            Register
                        </Typography>
                    </Grid>
                    <Grid item xs={6} align="center">
                        <TextField
                            required
                            id="firstName"
                            label="First Name"
                            fullWidth
                            value={this.state.fName}
                            onChange={this.handleFirstNameChange}
                        />
                    </Grid>
                    <Grid item xs={6} align="center">
                        <TextField
                            required
                            id="lastName"
                            label="Last Name"
                            fullWidth
                            value={this.state.lName}
                            onChange={this.handleLastNameChange}
                        />
                    </Grid>
                    <Grid item xs={12} align="center">
                        <TextField
                            required
                            id="email"
                            label="Email"
                            fullWidth
                            value={this.state.email}
                            onChange={this.handleEmailChange}
                        />
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
                        <TextField
                            required
                            id="confirmPassword"
                            label="Confirm Password"
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
                            value={this.state.confirmPassword}
                            onChange={this.handleConfirmPasswordChange}
                        />
                    </Grid>
                    <Grid item xs={12} align="center">
                        <Button fullWidth variant="contained" color="primary" onClick={this.handleLogin}>Register</Button>
                    </Grid>
                    <Grid item xs={12} align="left">
                        <a href="/login">Already have an account? Login</a>
                    </Grid>
                </Grid>
            </Box>
            
        )
    }
}

export default function(props) {
    const navigate = useNavigate();
    return <Register {...props} navigate={navigate} />
}