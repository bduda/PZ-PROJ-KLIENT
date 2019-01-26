import React, { Component } from 'react';

import ReactDOM from 'react-dom';

import { getAllMenu, saveMenuDelete, saveMenuModify, saveMenu, checkUsernameAvailability } from '../util/APIUtils';
import '../user/signup/Signup.css';
import { Link, withRouter } from 'react-router-dom';
import {
        CODE_MIN_LENGTH, CODE_MAX_LENGTH,
        NAZWA_MIN_LENGTH, NAZWA_MAX_LENGTH,
        KATEGORIA_MIN_LENGTH, KATEGORIA_MAX_LENGTH,
        OPIS_MIN_LENGTH, OPIS_MAX_LENGTH
} from '../constants';
import { getAllUsers } from '../util/APIUtils';

import { Form,AutoComplete, Mention, Input, Button, Divider, notification, Modal, Table } from 'antd';

import Select from 'react-select'

import {
   Popconfirm
} from 'antd';

const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: false,
  }

  componentDidMount() {
    if (this.props.editable) {
      document.addEventListener('click', this.handleClickOutside, true);
    }
  }

  componentWillUnmount() {
    if (this.props.editable) {
      document.removeEventListener('click', this.handleClickOutside, true);
    }
  }


  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  }

  handleClickOutside = (e) => {
    const { editing } = this.state;
    if (editing && this.cell !== e.target && !this.cell.contains(e.target)) {
      this.save();
    }
  }

  save = () => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  }

  render() {
    const { editing } = this.state;
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      ...restProps
    } = this.props;
    return (
      <td ref={node => (this.cell = node)} {...restProps}>
        {editable ? (
          <EditableContext.Consumer>
            {(form) => {
              this.form = form;
              return (
                editing ? (
                  <FormItem style={{ margin: 0 }}>
                    {form.getFieldDecorator(dataIndex, {
                      rules: [{
                        required: true,
                        message: `${title} is required.`,
                      }],
                      initialValue: record[dataIndex],
                    })(
                      <Input
                        ref={node => (this.input = node)}
                        onPressEnter={this.save}
                      />
                    )}
                  </FormItem>
                ) : (
                  <div
                    className="editable-cell-value-wrap"
                    style={{ paddingRight: 24 }}
                    onClick={this.toggleEdit}
                  >
                    {restProps.children}
                  </div>
                )
              );
            }}
          </EditableContext.Consumer>
        ) : restProps.children}
      </td>
    );
  }
}

class Menudef extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
    {
    title: 'ID',
    dataIndex: 'id',
    key:'id',
    sorter: (a, b) => { return a.nazwa.localeCompare(b.nazwa)}},
                {
            title: 'NAZWA',
            dataIndex: 'nazwa',
            key: 'nazwa',
                        sorter: (a, b) => { return a.nazwa.localeCompare(b.nazwa)}
                }
            ,
            {
            title: 'KATEGORIA',
            dataIndex: 'kategoria',
            key: 'kategoria',
            sorter: (a, b) => { return a.kategoria.localeCompare(b.kategoria)}
            }
            ,
                        {
                        title: 'OPIS',
                        dataIndex: 'opis',
                        key: 'opis',
                        sorter: (a, b) => { return a.kategoria.localeCompare(b.kategoria)}
                        }
                        ,
            {
        title: 'CENA',
        dataIndex: 'cena',
        key: 'cena',
        render: (text,row) => <text>{text + ' zł'}</text>
            }
            ,
             { title: 'OPCJE',
             dataIndex: '',
             key: 'x',
      render: (text, record) => (
        this.state.dataSource.length >= 1
          ? (
          <span>
            <Popconfirm title="Sure to delete?" onClick={() => this.setDelete(record.id, record.nazwa,record.kategoria,record.cena,record.opis)}
            onConfirm={() => this.handleDelete(record.id, record.nazwa,record.kategoria,record.cena,record.opis)}
            onCancel={() => this.handleCancel()}>
              <a href="#">Delete</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a href="#" onClick={() => this.actMod(record.id, record.kategoria, record.nazwa, record.opis,record.cena)}>Edytuj</a>
             </span>
          ) : null
      ),
    }];

