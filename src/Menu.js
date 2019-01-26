import React, { Component } from 'react';

import ReactDOM from 'react-dom';

import { funcfindByKategoria, getAllMenu, saveMenuDelete, saveMenuModify, saveMenu, checkUsernameAvailability } from './util/APIUtils';
import './user/signup/Signup.css';
import { Link, withRouter } from 'react-router-dom';
import { getAllUsers, getKategorie } from './util/APIUtils';

//import {TabList,TabPanel, Tab, Tabs} from 'react-tabs'
import {Tabs,AutoComplete, Mention, Input, Button, Divider, notification, Modal, Table } from 'antd';

import Select from 'react-select'

import {
   Popconfirm
} from 'antd';


const TabPane = Tabs.TabPane;

function callback(key) {
  console.log(key);
}

class Menu extends Component {
      constructor(props, context) {
        super(props, context);
        this.state = {
            dataSource:[],
            dataSource2:[],
            first:'',
        }
      }

      componentDidMount(){

          const response = getKategorie(this.props.username).then(json =>{
              this.setState({dataSource:json})
          });
            this.state.first= this.state.dataSource[0];
            console.log(this.state.first);
                                const response2 = getAllMenu(this.state.username).then(json =>{
                                this.setState({dataSource2:json})
                                });
          }

          componentWillReceiveProps(){

          }

handleOk = (e) => {
          const response2 = funcfindByKategoria(this.state.dataSource[0]).then(json =>{
          this.setState({dataSource2:json})
          });
}

    render() {
        this.columns = [

                    {
                title: 'NAZWA',
                dataIndex: 'nazwa',
                key: 'nazwa',
                    }
                ,
                            {
                            title: 'OPIS',
                            dataIndex: 'opis',
                            key: 'opis',
                            }
                            ,
                {
            title: 'CENA',
            dataIndex: 'cena',
            key: 'cena',
            render: (text,row) => <text>{text + ' zł'}</text>
                }
        ];

        return(
            <div className="user-table">
                 <div className="signup-container">
                      <h1 className="page-title">Menu</h1>
                <div>
                      <Tabs onChange={(...args) => {
                                                        console.log(args[0]);
//                this.setState({ menuByKatRequest :{kategoria: args[0]}});
//                console.log(this.state.menuByKatRequest);

                                   const response2_upd = funcfindByKategoria(args[0]).then(json =>{
                                               this.setState({dataSource2:json})
                                                       });
           const response = getKategorie(this.props.username).then(json =>{
               this.setState({dataSource:json})
           });
                                                                      console.log(this.state.dataSource2);

                                                      }} type="card">
                                                      <TabPane tab='MENU' key='MENU'>
                                <div className='table-section'>
                                   <Table
//                                   title={()=>this.state.menuByKatRequest.kategoria}
                                     rowClassName={() => 'editable-row'}
                                     bordered
                                     dataSource={this.state.dataSource2}
                                     columns={this.columns}
                                   />
                                  </div>
                                                      </TabPane>
                           { this.state.dataSource.map(kat =>    <TabPane tab={kat} key={kat}>

                                <div className='table-section'>
                                   <Table
//                                   title={()=>this.state.menuByKatRequest.kategoria}
                                     rowClassName={() => 'editable-row'}
                                     bordered
                                     dataSource={this.state.dataSource2}
                                     columns={this.columns}
                                   />
                                  </div>

                           </TabPane>) }
                    </Tabs>
                </div>
 </div>

              </div>
              );
    }

}


export default Menu;
