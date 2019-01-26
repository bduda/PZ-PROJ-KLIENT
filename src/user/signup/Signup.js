import React, { Component } from 'react';

import ReactDOM from 'react-dom';

import { signupDelete, signupModify, signup, checkUsernameAvailability, checkEmailAvailability } from '../../util/APIUtils';
import './Signup.css';
import { Link, withRouter } from 'react-router-dom';
import {
    NAME_MIN_LENGTH, NAME_MAX_LENGTH,
    USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH,
    EMAIL_MAX_LENGTH,
    PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH
} from '../../constants';
import { getAllUsers } from '../../util/APIUtils';

import { Form,AutoComplete, Mention, Input, Button, Divider, notification, Modal, Table } from 'antd';

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

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
    {
    title: 'ID',
    dataIndex: 'id',
    key:'id'
    },
            {
            title: 'Imię i nazwisko',
            dataIndex: 'name',
            key: 'name'
            }
            ,
                {
            title: 'Nazwa użytkownika',
            dataIndex: 'username',
            key: 'username'
                }
            ,
                {
            title: 'E-mail',
            dataIndex: 'email',
            key: 'email'}
                ,
             { title: 'Opcje',
             dataIndex: '',
             key: 'x',
      render: (text, record) => (
        this.state.dataSource.length >= 1
          ? (
          <span>
            <Popconfirm title="Sure to delete?" onClick={() => this.setDelete(record.id, record.username,record.name,record.email,record.password)}
            onConfirm={() => this.handleDelete(record.id, record.username,record.name,record.email,record.password)}
            onCancel={() => this.handleCancel()}>
              <a href="#">Delete</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a href="#" onClick={() => this.actMod(record.id, record.name, record.username)}>Edytuj</a>
             </span>
          ) : null
      ),
    }];

this.state = {
            id: {
                value: ''
            },
            name: {
                value: ''
            },
            username: {
                value: ''
            },
            email: {
                value: ''
            },
            password: {
                value: ''
            },
            dataSource:[],
            user_action: 'add'
                    }
        this.handleInputChange = this.handleInputChange.bind(this);