this.state = {
            id: {
                value: ''
            },
            kategoria: {
                value: ''
            },
            nazwa: {
                value: ''
            },
            cena: {
                value: ''
            },
            opis: {
                value: ''
            },
            dataSource:[],
            user_action: 'add',
            menuIsOpen: false,
                        menuIsOpen2: false

                    }
        this.handleInputChange = this.handleInputChange.bind(this);
//        this.handleSubmit = this.handleSubmit.bind(this);
//        this.validateNazwaAvailability = this.validateNazwaAvailability.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);;
  }

      componentDidMount(){

          const response = getAllMenu(this.props.nazwa).then(json =>{
              this.setState({dataSource:json})
          });
      }

          showModal = () =>{
        // Before showing
        this.setState({
          visible: true,
        });
        // After showing
      }

      handleOk = (e) => {
      if(this.state.user_action=='add'){
        // before pressing ok
          const saveMenuRequest = {
              id: this.state.id.value,
              kategoria: this.state.kategoria.value,
              cena: this.state.cena.value,
              nazwa: this.state.nazwa.value,
              opis: this.state.opis.value,
              ilosc:'0'
          };
          console.log(saveMenuRequest);
          saveMenu(saveMenuRequest)
          .then(response => {
              notification.success({
                  message: 'Restaurant AI',
                  description: "Thank you! You're successfully registered. Please Login to continue!",
              });
                    this.setState({
          visible: false,
        });
              const response_update = getAllMenu(this.props.nazwa).then(json =>{
              this.setState({dataSource:json})
          });
          }).catch(error => {
              notification.error({
                  message: 'Restaurant AI',
                  description: error.message || 'Sorry! Something went wrong. Please try again!'
              });
          });}else if(this.state.user_action='modify'){        // before pressing ok
          console.log('modify')
                                                                 const saveMenuRequest = {
                                                                    id: this.state.id.value,
                                                                     kategoria: this.state.kategoria.value,
                                                                     cena: this.state.cena.value,
                                                                     nazwa: this.state.nazwa.value,
                                                                     opis: this.state.opis.value,
                                                                     ilosc:'0'
                                                                 };
                                                                 saveMenuModify(saveMenuRequest)
                                                                 .then(response => {
                                                                     notification.success({
                                                                         message: 'Restaurant AI',
                                                                         description: "Thank you! Succesfull modification!",
                                                                     });
                                                                           this.setState({
                                                                                     kategoria:{value: ''},
                                                                                     cena:{value:''},
                                                                                     nazwa:{value:''},
                                                                                     opis:{value:''},

                                                                 visible: false,
                                                               });
                                                                     const response_update = getAllMenu(this.props.nazwa).then(json =>{
                                                                     this.setState({dataSource:json})
                                                                 });
                                                                 }).catch(error => {
                                                                     notification.error({
                                                                         message: 'Restaurant AI',
                                                                         description: error.message || 'Sorry! Something went wrong. Please try again!'
                                                                     });
                                                                 });}

        // After pressing ok

      }


      handleCancel = (e) => {
        // Before canceling
        this.setState({

                   id: {
                       value: ''
                   },
                   kategoria: {
                       value: ''
                   },
                   nazwa: {
                       value: ''
                   },
                   cena: {
                       value: ''
                   },
                   opis: {
                       value: ''
                   },
          visible: false,
        });
        // After pressing cancel
      }

      handleInputChange(event, validationFun) {
          const target = event.target;
          const inputName = target.name;
          const inputValue = target.value;

          this.setState({
              [inputName] : {
                  value: inputValue,
                  ...validationFun(inputValue)
              }
          });
      }

    isFormInvalid() {
    if(this.state.user_action=='add'){
        return !(
        this.state.kategoria.validateStatus === 'success' &&
            this.state.nazwa.validateStatus === 'success' &&
            this.state.cena.validateStatus === 'success'  &&
            this.state.opis.validateStatus === 'success'
        );
        }else if (this.state.user_action=='modify'){
                this.state.kategoria.validateStatus === 'success' &&
                    this.state.cena.validateStatus === 'success'  &&
                    this.state.opis.validateStatus === 'success'
        }
    }

    actAdd = () =>{
          this.setState({
          kategoria:{value: ''},
          cena:{value:''},
          nazwa:{value:''},
          opis:{value:''},
            user_action: 'add',
          });
    this.showModal()
    }


        actMod = (id, kategoria, nazwa,opis,cena) =>{
              this.setState({
                user_action: 'modify',
                id:{value: id},
                cena:{value: cena},
                nazwa: {value: nazwa},
                kategoria: {value: kategoria},
                opis:{value: opis},
              });
        this.showModal()
        }

  setDelete = (id,nazwa,kategoria,cena,opis) => {
              this.setState({
                id:{value: id},
                nazwa:{value: nazwa},
                kategoria:{value: kategoria},
                cena:{value: cena},
                opis:{value: 'du'}
              });
              console.log(this.state)
              }

  handleDelete = (id,nazwa,kategoria,cena,opis) => {
      const saveMenuRequest = {
      id: this.state.id.value,
      kategoria: this.state.kategoria.value,
      cena: this.state.cena.value,
      nazwa: this.state.nazwa.value,
      opis: this.state.opis.value,
      ilosc:'0'
      };
      saveMenuDelete(saveMenuRequest)
      .then(response => {
      notification.success({
      message: 'Restaurant AI',
      description: "Thank you! Succesfull modification!",
      });
      this.setState({
      kategoria:{value: ''},
      cena:{value:''},
      nazwa:{value:''},
      opis:{value:''},
      visible: false,
      });
      const response_update = getAllMenu(this.props.nazwa).then(json =>{
      this.setState({dataSource:json})
      });
      }).catch(error => {
      notification.error({
      message: 'Restaurant AI',
      description: error.message || 'Sorry! Something went wrong. Please try again!'
      });
      });}

                      // After pressing ok



  handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {
      nazwa: count,
      kategoria: `Edward King ${count}`,
      age: 32,
      address: `London, Park Lane no. ${count}`,
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });
  }

  handleSave = (row) => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.nazwa === item.nazwa);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ dataSource: newData });
  }

  render() {
            let modalItems;

            if(this.state.user_action == 'add') {
             modalItems =[
                         <div>
                         <Modal
                       title= 'Nowa pozycja'
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
                                             disabled={this.isFormInvalid()}>Zapisz</Button>
                         ]}
                     >
                       <div className="signup-content">
                                 <Form onSubmit={this.handleSubmit} className="signup-form">
                                     <FormItem label="NAZWA"
                                         hasFeedback
                                         validateStatus={this.state.nazwa.validateStatus}
                                         help={this.state.nazwa.errorMsg}>
                                         <Input
                                             size="large"
                                             name="nazwa"
                                             autoComplete="off"
                                             placeholder="Name"
                                             value={this.state.nazwa.value}
//                                             onBlur={this.validateNazwaAvailability}
                                             onChange={(event) => this.handleInputChange(event, this.validateNazwa)} />
                                     </FormItem>
                                     <FormItem label="KATEGORIA"
                                         hasFeedback
                                         validateStatus={this.state.kategoria.validateStatus}
                                         help={this.state.kategoria.errorMsg}>
                                         <Input
                                             size="large"
                                             name="kategoria"
                                             autoComplete="off"
                                             placeholder="Category"
                                             value={this.state.kategoria.value}
//                                             onBlur={this.validateKategoriaAvailability}
                                             onChange={(event) => this.handleInputChange(event, this.validateKategoria)} />
                                     </FormItem>
                                     <FormItem label="OPIS"
                                         hasFeedback
                                         validateStatus={this.state.opis.validateStatus}
                                         help={this.state.opis.errorMsg}>
                                         <Input
                                             size="large"
                                             name="opis"
                                             autoComplete="off"
                                             placeholder="OPIS"
                                             value={this.state.opis.value}
//                                             onBlur={this.validateKategoriaAvailability}
                                             onChange={(event) => this.handleInputChange(event, this.validateOpis)} />
                                     </FormItem>
                                     <FormItem label="CENA"
                                         hasFeedback
                                         validateStatus={this.state.cena.validateStatus}
                                         help={this.state.cena.errorMsg}>
                                         <Input
                                             size="large"
                                             name="cena"
                                             autoComplete="off"
                                             placeholder="CENA"
                                             value={this.state.cena.value}
//                                             onBlur={this.validateKategoriaAvailability}
                                             onChange={(event) => this.handleInputChange(event, this.validateValue)} />
                                     </FormItem>
                                 </Form>
                             </div>
                     </Modal>
                   </div>
            ];
            } else if (this.state.user_action == 'modify'){

              modalItems = [
                                            <div>
                                    <Modal
                          title='Modyfikuj pozycję'
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
                                                disabled={this.isFormInvalid()}>Zapisz</Button>
                            ]}
                        >
                          <div className="signup-content">
                                 <Form onSubmit={this.handleSubmit} className="signup-form">
                                     <FormItem label="NAZWA"
                                         hasFeedback
                                         validateStatus={this.state.nazwa.validateStatus}
                                         help={this.state.nazwa.errorMsg}>
                                         <Input
                                             size="large"
                                             name="nazwa"
                                             autoComplete="off"
                                             placeholder="Name"
                                             value={this.state.nazwa.value}
