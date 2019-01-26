import React, { Component } from 'react';

import ReactDOM from 'react-dom';

import { getAllStolik, modRoom, checkUsernameAvailability } from './util/APIUtils';
import { Link, withRouter } from 'react-router-dom';

import { getAllUsers, getKategorie } from './util/APIUtils';

import './room.css';

//import {TabList,TabPanel, Tab, Tabs} from 'react-tabs'
import {Form,Tabs,AutoComplete, Mention, Input, Button, Divider, notification, Modal, Table } from 'antd';

import Select from 'react-select'

import {
   Popconfirm,Row,Col
} from 'antd';

const FormItem = Form.Item;

const TabPane = Tabs.TabPane;

const options = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
  { value: '6', label: '6' },
  { value: '7', label: '7' },
  { value: '8', label: '8' },
  { value: '9', label: '9' },
  { value: '10', label: '10' },
  { value: '11', label: '11' },
  { value: '12', label: '12' },
  { value: '13', label: '13' },
  { value: '14', label: '14' },
  { value: '15', label: '15' },

]

function callback(key) {
  console.log(key);
}

class RoomDef extends Component {
      constructor(props, context) {
        super(props, context);
        this.state = {
                    numer: {
                        value: ''
                    },
                    pojemnosc: {
                        value: ''
                    },
                    aktywnosc: {
                        value: ''
                    },
                    aktyp: {
                        value: ''
                    },
                    zajetosc: {
                        value: ''
                    },
                    akdsbl: {
                        value: ''
                    },
                    akview: {
                        value: ''
                    },
            dataSource:[],
            visible: false,
            menuIsOpen: false,
        }
      }

      componentDidMount(){

          const response = getAllStolik(this.props.username).then(json =>{
              this.setState({dataSource:json})
          });
          }

        actMod = (numer, aktywnosc, aktyp,pojemnosc,zajetosc,akview,akdsbl) =>{
              this.setState({
                numer:{value: numer},
                aktywnosc:{value: aktywnosc},
                aktyp: {value: aktyp},
                pojemnosc: {value:'1'},
                zajetosc:{value: zajetosc},
                akview:{value:akview},
                akdsbl:{value:akdsbl},
              });
        this.showModal()
        }

                  showModal = () =>{
                // Before showing
                this.setState({
                  visible: true,
                });
                // After showing
              }

      handleCancel = (e) => {
        // Before canceling
        this.setState ({
                    numer: {
                        value: ''
                    },
                    pojemnosc: {
                        value: ''
                    },
                    aktywnosc: {
                        value: ''
                    },
                    aktyp: {
                        value: ''
                    },
                    zajetosc: {
                        value: ''
                    },
                    akdsbl: {
                        value: ''
                    },
                    akview: {
                        value: ''
                    },
            visible: false,
        });
        // After pressing cancel
      }

