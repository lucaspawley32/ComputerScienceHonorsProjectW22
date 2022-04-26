import React, { Component } from 'react';
import { render } from 'react-dom';
import Login from './Login';
import { BrowserRouter as Router, Routes, Route, Link, Navigate,useNavigate} from 'react-router-dom';
import Register from './Register';
import HomePage from './HomePage';
class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            authorized: false
        }
        this.getCookie = this.getCookie.bind(this)
        this.getUserAuth = this.getUserAuth.bind(this)
        this.getUserAuth();
    }
    getUserAuth(){
        return fetch("/api/check-auth").then((response)=>{return response.json()}).then((data) => {
            this.setState({
                authorized:data.authorized
            })
            this.forceUpdate()
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
    
    render() {
        return (
                <Router>
                    <Routes>
                        <Route  path='/' element={<HomePage authorized={this.state.authorized}/>} />
                        <Route path="/login" element={<Login authorized={this.state.authorized} />} />
                        <Route path="/register" element={<Register authorized={this.state.authorized} />} />
                    </Routes>
                </Router>
        );
    }
}
export default function(props) {
    const navigate = useNavigate();
    return <App {...props} navigate={navigate} />
}
const appDiv = document.getElementById('app');
render(<App name="tim"/>, appDiv);