//                                             onBlur={this.validateNazwaAvailability}
                                             onChange={(event) => this.handleInputChange(event, this.validateNazwa)} />
                                     </FormItem>
                                     <FormItem label="KATEGORIA"
                                         hasFeedback
                                         validateStatus={this.state.kategoria.validateStatus}
                                         help={this.state.kategoria.errorMsg}>
                                         <Input
                                             size="large"
                                             name="kategoria"
                                             autoComplete="off"
                                             placeholder="Category"
                                             value={this.state.kategoria.value}
//                                             onBlur={this.validateKategoriaAvailability}
                                             onChange={(event) => this.handleInputChange(event, this.validateKategoria)} />
                                     </FormItem>
                                     <FormItem label="OPIS"
                                         hasFeedback
                                         validateStatus={this.state.opis.validateStatus}
                                         help={this.state.opis.errorMsg}>
                                         <Input
                                             size="large"
                                             name="opis"
                                             autoComplete="off"
                                             placeholder="OPIS"
                                             value={this.state.opis.value}
//                                             onBlur={this.validateKategoriaAvailability}
                                             onChange={(event) => this.handleInputChange(event, this.validateOpis)} />
                                     </FormItem>
                                     <FormItem label="CENA"
                                         hasFeedback
                                         validateStatus={this.state.cena.validateStatus}
                                         help={this.state.cena.errorMsg}>
                                         <Input
                                             size="large"
                                             name="cena"
                                             autoComplete="off"
                                             placeholder="CENA"
                                             value={this.state.cena.value}
