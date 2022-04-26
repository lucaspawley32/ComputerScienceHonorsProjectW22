import React, { Component } from "react";
import { useNavigate } from "react-router-dom";
import {Grid, Paper,AppBar, Toolbar, Typography, Button, Box,List,ListItem,ListItemButton,ListItemText,Modal, Container} from '@mui/material'
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import AddGame from './AddGame'
import AddList from './AddList'
import AddToList from './AddToList'

let rows = [
    { 
        id: 1, 
        title: 'No data', 
        genre: '',
        console: '',
        description: '',
        status: "",
        owned: false
    }
  ];


class HomePage extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            listDrawer: false,
            addListMenu:false,
            addGameToListMenu:false,
            editList:false,
            listToEdit:{},
            editGame:false,
            gameToEdit:{},
            lists : [],
            games:[],
            currentList:-1,
            columns:[
                { field: 'title', headerName: 'Title', width: 250 },
                { field: 'genre', headerName: 'Genre', width: 150 },
                { field: 'console', headerName: 'Console', width: 150 },
                { field: 'service', headerName: 'Service', width: 150 },
                { 
                    field: 'status', 
                    headerName: 'status',
                    type: "singleSelect",
                    valueOptions: ["NP", "CP","Completed","Did Not Finish"], 
                    width: 150 },
                { field: 'owned', headerName: 'Owned', type: 'boolean', width: 100 },
                { field: 'description', headerName: 'Description',  width: 250 },
                {
                    field: 'actions',
                    type: 'actions',
                    headerName: 'Actions',
                    width: 150,
                    cellClassName: 'actions',
                    getActions: ({id}) => {
                            if(this.state.currentList == -1){
                                return [
                                    <GridActionsCellItem
                                        icon={<EditIcon />}
                                        label="Edit"
                                        onClick={()=>{this.handleEditGame(id)}}
                                        color="primary"
                                    />,
                                    <GridActionsCellItem
                                        icon={<DeleteIcon />}
                                        onClick={()=>{this.handleDeleteGame(id)}}
                                        label="Delete"
                                        color="inherit"
                                    />,
                                    <GridActionsCellItem
                                        icon={<AddIcon />}
                                        onClick={()=>{this.handleAddGameToList(id)}}
                                        label="Delete"
                                        color="inherit"
                                    />

                            ]
                            }else{
                                return [
                                    <GridActionsCellItem
                                        icon={<EditIcon />}
                                        label="Edit"
                                        onClick={()=>{this.handleEditGame(id)}}
                                        color="primary"
                                    />,
                                    <GridActionsCellItem
                                        icon={<RemoveIcon />}
                                        onClick={()=>{this.handleRemoveGameFromList(id)}}
                                        label="Delete"
                                        color="inherit"
                                    />

                            ]
                            }
                            
                    }
                }
                
              ]
        }
        
        this.handleAddGameClose = this.handleAddGameClose.bind(this)
        this.getGameData = this.getGameData.bind(this)
        this.getListData = this.getListData.bind(this)
        this.updateRows = this.updateRows.bind(this)
        this.handleLogout = this.handleLogout.bind(this)
        this.checkAuth = this.checkAuth.bind(this)
        this.openListModal = this.openListModal.bind(this)
        this.openGameModal = this.openGameModal.bind(this)
        this.deleteList = this.deleteList.bind(this)
        this.getCookie = this.getCookie.bind(this)
        this.handleListModalButtonPressed = this.handleListModalButtonPressed.bind(this)
        this.handleGameModalButtonPressed = this.handleGameModalButtonPressed.bind(this)
        this.handleEditGame = this.handleEditGame.bind(this)
        this.handleDeleteGame = this.handleDeleteGame.bind(this)
        this.handleAddGameToList = this.handleAddGameToList.bind(this)
        this.checkAuth()
        console.log("new code in 2")
        
    }
    getGamesInList(id){
        return fetch("/api/add-to-list/"+id).then((response)=>{return response.json()}).then((data)=>{
            let games = []
            for(let game in data){
                games.push(data[game])
            }
            this.setState({
                games:games
            })
            this.updateRows()
        })
    }
    handleListModalButtonPressed(){
        this.getListData()
        this.setState({
            addListMenu:false
        })
    }
    handleAddToListModalButtonPressed(){
        this.setState({
            addGameToListMenu:false
        })
    }
    handleGameModalButtonPressed(){
        this.getGameData()
        this.setState({
            addGameMenu:false
        })
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
    handleEditGame(id){
        //get game by id
        for(let game in this.state.games){
            if(this.state.games[game].id == id){
                console.log(this.state.games[game])
                this.openGameModal(true,this.state.games[game])
            }
        }
    }
    handleDeleteGame(id){
        for(let game in this.state.games){
            if(this.state.games[game].id == id){
                fetch("/api/delete-game/"+this.state.games[game].id,{
                    method: "delete",
                    headers: { 
                        "Content-Type": "application/json",
                        'X-CSRFToken': this.getCookie('csrftoken')
                     }
                })
                .then(res=>res.json())
                .then(data => {
                    let tempGamesList = this.state.games
                    for(let i = 0; i <tempGamesList.length; i++){
                        if (tempGamesList[i].id == this.state.games[game].id){
                            tempGamesList.splice(i,1)
                        }
                    }
                    this.setState({
                        games:tempGamesList
                    })
                    this.updateRows()
                })
            }
        }
    }
    handleAddGameToList(id){
        
        for(let game in this.state.games){
            if(this.state.games[game].id == id){
                this.openAddToListModal(this.state.games[game])
            }
        }
    }
    handleRemoveGameFromList(id){
        
        for(let game in this.state.games){
            if(this.state.games[game].id == id){
                let payload = {
                    game:id
                }
                fetch("/api/add-to-list/"+this.state.currentList,{
                    method: "delete",
                    headers: { 
                        "Content-Type": "application/json",
                        'X-CSRFToken': this.getCookie('csrftoken')
                    },
                    body: JSON.stringify(payload)
                    }).then(res=>res.json()).then(data => {
                        let tempGamesList = this.state.games
                        for(let i = 0; i <tempGamesList.length; i++){
                            if (tempGamesList[i].id == this.state.games[game].id){
                                tempGamesList.splice(i,1)
                            }
                        }
                        this.setState({
                            games:tempGamesList
                        })
                        this.updateRows()
                    })
            }
        }
    }
    deleteList(list){
        fetch("/api/delete-list/"+list.id,{
            method: "delete",
            headers: { 
                "Content-Type": "application/json",
                'X-CSRFToken': this.getCookie('csrftoken')
             }
        })
        .then(res=>res.json())
        .then(data => {
            let tempList = this.state.lists
            for(let i = 0; i <tempList.length; i++){
                if (tempList[i].id == list.id){
                    tempList.splice(i,1)
                }
            }
            this.setState({
                lists:tempList,
                currentList:-1
            })
            this.getGameData();
        })
    }
    openListModal(edit, list){
        this.setState({
            addListMenu:true,
            editList: edit,
            listToEdit: list
        })
    }
    openAddToListModal(game){
        this.setState({
            addGameToListMenu:true,
            gameToAdd: game
        })
    }
    openGameModal(edit, game){
        this.setState({
            addGameMenu:true,
            editGame: edit,
            gameToEdit: game
        })
    }
    checkAuth(){
        return fetch("/api/check-auth").then((response)=>{return response.json()}).then((data) => {
            if(!data.authorized){
                this.handleLogout()
            }else{
                this.getListData()
                this.getGameData()
            }
        })
    }
    handleLogout(){
        return fetch("/api/logout").then((response)=>{return response.json()}).then((data) => {
            this.props.navigate("/login")
        })
    }
    getListData(){
        return fetch("/api/get-list-by-user").then((response)=>{return response.json()}).then((data) => {
            let newList = []
            for(let list in data){
                newList.push(data[list])
            }
            this.setState({
                lists: newList
            })
        })
    }
    getGameData(){
        return fetch("/api/get-games-by-user").then((response)=>{return response.json()}).then((data)=>{
            let games = []
            for(let game in data){
                games.push(data[game])
            }
            this.setState({
                games:games
            })
            this.updateRows()
        })
    }
    handleAddGameClose(){
        this.setState({
            addGameMenu:false
        })
    }
    updateRows(){
        console.log("update rows")
        rows = []
        for(let game in this.state.games){
            let row = {}
            row.title = this.state.games[game].title
            row.id = this.state.games[game].id
            row.genre = this.state.games[game].genre
            row.console = this.state.games[game].console
            row.description = this.state.games[game].description
            row.service = this.state.games[game].service
            switch(this.state.games[game].status){
                case 'NP':
                    row.status = "Not Played"
                    break
                case 'CP':
                    row.status = "Currently Playing"
                    break
                case 'C':
                    row.status = "Completed"
                    break
                case 'DNF':
                    row.status = "Did Not Finish"
                    break   
            }
            row.owned = this.state.games[game].owned
            rows.push(row)
        }
        if(rows.length == 0){
            rows.push({ 
                id: 1, 
                title: "No data", 
                genre: '',
                console: '',
                description: "",
                status: "",
                owned: false
            })
        }
        console.log(rows)
        this.forceUpdate()
    }
    

    render() {
        return (
            <Box height="100vh" width="100%">
                <Modal
                    open={this.state.addListMenu}
                    onClose={()=>{this.setState({addListMenu:false})}}
                >
                    <Container align="center">
                        <Paper>
                            <AddList create={!this.state.editList} list={this.state.listToEdit} callBackFunction={this.handleListModalButtonPressed}></AddList>
                        </Paper>
                        
                    </Container>
                    
                </Modal>
                <Modal
                    open={this.state.addGameMenu}
                    onClose={()=>{this.setState({addGameMenu:false})}}
                >
                    <Container align="center">
                        <Paper>
                            <AddGame create={!this.state.editGame} game={this.state.gameToEdit} callBackFunction={this.handleGameModalButtonPressed}></AddGame>
                        </Paper>
                        
                    </Container>
                    
                </Modal>
                <Modal
                    open={this.state.addGameToListMenu}
                    onClose={()=>{this.setState({addGameToListMenu:false})}}
                >
                    <Container align="center">
                        <Paper>
                            <AddToList lists={this.state.lists} game={this.state.gameToAdd} callBackFunction={()=>{this.handleAddToListModalButtonPressed()}}></AddToList>
                        </Paper>
                        
                    </Container>
                    
                </Modal>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{flexGrow:1}}>Backlogger</Typography>
                        <Button color="inherit" onClick={this.handleLogout}>logout</Button>
                    </Toolbar>
                </AppBar>
                <Grid container spacing={1} sx={{
                    height:"93%"
                }}>
                    <Grid item xs={2}>
                            <List>
                                <ListItem>
                                    <ListItemText>Lists</ListItemText>
                                </ListItem>
                                <ListItem>
                                <ListItemButton onClick={()=>{
                                        this.getGameData()
                                        this.setState({
                                            currentList:-1
                                        })
                                    }}>
                                    <ListItemText primary="All Games"/>
                                </ListItemButton>
                            </ListItem>
                                {this.state.lists.map(item=>(
                                <ListItem>
                                    <ListItemButton onClick={()=>{
                                        this.setState({
                                            currentList:item.id
                                        })
                                        this.getGamesInList(item.id)
                                    }}>
                                        <ListItemText primary={item.title}/>                                    
                                    </ListItemButton>
                                    <Button onClick={()=>this.openListModal(true, item)}><EditIcon /></Button>
                                    <Button onClick={()=> this.deleteList(item)}><DeleteIcon /></Button>
                                </ListItem>
                            ))}
                        
                            <ListItem>
                                <ListItemButton onClick={()=>this.openListModal(false, {})}>
                                    <ListItemText primary="New List"/>
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Grid>
                    <Grid item xs={10}>
                        <DataGrid
                            rows={rows} 
                            columns={this.state.columns}
                            editMode="row"
                            components={{
                                Toolbar: ()=>{
                                    return(
                                        <Button onClick={()=>this.openGameModal(false, {})}>AddGame</Button>
                                    )
                                }
                            }}

                        />
                    </Grid>
                    </Grid>
                
            </Box>
            
            
        )
    }
}
export default function(props) {
    const navigate = useNavigate();
    return <HomePage {...props} navigate={navigate} />
}