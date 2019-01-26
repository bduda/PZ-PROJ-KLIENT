import React, { Component } from 'react';

import ReactDOM from 'react-dom';

import {deleteRachMenu, incTmp,createMenuTmp,deleteTmpMenu,createTmpItem, modRoom, getAllStolik, getAllMenu,getAllMenuTmp, saveMenuDelete, saveMenuModify, saveMenu, checkUsernameAvailability } from './util/APIUtils';
import { Link, withRouter } from 'react-router-dom';

import { getAllUsers, getKategorie } from './util/APIUtils';

import './room.css';

//import {TabList,TabPanel, Tab, Tabs} from 'react-tabs'
import {Icon,Form,Tabs,AutoComplete, Mention, Input, Button, Divider, notification, Modal, Table } from 'antd';

import Select from 'react-select'

import {
   Popconfirm,Row,Col
} from 'antd';

const FormItem = Form.Item;


const TabPane = Tabs.TabPane;

const confirm = Modal.confirm;

function showConfirm() {
  confirm({
    title: 'Do you Want to delete these items?',
    content: 'Some descriptions',
    onOk() {
      console.log('OK');
    },
    onCancel() {
      console.log('Cancel');
    },
  });
}

function callback(key) {
  console.log(key);
}

class Room extends Component {
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
            dataSource2:[],
            dataSource3:[],
            visible: false,
            modalAction:'start',
        }
      }

      componentDidMount(){

          const response = getAllStolik(this.props.username).then(json =>{
              this.setState({dataSource:json})
          });
                                  const response_menu = getAllMenu(this.props.username).then(json =>{
                                  this.setState({dataSource3:json})
                                  });
          }

        actMod = (numer, aktywnosc, aktyp,pojemnosc,zajetosc,akview,akdsbl) =>{
         if(aktyp == 'primary')
         this.setState({
         modalAction:'start'
         });
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
//                    numer: {
//                        value: ''
//                    },
//                    pojemnosc: {
//                        value: ''
//                    },
//                    aktywnosc: {
//                        value: ''
//                    },
//                    aktyp: {
//                        value: ''
//                    },
//                    zajetosc: {
//                        value: ''
//                    },
//                    akdsbl: {
//                        value: ''
//                    },
//                    akview: {
//                        value: ''
//                    },
            modalAction:'start',
            visible: false,
        });

        // After pressing cancel
      }
      handleCancel2 = (e) => {
        // Before canceling
{

              this.setState ({
                          zajetosc: {
                              value: 'NIE'
                          },
                          akview: {
                              value: 'primary'
                          },
              });


                        const roomModRequest = {
                            numer: this.state.numer.value,
                            aktywnosc: this.state.aktywnosc.value,
                            pojemnosc: this.state.pojemnosc.value,
                            zajetosc: 'NIE',
                            aktyp: this.state.aktyp.value,
                            akview: 'primary',
                            akdsbl: this.state.akdsbl.value,
                        };
                        console.log(roomModRequest);
                                  modRoom(roomModRequest)
                                  .then(response => {
                                      notification.success({
                                          message: 'Restaurant AI',
                                          description: "Thank you! Service started!",
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
                                                                      const createMenuTmpReq = {
                                                                      numer: this.state.numer.value,

                                                                  };
                                                                  console.log(createMenuTmpReq);
                                                                            deleteTmpMenu(createMenuTmpReq)
                                                                            .then(response => {
                                                                                notification.success({
                                                                                    message: 'Restaurant AI',
                                                                                    description: "Thank you! Usunięto!",
                                                                                });
                                                                            }).catch(error => {
                                                                                notification.error({
                                                                                    message: 'Restaurant AI',
                                                                                    description: error.message || 'Sorry! Something went wrong. Please try again!'
                                                                                });
                                                                            });
                                         const response_menu_tmp = getAllMenuTmp(this.state.numer.value).then(json =>{
                                         this.setState({dataSource2:json})
                                         });
              // After pressing cancel
                            this.setState ({
                                                                    visible: '',
                                                                  modalAction:'start',

                            });
              }
                                               console.log(this.state);

        // After pressing cancel
      }

            handleOk = (e) => {
              // Before canceling
              if(this.state.modalAction == 'start'){

              this.setState ({
                          zajetosc: {
                              value: 'TAK'
                          },
                          akview: {
                              value: 'dashed'
                          },
                          modalAction:'obsl',
              });

                                         const response_menu_tmp = getAllMenuTmp(this.state.numer.value).then(json =>{
                                         this.setState({dataSource2:json})
                                         });

                        const roomModRequest = {
                            numer: this.state.numer.value,
                            aktywnosc: this.state.aktywnosc.value,
                            pojemnosc: this.state.pojemnosc.value,
                            zajetosc: 'TAK',
                            aktyp: this.state.aktyp.value,
                            akview: 'dashed',
                            akdsbl: this.state.akdsbl.value,
                        };
                        console.log(roomModRequest);
                                  modRoom(roomModRequest)
                                  .then(response => {
                                      notification.success({
                                          message: 'Restaurant AI',
                                          description: "Thank you! Service started!",
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


              // After pressing cancel
              }
            }

            handleRach = (e) => {
              // Before canceling

              this.setState ({
                          zajetosc: {
                              value: 'NIE'
                          },
                          akview: {
                              value: 'primary'
                          },
              });


                        const roomModRequest = {
                            numer: this.state.numer.value,
                            aktywnosc: this.state.aktywnosc.value,
                            pojemnosc: this.state.pojemnosc.value,
                            zajetosc: 'NIE',
                            aktyp: this.state.aktyp.value,
                            akview: 'primary',
                            akdsbl: this.state.akdsbl.value,
                        };
                        console.log(roomModRequest);
                                  modRoom(roomModRequest)
                                  .then(response => {
                                      notification.success({
                                          message: 'Restaurant AI',
                                          description: "Thank you! Service started!",
                                      });
                                                          const response_upd = getAllStolik(this.props.username).then(json =>{
                                                              this.setState({dataSource:json})
                                                          });

//??? generuj rachunek
                                  }).catch(error => {
                                      notification.error({
                                          message: 'Restaurant AI',
                                          description: error.message || 'Sorry! Something went wrong. Please try again!'
                                      });
                                  });

                                                                      const createMenuTmpReq = {
                                                                      numer: this.state.numer.value,

                                                                  };
                                                                  console.log(createMenuTmpReq);
                                                                            deleteRachMenu(createMenuTmpReq)
                                                                            .then(response => {
                                                                                notification.success({
                                                                                    message: 'Restaurant AI',
                                                                                    description: "Zakończono obsługę, rachunek wygenerowany!",
                                                                                });
                                                                            }).catch(error => {
                                                                                notification.error({
                                                                                    message: 'Restaurant AI',
                                                                                    description: error.message || 'Sorry! Something went wrong. Please try again!'
                                                                                });
                                                                            });

                            this.setState ({
                                        visible: '',
                          modalAction:'start',

                            });

              // After pressing cancel
              }

            handleAdd = (e) => {
              // Before canceling

              this.setState ({
                          modalAction:'add',
              });

              // After pressing cancel
              }

            handleGotowe = (e) => {
              // Before canceling

                                         const response_menu_tmp = getAllMenuTmp(this.state.numer.value).then(json =>{
                                         this.setState({dataSource2:json})
                                         });
              this.setState ({
                          modalAction:'obsl',
              });

              // After pressing cancel
              }


    handlePlus = (id,cena,nazwa) => {
                            const menuTmpRequest = {
                                id: id,
                                nazwa: nazwa,
                                cena: cena,
                                ilosc: '1',
                                stolik: this.state.numer.value,
                            };
                            console.log(menuTmpRequest);
                                      createTmpItem(menuTmpRequest)
                                      .then(response => {
                                          notification.success({
                                              message: 'Restaurant AI',
                                              description: "Dodano!",
                                          });


                                      }).catch(error => {
                                          notification.error({
                                              message: 'Restaurant AI',
                                              description: error.message || 'Sorry! Something went wrong. Please try again!'
                                          });
                                      });
    }


    render() {
            this.columns = [

                        {
                    title: 'ID',
                    dataIndex: 'id',
                    key: 'id',
                        }
                    ,
                                {
                                title: 'NAZWA',
                                dataIndex: 'nazwa',
                                key: 'nazwa',
                                }
                                ,
                    {
                title: 'CENA',
                dataIndex: 'cena',
                key: 'cena',
                render: (text,row) => <text>{text + ' zł'}</text>
                    }
            ];

            this.columns2 = [

                        {
                    title: 'ID',
                    dataIndex: 'id',
                    key: 'id',
                        }
                    ,
                                {
                                title: 'NAZWA',
                                dataIndex: 'nazwa',
                                key: 'nazwa',
                                }
                                ,
                    {
                title: 'CENA',
                dataIndex: 'cena',
                key: 'cena',
                render: (text,row) => <text>{text + ' zł'}</text>
                    },
                         { title: <Icon type="plus" />,
                                      dataIndex: '',
                                      key: 'x',
                                        className: 'column-action',
                               render: (text, record) => (
                                 this.state.dataSource.length >= 1
                                   ? (
                                   <span>
                                     <a href="#" onClick={() => this.handlePlus(record.id,record.cena,record.nazwa)}>

                                     <Icon type="plus-circle" />
                                     </a>
                                      </span>
                                   ) : null
                               ),
                             },

            ];
                            let modalItems;

                        if(this.state.modalAction == 'start'){
                                   modalItems =[
                                               <div>
                                               <Modal
                                             title= 'Obsługa'
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
                                               >Obsługuj</Button>
                           ]}
                       >
                                             <div className="signup-content">
                                                       <Form className="signup-form">
                                                         <FormItem label="CZY CHCESZ OBSŁUGIWAĆ STOLIK NUMER"> {this.state.numer.value}
                                                         </FormItem>
                                                       </Form>
                                                 </div>

                                         </Modal>
                                       </div>
                                ];
                          } else if(this.state.modalAction == 'obsl'){
                                    modalItems =[
                                               <div>
                                               <Modal
                                             title= {'Stolik numer: '+ this.state.numer.value+', RACHUNEK'}
                                             width={1500}
                                             visible={this.state.visible}
                                             onOk={this.handleOk}
                                             onCancel={this.handleCancel}
                         footer={[
                           <Button code="back" onClick={this.handleCancel2}>Przerwij</Button>,
                           <Button type="dashed"
                           onClick={this.handleCancel}
                                               size="medium"
                                               className="signup-form-button"
                                               >Ukryj</Button>,

                           <Button                            disabled="true"
                                             type="dashed"
                           onClick={this.handleOk}
                                               size="medium"
                                               className="signup-form-button"
                                               >Podziel</Button>,


                           <Button type="primary"
                           onClick={this.handleAdd}
                                               size="large"
                                               className="signup-form-button"
                                               >Dodaj</Button>,
                                                     <Button type="primary"
                           onClick={this.handleRach}
                                               size="large"
                                               className="signup-form-button"
                                               >Rachunek</Button>
                           ]}
                       >
                                                       <div className='table-section'>
                                                          <Table
                       //                                   title={()=>this.state.menuByKatRequest.kategoria}
                                                            rowClassName={() => 'editable-row'}
                                                            bordered
                                                            dataSource={this.state.dataSource2}
                                                            columns={this.columns}
                                                          />
                                                         </div>

                                         </Modal>
                                       </div>
                                ];
                          }else if(this.state.modalAction == 'add'){
                                    modalItems =[
                                               <div>
                                               <Modal
                                             title= {'Stolik numer: '+ this.state.numer.value+', DODAJ DO RACHUNKU'}
                                             width={1500}
                                             visible={this.state.visible}
                                             onOk={this.handleOk}
                                             onCancel={this.handleAnuluj}
                         footer={[

                           <Button type="dashed"
                           onClick={this.handleGotowe}
                                               size="medium"
                                               className="signup-form-button"
                                               >Gotowe!</Button>,
                           ]}
                       >
                                                       <div className='table-section'>
                                                          <Table
                       //                                   title={()=>this.state.menuByKatRequest.kategoria}
                                                            rowClassName={() => 'editable-row'}
                                                            bordered
                                                            dataSource={this.state.dataSource3}
                                                            columns={this.columns2}
                                                          />
                                                         </div>

                                         </Modal>
                                       </div>
                                ];


                          }

                                        return(
        <div className='allroom'>

            <h1 className="page-title">Sala restauracyjna</h1>
                <div className='almost'>
                      <Row type="flex" justify="space-between" align="middle">
                { this.state.dataSource.map(stolik =>
                      <Col className="gutter-row" span={4}>
                    <Button disabled={stolik.akdsbl} type={stolik.akview}  size='large' className="room-form-button"
                    onClick={() => this.actMod(stolik.numer, stolik.aktywnosc, stolik.aktyp, stolik.pojemnosc, stolik.zajetosc,stolik.akview,stolik.akdsbl)}>
                    Numer stolika: {stolik.numer} <br/>
                    Liczba osób: {stolik.pojemnosc} <br/>
                    Zajęty: {stolik.zajetosc} <br/>
                    Obsługuj
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


export default Room;