//                                             onBlur={this.validateKategoriaAvailability}
                                             onChange={(event) => this.handleInputChange(event, this.validateValue)} />
                                     </FormItem>
                                 </Form>
                              </div>
                        </Modal>
                      </div>
                ];

            }
    const { dataSource } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
            <div className="user-table">
                 <div className="signup-container">
                      <h1 className="page-title">Edytuj pozycje menu</h1>
                                  <div className="button-container">
                <Button type="primary" size = 'large' onClick={this.actAdd}>
                Nowa pozycja
              </Button>
                      </div>
        <div className='table-section'>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={columns}
        />
                  </div>
          </div>
        {modalItems}

      </div>

    );
  }



  // Validation Functions

    validateOpis = (opis) => {
        if(opis.length < OPIS_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Opis is too short (Minimum ${OPIS_MIN_LENGTH} characters needed.)`
            }
        } else if (opis.length > OPIS_MAX_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `Opis is too long (Maximum ${OPIS_MAX_LENGTH} characters allowed.)`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null
            }
        }
    }

    validateNazwa = (nazwa) => {
        if(nazwa.length < NAZWA_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Nazwa is too short (Minimum ${NAZWA_MIN_LENGTH} characters needed.)`
            }
        } else if (nazwa.length > NAZWA_MAX_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `Nazwa is too long (Maximum ${NAZWA_MAX_LENGTH} characters allowed.)`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null
            }
        }
    }

    validateKategoria = (kategoria) => {
        if(kategoria.length < KATEGORIA_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Kategoria is too short (Minimum ${KATEGORIA_MIN_LENGTH} characters needed.)`
            }
        } else if (kategoria.length > KATEGORIA_MAX_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `Kategoria is too long (Maximum ${KATEGORIA_MAX_LENGTH} characters allowed.)`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null
            }
        }
    }

        validateValue = (cena) => {
            if(cena.value == '') {
                return {
                    validateStatus: 'error',
                    errorMsg: `Prize must be bigger than 0`
                }
            }else {
                return {
                    validateStatus: 'success',
                    errorMsg: null
                }
            }
        }
}

export default Menudef;