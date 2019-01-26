import React, { Component } from 'react';

import ReactDOM from 'react-dom';

import { getAllCodes, saveCodeDelete, saveCodeModify, saveCode, checkUsernameAvailability } from '../util/APIUtils';
import '../user/signup/Signup.css';
import { Link, withRouter } from 'react-router-dom';
import {
    CODE_MIN_LENGTH, CODE_MAX_LENGTH,
    EMAIL_MAX_LENGTH,
        KIND_MIN_LENGTH, KIND_MAX_LENGTH
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


const options = [
  { value: 'OGOLNY', label: 'OGÓLNY' },
  { value: 'KLIENT', label: 'KLIENT' }
]

const options2 = [
  { value: '%', label: '%' },
  { value: 'zl', label: 'zł' }
]


const Option = Select.Option;

function handleChange(value) {
  console.log(value);

}

function handleBlur() {
  console.log('blur');
}

function handleFocus() {
  console.log('focus');
}

function handleChange2(value) {
  console.log(`selected ${value}`);
}

function handleBlur2() {
  console.log('blur');
}

function handleFocus2() {
  console.log('focus');
}

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
    key:'id',
    sorter: (a, b) => { return a.code.localeCompare(b.code)}},
                {
            title: 'KOD',
            dataIndex: 'code',
            key: 'code',
                        sorter: (a, b) => { return a.code.localeCompare(b.code)}
                }
            ,
            {
            title: 'RODZAJ',
            dataIndex: 'kind',
            key: 'kind',
            sorter: (a, b) => { return a.kind.localeCompare(b.kind)}
            }
            ,
            {
        title: 'WARTOŚĆ',
        dataIndex: 'value',
        key: 'value',
        render: (text,row) => <text>{text + ' ' + row.type}</text>
            }
            ,
             { title: 'OPCJE',
             dataIndex: '',
             key: 'x',
      render: (text, record) => (
        this.state.dataSource.length >= 1
          ? (
          <span>
            <Popconfirm title="Sure to delete?" onClick={() => this.setDelete(record.id, record.code,record.kind,record.value,record.type)}
            onConfirm={() => this.handleDelete(record.id, record.code,record.kind,record.value,record.type)}
            onCancel={() => this.handleCancel()}>
              <a href="#">Delete</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a href="#" onClick={() => this.actMod(record.id, record.kind, record.code, record.type,record.value)}>Edytuj</a>
             </span>
          ) : null
      ),
    }];

this.state = {
            id: {
                value: ''
            },
            kind: {
                value: ''
            },
            code: {
                value: ''
            },
            value: {
                value: ''
            },
            type: {
                value: ''
            },
            dataSource:[],
            user_action: 'add',
            menuIsOpen: false,
                        menuIsOpen2: false

                    }
        this.handleInputChange = this.handleInputChange.bind(this);
