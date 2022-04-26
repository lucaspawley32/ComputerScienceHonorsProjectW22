import React, { Component } from "react";
import {Grid,Typography, FormControl, TextField,FormHelperText,Select,MenuItem,Button} from '@mui/material'
import { Checkbox } from "@mui/material";
export default class AddList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title:this.props.list.hasOwnProperty('id')?this.props.list.title:""
        }
        this.createList = this.createList.bind(this)
        this.updateList = this.updateList.bind(this)
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
    createList(){
        let payload = {
            title: this.state.title
        }
        fetch("/api/create-list",{
            method: "post",
            headers: { 
                "Content-Type": "application/json",
                'X-CSRFToken': this.getCookie('csrftoken')
             },
            body: JSON.stringify(payload)
        }).then(res=>res.json()).then(data => this.props.callBackFunction())
    }
    updateList(){
        
        let payload = {
            title: this.state.title
        }
        
        fetch("/api/update-list/"+this.props.list.id,{
            method: "put",
            headers: { 
                "Content-Type": "application/json",
                'X-CSRFToken': this.getCookie('csrftoken')
             },
            body: JSON.stringify(payload)
        }).then(res=>res.json()).then(data => this.props.callBackFunction())
        
    }
    render() {
        return (
            <Grid container spacing={1}>
                <Grid xs={12} item align="center">
                    <Typography component="h4" variant="h4">{this.props.create? "Create List":"Update List"}</Typography>
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
                </Grid>
                <Grid xs={12} item align="center">
                    {
                        this.props.create?(<Button variant="contained" onClick={this.createList}>Create</Button>):<Button variant="contained" onClick={this.updateList}>Update</Button>
                    }
                </Grid>
            </Grid>
        );
    }
}