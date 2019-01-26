import React, { Component } from 'react';
import {
    Link,
    withRouter
} from 'react-router-dom';
import './AppHeader.css';
import pollIcon from '../poll.svg';
import { Layout, Menu, Dropdown, Icon } from 'antd';

const Header = Layout.Header;
    
class AppHeader extends Component {
    constructor(props) {
        super(props);   
        this.handleMenuClick = this.handleMenuClick.bind(this);   
    }

    handleMenuClick({ key }) {
      if(key === "logout") {
        this.props.onLogout();
      }
    }

    render() {
        let menuItems;
        if(this.props.currentUser) {
          menuItems = [
                        <Menu.Item key="/room">
                        <Link to="/room">Sala</Link>
                      </Menu.Item>,
                            <Menu.Item key="/menu">
                            <Link to="/menu">Menu</Link>
                          </Menu.Item>,
//            <Menu.Item key="/">
//              <Link to="/">
//                <Icon type="home" className="nav-icon" />
//              </Link>
//            </Menu.Item>,
//            <Menu.Item key="/poll/new">
//            <Link to="/poll/new">
//              <img src={pollIcon} alt="poll" className="poll-icon" />
//            </Link>
//          </Menu.Item>,
          <Menu.Item key="/profile" className="profile-menu">
                <ProfileDropdownMenu 
                  currentUser={this.props.currentUser} 
                  handleMenuClick={this.handleMenuClick}/>
            </Menu.Item>
          ]; 
        } else {
          menuItems = [
            <Menu.Item key="/login">
              <Link to="/login">Zaloguj</Link>
            </Menu.Item>
          ];
        }

        return (
            <Header className="app-header">
            <div className="container">
              <div className="app-title" >
                <Link to="/">Restauracja AI</Link>
              </div>
              <Menu
                className="app-menu"
                mode="horizontal"
                selectedKeys={[this.props.location.pathname]}
                style={{ lineHeight: '64px' }} >
                  {menuItems}
              </Menu>
            </div>
          </Header>
        );
    }
}

function ProfileDropdownMenu(props) {
  const dropdownMenu = (
    <Menu onClick={props.handleMenuClick} className="profile-dropdown-menu">
      <Menu.Item key="user-info" className="dropdown-item" disabled>
        <div className="user-full-name-info">
          {props.currentUser.name}
        </div>
        <div className="username-info">
          @{props.currentUser.username}
        </div>
      </Menu.Item>
      <Menu.Divider />
           <Menu.Item key="/reservation">
             <Link to="/reservation">Rezerwacje</Link>
           </Menu.Item>
{/*
           <Menu.Item key="/menu">
             <Link to="/menu">Menu</Link>
           </Menu.Item>
   */}
       <Menu.Divider />
            <Menu.Item key="/signup">
              <Link to="/signup">Dodaj pracownika</Link>
            </Menu.Item>
            <Menu.Item key="/codes">
              <Link to="/codes">Kody rabatowe</Link>
            </Menu.Item>
            <Menu.Item key="/def/room">
              <Link to="/def/room">Definicja sali</Link>
            </Menu.Item>
            <Menu.Item key="/def/menu">
              <Link to="/def/menu">Definicja menu</Link>
            </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="profile" className="dropdown-item">
        <Link to={`/users/${props.currentUser.username}`}>Twój profil</Link>
      </Menu.Item>
      <Menu.Item key="logout" className="dropdown-item">
        Wyloguj
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown 
      overlay={dropdownMenu} 
      trigger={['click']}
      getPopupContainer = { () => document.getElementsByClassName('profile-menu')[0]}>
      <a className="ant-dropdown-link">
         <Icon type="user" className="nav-icon" style={{marginRight: 0}} /> <Icon type="down" />
      </a>
    </Dropdown>
  );
}


export default withRouter(AppHeader);