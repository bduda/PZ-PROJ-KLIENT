import React, { Component } from 'react';
import '../welcome/bootstrap.min.css'
import '../welcome/Welcome.css'
import { getCurrentUser } from '../util/APIUtils';
import { Link, withRouter } from 'react-router-dom';

import { Layout, Menu, Dropdown, Icon } from 'antd';

const Header = Layout.Header;
    
class Welcome extends Component {
    constructor(props) {
        super(props);  
    }



    render() {
              console.log(this.props)
        let welcomeItems;
        if(!this.props.currentUser) {
         welcomeItems =[
        <div id = 'gotologin' > <br/> Musisz się <Link to="/login">zalogować</Link> żeby korzystać! </div>
        ];
        } else {
          welcomeItems = [
            <div id = 'gotologin'> <br/>Zapraszam! </div>
            ];
          
        }

        return(
            <div id = 'main'>
            <div class = 'container-fluid'>
                <div class = 'row align-self-center'>
                    <div class = 'col-md-6 text-center align-self-center'><span>Restauracja AI</span></div>
                    <div class = 'col-md-6 text-center align-self-center'>
Projek z Aplikacji Internetowych: Obsługa sali restauracyjnej. mySQL, SpringBoot, React, antd, bootstrap. Wykonał: Bonifacy Duda.


{welcomeItems}</div>

                </div>
            </div>

            </div>
            );
    }
}

export default withRouter(Welcome);