//        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateCodeAvailability = this.validateCodeAvailability.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);;
  }

      componentDidMount(){

          const response = getAllCodes(this.props.code).then(json =>{
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
setStateKind = (val) =>{
this.setState({
kind:{value: val}
});
console.log(this.state)
}

      handleOk = (e) => {
      if(this.state.user_action=='add'){
        // before pressing ok
          const saveCodeRequest = {
              id: this.state.id.value,
              kind: this.state.kind.value,
              value: this.state.value.value,
              code: this.state.code.value,
              type: this.state.type.value
          };
          console.log(this.state);
          saveCode(saveCodeRequest)
          .then(response => {
              notification.success({
                  message: 'Restaurant AI',
                  description: "Thank you! You're successfully registered. Please Login to continue!",
              });
                    this.setState({
          visible: false,
        });
              const response_update = getAllCodes(this.props.code).then(json =>{
              this.setState({dataSource:json})
          });
          }).catch(error => {
              notification.error({
                  message: 'Restaurant AI',
                  description: error.message || 'Sorry! Something went wrong. Please try again!'
              });
          });}else if(this.state.user_action='modify'){        // before pressing ok
          console.log('modify')
                                                                 const saveCodeRequest = {
                                                                    id: this.state.id.value,
                                                                     kind: this.state.kind.value,
                                                                     value: this.state.value.value,
                                                                     code: this.state.code.value,
                                                                     type: this.state.type.value
                                                                 };
                                                                 saveCodeModify(saveCodeRequest)
                                                                 .then(response => {
                                                                     notification.success({
                                                                         message: 'Restaurant AI',
                                                                         description: "Thank you! Succesfull modification!",
                                                                     });
                                                                           this.setState({
                                                                                     kind:{value: ''},
                                                                                     value:{value:''},
                                                                                     code:{value:''},
                                                                                     type:{value:''},
                                                                 visible: false,
                                                               });
                                                                     const response_update = getAllCodes(this.props.code).then(json =>{
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
                   kind: {
                       value: ''
                   },
                   code: {
                       value: ''
                   },
                   value: {
                       value: ''
                   },
                   type: {
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
//        this.state.kind.validateStatus === 'success' &&
//            this.state.code.validateStatus === 'success' &&
            this.state.value.validateStatus === 'success'
//            &&
//            this.state.type.validateStatus === 'success'
        );
        }else if (this.state.user_action=='modify'){
                    this.state.value.validateStatus === 'success'
//                    &&
//                    this.state.type.validateStatus === 'success'
        }
    }

    actAdd = () =>{
          this.setState({
          kind:{value: 'OGOLNY'},
          value:{value:''},
          code:{value:''},
          type:{value:'%'},
            user_action: 'add',
          });
    this.showModal()
    }


        actMod = (id, kind, code,type,value) =>{
              this.setState({
                user_action: 'modify',
                id:{value: id},
                value:{value: value},
                code: {value: code},
                kind: {value: kind},
                type:{value: type},
              });
        this.showModal()
        }

  setDelete = (id,code,kind,value,type) => {
              this.setState({
                id:{value: id},
                code:{value: code},
                kind:{value: kind},
                value:{value: value},
                type:{value: 'du'}
              });
              console.log(this.state)
              }

  handleDelete = (id,code,kind,value,type) => {
      const saveCodeRequest = {
      id: this.state.id.value,
      kind: this.state.kind.value,
      value: this.state.value.value,
      code: this.state.code.value,
      type: this.state.type.value
      };
      saveCodeDelete(saveCodeRequest)
      .then(response => {
      notification.success({
      message: 'Restaurant AI',
      description: "Thank you! Succesfull modification!",
      });
      this.setState({
      kind:{value: ''},
      value:{value:''},
      code:{value:''},
      type:{value:''},
      visible: false,
      });
      const response_update = getAllCodes(this.props.code).then(json =>{
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
      code: count,
      kind: `Edward King ${count}`,
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
    const index = newData.findIndex(item => row.code === item.code);
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
                         title= 'Nowy kod'
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
  <Select name = 'select_one' options={options}
  //var hiddenInputValue = ${("input[name='select_one']" ).val()};
  defaultValue={{ label: "OGÓLNY", value: 'OGOLNY' }}
    kind={this.state.kind.value}
              onChange={(...args) => {
                  console.log(args);
                  this.setState({ kind :{value: args[0].label}});
                }
              }
  //  onChange={kind => this.setState({ kind :{value: 'dupadu'}})}
  //  inputValue={this.state.kind.value}
  //  onInputChange={  this.inputValue=this.state.kind.value}
    menuIsOpen={this.state.menuIsOpen}
    onMenuOpen={() => this.setState({ menuIsOpen: true })}
    onMenuClose={() => this.setState({ menuIsOpen: false })}
  />
                                     <FormItem label="KOD"
                                         hasFeedback
                                         validateStatus={this.state.code.validateStatus}
                                         help={this.state.code.errorMsg}>
                                         <Input
                                             size="large"
                                             name="code"
                                             autoComplete="off"
                                             placeholder="A unique code"
                                             value={this.state.code.value}
                                             onBlur={this.validateCodeAvailability}
                                             onChange={(event) => this.handleInputChange(event, this.validateCode)} />
                                     </FormItem>
                                     <FormItem
                                         label="WARTOŚĆ"
                                                                                     hasFeedback
                                                                                     validateStatus={this.state.value.validateStatus}
                                                                                     help={this.state.value.errorMsg}>
                                         <Input
                                             size="large"
                                             name="value"
                                             type="value"
                                             autoComplete="off"
                                             placeholder="Code value"
                                             value={this.state.value.value}
                                             onChange={(event) => this.handleInputChange(event, this.validateValue)} />
                                     </FormItem>
<Select options={options2}
defaultValue={{ label: "%", value: '%' }}
  type={this.state.type.value}
            onChange={(...args) => {
                console.log(args);
                this.setState({ type :{value: args[0].label}});
              }
            }
//  inputValue={this.state.type.value}
//  onInputChange={  this.inputValue=this.state.type.value}
  menuIsOpen2={this.state.menuIsOpen2}
  onMenuOpen={() => this.setState({ menuIsOpen2: true })}
  onMenuClose={() => this.setState({ menuIsOpen2: false })}
/>
                                 </Form>
                             </div>
                     </Modal>
                   </div>
            ];
            } else if (this.state.user_action == 'modify'){

              modalItems = [
                                            <div>
                                    <Modal
                          title='Modyfikuj kod'
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
<Select options={options}
defaultValue={{ label: "OGÓLNY", value: 'OGOLNY' }}
  kind={this.state.kind.value}
            onChange={(...args) => {
                console.log(args);
                this.setState({ kind :{value: args[0].label}});
              }
            }
//  inputValue={this.state.kind.value}
//  onInputChange={  this.inputValue=this.state.kind.value}
  menuIsOpen={this.state.menuIsOpen}
  onMenuOpen={() => this.setState({ menuIsOpen: true })}
  onMenuClose={() => this.setState({ menuIsOpen: false })}
/>
                                        <FormItem label="KOD"
                                            hasFeedback
                                            help={this.state.code.errorMsg}>
                                            <Mention
                                                size="large"
                                                name="code"
                                                placeholder={this.state.code.value}
                                                disabled/>
                                        </FormItem>
                                        <FormItem
                                            label="WARTOŚĆ"
                                            hasFeedback
                                            validateStatus={this.state.value.validateStatus}
                                            help={this.state.value.errorMsg}>
                                            <Input
                                                size="large"
                                                name="value"
                                                type="value"
                                                autoComplete="off"
//                                                placeholder="Code value"
                                                value={this.state.value.value}
                                             onChange={(event) => this.handleInputChange(event, this.validateValue)} />
                                        </FormItem>
<Select options={options2}
defaultValue={{ label: "%", value: '%' }}
  type={this.state.type.value}
            onChange={(...args) => {
                console.log(args);
                this.setState({ type :{value: args[0].label}});
              }
            }//  inputValue={this.state.type.value}
//  onInputChange={  this.inputValue=this.state.type.value}
  menuIsOpen2={this.state.menuIsOpen2}
  onMenuOpen={() => this.setState({ menuIsOpen2: true })}
  onMenuClose={() => this.setState({ menuIsOpen2: false })}
/>
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
                      <h1 className="page-title">Zarządzaj kodami</h1>
                                  <div className="button-container">
                <Button type="primary" size = 'large' onClick={this.actAdd} >
                Nowy kod
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

    validateKind = (kind) => {
        if(kind.length < KIND_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Kind is too short (Minimum ${KIND_MIN_LENGTH} characters needed.)`
            }
        } else if (kind.length > KIND_MAX_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `Kind is too long (Maximum ${KIND_MAX_LENGTH} characters allowed.)`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null,
              };
        }
    }

    validateCode = (code) => {
        if(code.length < CODE_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `code is too short (Minimum ${CODE_MIN_LENGTH} characters needed.)`
            }
        } else if (code.length > CODE_MAX_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `Code is too long (Maximum ${CODE_MAX_LENGTH} characters allowed.)`
            }
        } else {
            return {
                validateStatus: null,
                errorMsg: null
            }
        }
    }

    validateCodeAvailability() {
        // First check for client side errors in code
//        const codeValue = this.state.code.value;
//        const codeValidation = this.validateCode(codeValue);
//
//        if(codeValidation.validateStatus === 'error') {
//            this.setState({
//                code: {
//                    value: codeValue,
//                    ...codeValidation
//                }
//            });
//            return;
//        }
//
//        this.setState({
//            code: {
//                value: codeValue,
//                validateStatus: 'validating',
//                errorMsg: null
//            }
//        });

//        checkCodeAvailability(codeValue)
//        .then(response => {
//            if(response.available) {
//                this.setState({
//                    code: {
//                        value: codeValue,
//                        validateStatus: 'success',
//                        errorMsg: null
//                    }
//                });
//            } else {
//                this.setState({
//                    code: {
//                        value: codeValue,
//                        validateStatus: 'error',
//                        errorMsg: 'This code is already taken'
//                    }
//                });
//            }
//        }).catch(error => {
//            // Marking validateStatus as success, Form will be recchecked at server
//            this.setState({
//                code: {
//                    value: codeValue,
//                    validateStatus: 'success',
//                    errorMsg: null
//                }
//            });
//        });
validateStatus: 'success'
    }

        validateValue = (value) => {
            if(value.value == '') {
                return {
                    validateStatus: 'error',
                    errorMsg: `Value must be bigger than 0`
                }
            }else {
                return {
                    validateStatus: 'success',
                    errorMsg: null
                }
            }
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

    }

}

export default EditableTable;