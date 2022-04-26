import React, { Component } from "react";
import {Grid,Typography, FormControl, FormHelperText,Select,MenuItem,Button} from '@mui/material'
export default class AddToList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list:1
        }
        this.addGame = this.addGame.bind(this)
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
    addGame(){
        let payload = {
            game:this.props.game.id
        }
        fetch("/api/add-to-list/"+this.state.list,{
            method: "post",
            headers: { 
                "Content-Type": "application/json",
                'X-CSRFToken': this.getCookie('csrftoken')
             },
            body: JSON.stringify(payload)
        }).then(res=>res.json()).then(data => {this.props.callBackFunction()})
    }
    render() {
        console.log(this.props)
        console.log(this.state)
        return (
            <Grid container spacing={1}>
                <Grid xs={12} item align="center">
                    <Typography component="h4" variant="h4">Add Game to List</Typography>
                </Grid>
                <Grid xs={12} item align="center">
                    <FormControl>
                        <Select
                            value={this.state.list}
                            onChange={e=>{
                                this.setState({
                                    list:e.target.value
                                })
                            }}
                        >
                            {this.props.lists.map(item=>{
                                return (
                                    <MenuItem value={item.id}>{item.title}</MenuItem>
                                )
                            })}
                        </Select>
                        <FormHelperText><div align="center">List</div></FormHelperText>
                    </FormControl>
                </Grid>
                <Grid xs={12} item align="center">
                    <Button variant="contained" onClick={this.addGame}>Add to List</Button>
                </Grid>
            </Grid>
        );
    }
}