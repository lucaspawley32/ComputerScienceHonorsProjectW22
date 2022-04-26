import React, { Component } from "react";
import {Grid,Typography, FormControl, TextField,FormHelperText,Select,MenuItem,Button} from '@mui/material'
import { Checkbox } from "@mui/material";
export default class AddGame extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: this.props.game.hasOwnProperty('id')?this.getStatus(this.props.game.status):"Not Played",
            checked:this.props.game.hasOwnProperty('id')?this.props.game.owned:false,
            title:this.props.game.hasOwnProperty('id')?this.props.game.title:"",
            genre:this.props.game.hasOwnProperty('id')?this.props.game.genre:"",
            console:this.props.game.hasOwnProperty('id')?this.props.game.console:"",
            service:this.props.game.hasOwnProperty('id')?this.props.game.service:"",
            description:this.props.game.hasOwnProperty('id')?this.props.game.description:""
        }
        this.handleStatusChange = this.handleStatusChange.bind(this);
        this.handleOwnedChange = this.handleOwnedChange.bind(this);
        this.getStatus = this.getStatus.bind(this)
        this.createGame = this.createGame.bind(this)
        this.updateGame = this.updateGame.bind(this)
        this.getCookie = this.getCookie.bind(this)
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
    getStatus(status){
        switch(status){
            case 'NP':
                return "Not Played"
            case 'CP':
                return  "Currently Playing"
            case 'C':
                return  "Completed"
            case 'DNF':
                return  "Did Not Finish"  
        }
    }
    handleStatusChange(e){
        this.setState({
            status: e.target.value
        })
    }
    handleOwnedChange(e){
        console.log("test")
        this.setState({
            checked: e.target.checked
        })
    }
    createGame(){
        let payload = {
            title: this.state.title,
            genre: this.state.genre,
            console: this.state.console,
            service:this.state.service,
            description: this.state.description,
            owned: this.state.checked
        }
        switch(this.state.status){
            case 'Not Played':
                payload.status = "NP"
                break
            case 'Currently Playing':
                payload.status = "CP"
                break
            case 'Completed':
                payload.status = "C"
                break
            case 'Did Not Finish':
                payload.status = "DNF"
                break
        }
            
        fetch("/api/create-game",{
            method: "post",
            headers: { 
                "Content-Type": "application/json",
                'X-CSRFToken': this.getCookie('csrftoken')
             },
            body: JSON.stringify(payload)
        }).then(res=>res.json()).then(data => this.props.callBackFunction())
    }
    updateGame(){
        let payload = {
            title: this.state.title,
            genre: this.state.genre,
            console: this.state.console,
            service: this.state.service,
            description: this.state.description,
            owned: this.state.checked
        }
        switch(this.state.status){
            case 'Not Played':
                payload.status = "NP"
                break
            case 'Currently Playing':
                payload.status = "CP"
                break
            case 'Completed':
                payload.status = "C"
                break
            case 'Did Not Finish':
                payload.status = "DNF"
                break
        }
            
        fetch("/api/update-game/"+this.props.game.id,{
            method: "put",
            headers: { 
                "Content-Type": "application/json",
                'X-CSRFToken': this.getCookie('csrftoken')
             },
            body: JSON.stringify(payload)
        }).then(res=>res.json()).then(data => this.props.callBackFunction())
    }
    render() {
        console.log(this.state)
        return (
            <Grid container spacing={1}>
                <Grid xs={12} item align="center">
                <Typography component="h4" variant="h4">{this.props.create? "Add Game":"Edit Game"}</Typography>
                </Grid>
                <Grid xs={12} item align="center">
                    <FormControl>
                        <TextField
                            required={true}
                            value={this.state.title}
                            onChange={e=>{
                                this.setState({
                                    title: e.target.value
                                })
                            }}
                        />
                        <FormHelperText><div align="center">Title</div></FormHelperText>
                    </FormControl>
                    <FormControl>
                        <TextField
                            required={true}
                            value={this.state.genre}
                            onChange={e=>{
                                this.setState({
                                    genre: e.target.value
                                })
                            }}
                        />
                        <FormHelperText><div align="center">Genre</div></FormHelperText>
                    </FormControl>
                    <FormControl>
                        <TextField
                            required={true}
                            value={this.state.console}
                            onChange={e=>{
                                this.setState({
                                    console: e.target.value
                                })
                            }}
                        />
                        <FormHelperText><div align="center">Console</div></FormHelperText>
                    </FormControl>
                </Grid>
                <Grid xs={12} item align="center">
                    <FormControl>
                        <Select
                            value={this.state.status}
                            onChange={this.handleStatusChange}
                        >
                            <MenuItem value={"Not Played"}>Not Played</MenuItem>
                            <MenuItem value={"Currently Playing"}>Currently Playing</MenuItem>
                            <MenuItem value={"Completed"}>Completed</MenuItem>
                            <MenuItem value={"Did Not Finish"}>Did Not Finish</MenuItem>
                        </Select>
                        <FormHelperText><div align="center">status</div></FormHelperText>
                    </FormControl>
                    <FormControl>
                        <TextField
                            required={true}
                            value={this.state.service}
                            onChange={e=>{
                                this.setState({
                                    service: e.target.value
                                })
                            }}
                        />
                        <FormHelperText><div align="center">Service</div></FormHelperText>
                    </FormControl>
                </Grid>
                <Grid xs={12} item align="center">
                    <FormControl>
                        <Checkbox
                            checked={this.state.checked}
                            onChange={this.handleOwnedChange}
                        />
                        <FormHelperText><div align="center">Owned</div></FormHelperText>
                    </FormControl>
                </Grid>
                <Grid xs={12} item align="center">
                    <FormControl>
                        <TextField
                            multiline
                            value={this.state.description}
                            onChange={e=>{
                                this.setState({
                                    description: e.target.value
                                })
                            }}
                        />
                        <FormHelperText><div align="center">description (multiline field)</div></FormHelperText>
                    </FormControl>
                </Grid>
                <Grid xs={12} item align="center">
                {
                        this.props.create?(<Button variant="contained" onClick={this.createGame}>Create</Button>):<Button variant="contained" onClick={this.updateGame}>Update</Button>
                    }
                </Grid>
            </Grid>
        );
    }
}