//        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateUsernameAvailability = this.validateUsernameAvailability.bind(this);
        this.validateEmailAvailability = this.validateEmailAvailability.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);;
  }

      componentDidMount(){

          const response = getAllUsers(this.props.username).then(json =>{
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
          const signupRequest = {
              id: this.state.id.value,
              name: this.state.name.value,
              email: this.state.email.value,
              username: this.state.username.value,
              password: this.state.password.value
          };
          signup(signupRequest)
          .then(response => {
              notification.success({
                  message: 'Restaurant AI',
                  description: "Thank you! You're successfully registered. Please Login to continue!",
              });
                    this.setState({
          visible: false,
        });
              const response_update = getAllUsers(this.props.username).then(json =>{
              this.setState({dataSource:json})
          });
          }).catch(error => {
              notification.error({
                  message: 'Restaurant AI',
                  description: error.message || 'Sorry! Something went wrong. Please try again!'
              });
          });}else if(this.state.user_action='modify'){        // before pressing ok
          console.log('modify')
                                                                 const signupRequest = {
                                                                    id: this.state.id.value,
                                                                     name: this.state.name.value,
                                                                     email: this.state.email.value,
                                                                     username: this.state.username.value,
                                                                     password: this.state.password.value
                                                                 };
                                                                 signupModify(signupRequest)
                                                                 .then(response => {
                                                                     notification.success({
                                                                         message: 'Restaurant AI',
                                                                         description: "Thank you! Succesfull modification!",
                                                                     });
                                                                           this.setState({
                                                                                     name:{value: ''},
                                                                                     email:{value:''},
                                                                                     username:{value:''},
                                                                                     password:{value:''},
                                                                 visible: false,
                                                               });
                                                                     const response_update = getAllUsers(this.props.username).then(json =>{
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
                   name: {
                       value: ''
                   },
                   username: {
                       value: ''
                   },
                   email: {
                       value: ''
                   },
                   password: {
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
        return !(this.state.name.validateStatus === 'success' &&
            this.state.username.validateStatus === 'success' &&
            this.state.email.validateStatus === 'success' &&
            this.state.password.validateStatus === 'success'
        );
        }else if (this.state.user_action=='modify'){
                    this.state.email.validateStatus === 'success' &&
                    this.state.password.validateStatus === 'success'
        }
    }

    actAdd = () =>{
          this.setState({
          name:{value: ''},
          email:{value:''},
          username:{value:''},
          password:{value:''},
            user_action: 'add',
          });
    this.showModal()
    }


        actMod = (id, name, login) =>{
              this.setState({
                user_action: 'modify',
                id:{value: id},
                username: {value: login},
                name: {value: name},
              });
        this.showModal()
        }

  setDelete = (id,username,name,email,password) => {
              this.setState({
                id:{value: id},
                username:{value: username},
                name:{value: name},
                email:{value: email},
                password:{value: 'dupaaaa'}
              });
              console.log(this.state)
              }

  handleDelete = (id,username,name,email,password) => {
//              this.setState({
//                id:{value: id},
//                username:{value: username},
//                name:{value: name},
//                email:{value: email},
//                password:{value: 'dupaaaa'}
//              });
      const signupRequest = {
      id: this.state.id.value,
      name: this.state.name.value,
      email: this.state.email.value,
      username: this.state.username.value,
      password: this.state.password.value
      };
      signupDelete(signupRequest)
      .then(response => {
      notification.success({
      message: 'Restaurant AI',
      description: "Thank you! Succesfull modification!",
      });
      this.setState({
      name:{value: ''},
      email:{value:''},
      username:{value:''},
      password:{value:''},
      visible: false,
      });
      const response_update = getAllUsers(this.props.username).then(json =>{
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
      username: count,
      name: `Edward King ${count}`,
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
    const index = newData.findIndex(item => row.username === item.username);
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
                       title= 'Nowy pracownik'
                       visible={this.state.visible}
                       onOk={this.handleOk}
                       onCancel={this.handleCancel}
                       footer={[
                         <Button username="back" onClick={this.handleCancel}>Anuluj</Button>,
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
                                     <FormItem
                                         label="Imię i nazwisko"
                                         validateStatus={this.state.name.validateStatus}
                                         help={this.state.name.errorMsg}>
                                         <Input
                                             size="large"
                                             name="name"
                                             autoComplete="off"
                                             placeholder="Your full name"
                                             value={this.state.name.value}
                                             onChange={(event) => this.handleInputChange(event, this.validateName)} />
                                     </FormItem>
                                     <FormItem label="Nazwa użytkownika"
                                         hasFeedback
                                         validateStatus={this.state.username.validateStatus}
                                         help={this.state.username.errorMsg}>
                                         <Input
                                             size="large"
                                             name="username"
                                             autoComplete="off"
                                             placeholder="A unique username"
                                             value={this.state.username.value}
                                             onBlur={this.validateUsernameAvailability}
                                             onChange={(event) => this.handleInputChange(event, this.validateUsername)} />
                                     </FormItem>
                                     <FormItem
                                         label="Email"
                                         hasFeedback
                                         validateStatus={this.state.email.validateStatus}
                                         help={this.state.email.errorMsg}>
                                         <Input
                                             size="large"
                                             name="email"
                                             type="email"
                                             autoComplete="off"
                                             placeholder="Your email"
                                             value={this.state.email.value}
                                             onBlur={this.validateEmailAvailability}
                                             onChange={(event) => this.handleInputChange(event, this.validateEmail)} />
                                     </FormItem>
                                     <FormItem
                                         label="Hasło"
                                         validateStatus={this.state.password.validateStatus}
                                         help={this.state.password.errorMsg}>
                                         <Input
                                             size="large"
                                             name="password"
                                             type="password"
                                             autoComplete="off"
                                             placeholder="A password between 6 to 20 characters"
                                             value={this.state.password.value}
                                             onChange={(event) => this.handleInputChange(event, this.validatePassword)} />
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
                          title='Modyfikuj pracownika'
                          visible={this.state.visible}
                          onOk={this.handleOk}
                          onCancel={this.handleCancel}
                          footer={[
                            <Button username="back" onClick={this.handleCancel}>Anuluj</Button>,
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
                                        <FormItem
                                            label="Imię i nazwisko"
                                            help={this.state.name.errorMsg}>
                                            <Mention
                                                size="large"
                                                name="name"
                                               placeholder={this.state.name.value}
                                                disabled/>
                                        </FormItem>
                                        <FormItem label="Nazwa użytkownika"
                                            hasFeedback
                                            help={this.state.username.errorMsg}>
                                            <Mention
                                                size="large"
                                                name="username"
                                                placeholder={this.state.username.value}
                                                disabled/>
                                        </FormItem>
                                        <FormItem
                                            label="Email"
                                            hasFeedback
                                            validateStatus={this.state.email.validateStatus}
                                            help={this.state.email.errorMsg}>
                                            <Input
                                                size="large"
                                                name="email"
                                                type="email"
                                                autoComplete="off"
                                                placeholder="Your email"
                                                value={this.state.email.value}
                                                onBlur={this.validateEmailAvailability}
                                                onChange={(event) => this.handleInputChange(event, this.validateEmail)} />
                                        </FormItem>
                                        <FormItem
                                            label="Hasło"
                                            validateStatus={this.state.password.validateStatus}
                                            help={this.state.password.errorMsg}>
                                            <Input
                                                size="large"
                                                name="password"
                                                type="password"
                                                autoComplete="off"
                                                placeholder="A password between 6 to 20 characters"
                                                value={this.state.password.value}
                                                onChange={(event) => this.handleInputChange(event, this.validatePassword)} />
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
                      <h1 className="page-title">Zarządzaj pracownikami</h1>
                                  <div className="button-container">
                <Button type="primary" size = 'large' onClick={this.actAdd}>
                Nowy pracownik
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

    validateName = (name) => {
        if(name.length < NAME_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Name is too short (Minimum ${NAME_MIN_LENGTH} characters needed.)`
            }
        } else if (name.length > NAME_MAX_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `Name is too long (Maximum ${NAME_MAX_LENGTH} characters allowed.)`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null,
              };
        }
    }

    validateEmail = (email) => {
        if(!email) {
            return {
                validateStatus: 'error',
                errorMsg: 'Email may not be empty'
            }
        }

        const EMAIL_REGEX = RegExp('[^@ ]+@[^@ ]+\\.[^@ ]+');
        if(!EMAIL_REGEX.test(email)) {
            return {
                validateStatus: 'error',
                errorMsg: 'Email not valid'
            }
        }

        if(email.length > EMAIL_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Email is too long (Maximum ${EMAIL_MAX_LENGTH} characters allowed)`
            }
        }

        return {
            validateStatus: null,
            errorMsg: null
        }
    }

    validateUsername = (username) => {
        if(username.length < USERNAME_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Username is too short (Minimum ${USERNAME_MIN_LENGTH} characters needed.)`
            }
        } else if (username.length > USERNAME_MAX_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `Username is too long (Maximum ${USERNAME_MAX_LENGTH} characters allowed.)`
            }
        } else {
            return {
                validateStatus: null,
                errorMsg: null
            }
        }
    }

    validateUsernameAvailability() {
        // First check for client side errors in username
        const usernameValue = this.state.username.value;
        const usernameValidation = this.validateUsername(usernameValue);

        if(usernameValidation.validateStatus === 'error') {
            this.setState({
                username: {
                    value: usernameValue,
                    ...usernameValidation
                }
            });
            return;
        }

        this.setState({
            username: {
                value: usernameValue,
                validateStatus: 'validating',
                errorMsg: null
            }
        });

        checkUsernameAvailability(usernameValue)
        .then(response => {
            if(response.available) {
                this.setState({
                    username: {
                        value: usernameValue,
                        validateStatus: 'success',
                        errorMsg: null
                    }
                });
            } else {
                this.setState({
                    username: {
                        value: usernameValue,
                        validateStatus: 'error',
                        errorMsg: 'This username is already taken'
                    }
                });
            }
        }).catch(error => {
            // Marking validateStatus as success, Form will be recchecked at server
            this.setState({
                username: {
                    value: usernameValue,
                    validateStatus: 'success',
                    errorMsg: null
                }
            });
        });
    }

    validateEmailAvailability() {
        // First check for client side errors in email
        const emailValue = this.state.email.value;
        const emailValidation = this.validateEmail(emailValue);

        if(emailValidation.validateStatus === 'error') {
            this.setState({
                email: {
                    value: emailValue,
                    ...emailValidation
                }
            });
            return;
        }

        this.setState({
            email: {
                value: emailValue,
                validateStatus: 'validating',
                errorMsg: null
            }
        });

        checkEmailAvailability(emailValue)
        .then(response => {
            if(response.available) {
                this.setState({
                    email: {
                        value: emailValue,
                        validateStatus: 'success',
                        errorMsg: null
                    }
                });
            } else {
                this.setState({
                    email: {
                        value: emailValue,
                        validateStatus: 'error',
                        errorMsg: 'This Email is already registered'
                    }
                });
            }
        }).catch(error => {
            // Marking validateStatus as success, Form will be recchecked at server
            this.setState({
                email: {
                    value: emailValue,
                    validateStatus: 'success',
                    errorMsg: null
                }
            });
        });
    }

    validatePassword = (password) => {
        if(password.length < PASSWORD_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Password is too short (Minimum ${PASSWORD_MIN_LENGTH} characters needed.)`
            }
        } else if (password.length > PASSWORD_MAX_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `Password is too long (Maximum ${PASSWORD_MAX_LENGTH} characters allowed.)`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null,
            };
        }
    }

}

export default EditableTable;