      handleOk = (e) => {
        // before pressing ok
console.log(this.state.aktywnosc.value);
        if(this.state.aktywnosc.value == 'NIE'){
          const roomModRequest = {
              numer: this.state.numer.value,
              aktywnosc: 'TAK',
              pojemnosc: this.state.pojemnosc.value,
              zajetosc: 'NIE',
              aktyp: 'primary',
              akview: 'primary',
              akdsbl: '',
          };
                    modRoom(roomModRequest)
                    .then(response => {
                        notification.success({
                            message: 'Restaurant AI',
                            description: "Thank you! Succesfull modification!",
                        });
                              this.setState({
                    visible: false,
                              numer: {
                                  value: ''
                              },
                              pojemnosc: {
                                  value: ''
                              },
                              aktywnosc: {
                                  value: ''
                              },
                              aktyp: {
                                  value: ''
                              },
                              zajetosc: {
                                  value: ''
                              },
                              akdsbl: {
                                  value: ''
                              },
                              akview: {
                                  value: ''
                              },
                  });
                    const response_upd = getAllStolik(this.props.username).then(json =>{
                        this.setState({dataSource:json})
                    });
                    }).catch(error => {
                        notification.error({
                            message: 'Restaurant AI',
                            description: error.message || 'Sorry! Something went wrong. Please try again!'
                        });
                    });


                }else{
          const roomModRequest = {
              numer: this.state.numer.value,
              aktywnosc: 'NIE',
              pojemnosc: this.state.pojemnosc.value,
              zajetosc: 'NIE',
              aktyp: 'dashed',
              akview: 'primary',
              akdsbl: 'true',
          };
                    modRoom(roomModRequest)
                    .then(response => {
                        notification.success({
                            message: 'Restaurant AI',
                            description: "Thank you! Succesfull modification!",
                        });
                              this.setState({
                    visible: false,
                              numer: {
                                  value: ''
                              },
                              pojemnosc: {
                                  value: ''
                              },
                              aktywnosc: {
                                  value: ''
                              },
                              aktyp: {
                                  value: ''
                              },
                              zajetosc: {
                                  value: ''
                              },
                              akdsbl: {
                                  value: ''
                              },
                              akview: {
                                  value: ''
                              },
                  });
                    const response_upd = getAllStolik(this.props.username).then(json =>{
                        this.setState({dataSource:json})
                    });
                    }).catch(error => {
                        notification.error({
                            message: 'Restaurant AI',
                            description: error.message || 'Sorry! Something went wrong. Please try again!'
                        });
                    });
        }
        }

    render() {
                            let modalItems;

                                   modalItems =[
                                               <div>
                                               <Modal
                                             title= 'Modyfikuj stolik'
                                             visible={this.state.visible}
                                             onOk={this.handleOk}
                                             onCancel={this.handleCancel}
                         footer={[
                           <Button code="back" onClick={this.handleCancel}>Anuluj</Button>,
                           <Button type="primary"
                           onClick={this.handleOk}
                                               htmlType="submit"
                                               size="large"
                                               className="signup-form-button"
                                               >Aktywuj/Dezaktywuj</Button>
                           ]}
                       >
                                             <div className="signup-content">
                                                       <Form className="signup-form">
                                                         <FormItem label="LICZBA OSÓB"
                                                             >
                                                            <Select name = 'select_one' options={options}
                                                            //var hiddenInputValue = ${("input[name='select_one']" ).val()};
                                                            defaultValue={{ label: "1", value: '1' }}
                                                              pojemnosc={this.state.pojemnosc.value}
                                                                        onChange={(...args) => {
                                                                            console.log(args);
                                                                            this.setState({ pojemnosc :{value: args[0].label}});
                                                                          }
                                                                        }
                                                            //  onChange={kind => this.setState({ kind :{value: 'dupadu'}})}
                                                            //  inputValue={this.state.kind.value}
                                                            //  onInputChange={  this.inputValue=this.state.kind.value}
                                                              menuIsOpen={this.state.menuIsOpen}
                                                              onMenuOpen={() => this.setState({ menuIsOpen: true })}
                                                              onMenuClose={() => this.setState({ menuIsOpen: false })}
                                                            />
                                                         </FormItem>
                                                       </Form>
                                                 </div>
                                         </Modal>
                                       </div>
                                ];

        return(
        <div className='allroom'>

            <h1 className="page-title">Definiowanie sali</h1>
                <div className='almost'>
                      <Row type="flex" justify="space-between" align="middle">
                { this.state.dataSource.map(stolik =>
                      <Col className="gutter-row" span={4}>
                    <Button type={stolik.aktyp}  size='large' className="room-form-button"
                    onClick={() => this.actMod(stolik.numer, stolik.aktywnosc, stolik.aktyp, stolik.pojemnosc, stolik.zajetosc, stolik.akview, stolik.akdsbl)}>
                    Numer stolika: {stolik.numer} <br/>
                    Liczba osób: {stolik.pojemnosc} <br/>
                    Aktywny: {stolik.aktywnosc} <br/>
                    Modyfikuj
                    </Button>
                                          </Col>
                    ) }
                        </Row>
                  </div>
                          {modalItems}

                </div>

              );
    }
}


export default RoomDef;
