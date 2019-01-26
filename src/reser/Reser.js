import React, { Component } from 'react';

import ReactDOM from 'react-dom';

import {getReserData, getAllReser, saveCodeDelete, saveCodeModify, saveCode, checkUsernameAvailability } from '../util/APIUtils';
import '../reser/Reser.css';
import { Link, withRouter } from 'react-router-dom';
import {
CODE_MAX_LENGTH,CODE_MIN_LENGTH,
    EMAIL_MAX_LENGTH,
        KIND_MIN_LENGTH, KIND_MAX_LENGTH
} from '../constants';
import { getAllUsers } from '../util/APIUtils';

import { Row, Col,DatePicker,Form,AutoComplete, Mention, Input, Button, Divider, notification, Modal, Table } from 'antd';

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
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
  { value: '6', label: '6' },
  { value: '7', label: '7' },
  { value: '8', label: '8' },
  { value: '9', label: '9' },
  { value: '10', label: '10'},
  { value: '11', label: '11'},
  { value: '12', label: '12' },
  { value: '13', label: '13' },
  { value: '14', label: '14' },
  { value: '15', label: '15' },
  { value: '16', label: '16' },
  { value: '17', label: '17' },
  { value: '18', label: '18' },
  { value: '19', label: '19' },
  { value: '20', label: '20' },
  { value: '21', label: '21' },
  { value: '22', label: '22' },
  { value: '23', label: '23' },
  { value: '24', label: '24' },
  { value: '25', label: '25' },
  { value: '26', label: '26' },
  { value: '27', label: '27' },
  { value: '28', label: '28' },
  { value: '29', label: '29' },
  { value: '30', label: '30' },
  { value: '31', label: '31' },
  { value: '32', label: '32' },
  { value: '33', label: '33' },
  { value: '34', label: '34' },
  { value: '35', label: '35' },
  { value: '36', label: '36' }
]



const Option = Select.Option;

function onChange(date, dateString) {
  console.log(date, dateString);
}

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
    sorter: (a, b) => { return a.stol.localeCompare(b.stol)}},
                {
            title: 'STOLIK',
            dataIndex: 'stol',
            key: 'stol',
                }
            ,
            {
            title: 'OSOBA/FIRMA',
            dataIndex: 'kto',
            key: 'kto',
            }
            ,
            {
        title: 'DATA',
        dataIndex: 'data',
        key: 'data'
            }
            ,
             { title: 'OPCJE',
             dataIndex: '',
             key: 'x',
      render: (text, record) => (
        this.state.dataSource.length >= 1
          ? (
          <span>
            <Popconfirm title="Sure to delete?" onClick={() => this.setDelete(record.id, record.stol,record.kto,record.data)}
            onConfirm={() => this.handleDelete(record.id, record.stol,record.kto,record.data)}
            onCancel={() => this.handleCancel()}>
              <a href="#">Delete</a>
            </Popconfirm>
             </span>
          ) : null
      ),
    }];

this.state = {
            id: {
                value: ''
            },
            kto: {
                value: ''
            },
            stol: {
                value: '1'
            },
            data: {
                value: ''
            },
            dataSource:[],
            menuIsOpen: false,
                        menuIsOpen2: false

                    }
        this.handleInputChange = this.handleInputChange.bind(this);
//        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateStolAvailability = this.validateStolAvailability.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);;
  }

      componentDidMount(){

          const response = getAllReser(this.props.stol).then(json =>{
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
setStateKto = (val) =>{
this.setState({
kto:{value: val}
});
console.log(this.state)
}

      handleOk = (e) => {

        // before pressing ok
          const saveCodeRequest = {
              id: this.state.id.value,
              kto: this.state.kto.value,
              data: this.state.data.value,
              stol: this.state.stol.value,
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
              const response_update = getAllReser(this.props.stol).then(json =>{
              this.setState({dataSource:json})
          });
          }).catch(error => {
              notification.error({
                  message: 'Restaurant AI',
                  description: error.message || 'Sorry! Something went wrong. Please try again!'
              });
          });
          }


      handleCancel = (e) => {
        // Before canceling
        this.setState({

                   id: {
                       value: ''
                   },
                   kto: {
                       value: ''
                   },
                   stol: {
                       value: ''
                   },
                   data: {
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

        return !(
//        this.state.kto.validateStatus === 'success' &&
//            this.state.stol.validateStatus === 'success' &&
            this.state.data.validateStatus === 'success'
//            &&
        );
        }

    actAdd = () =>{
          this.setState({
          kto:{value: 'OGOLNY'},
          data:{value:''},
          stol:{value:''}
          });
    this.showModal()
    }

    actWszystkie = () =>{

        if (this.props.editable) {
          document.addEventListener('click', this.handleClickOutside, true);
        }
    }

        actData = () =>{
              const response2 = getReserData(this.state.data.value).then(json =>{
              this.setState({dataSource2:json})
              });
             }

  setDelete = (id,stol,kto,data) => {
              this.setState({
                id:{value: id},
                stol:{value: stol},
                kto:{value: kto},
                data:{value: data}
                              });

              console.log(this.state)
              }

  handleDelete = (id,stol,kto,data) => {
      const saveCodeRequest = {
      id: this.state.id.value,
      kto: this.state.kto.value,
      data: this.state.value.data,
      stol: this.state.stol.value,
      };
      saveCodeDelete(saveCodeRequest)
      .then(response => {
      notification.success({
      message: 'Restaurant AI',
      description: "Thank you! Succesfull modification!",
      });
      this.setState({
      kto:{value: ''},
      data:{value:''},
      stol:{value:''},
      visible: false,
      });
      const response_update = getAllReser(this.props.stol).then(json =>{
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
      stol: count,
      kto: `Edward King ${count}`,
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
    const index = newData.findIndex(item => row.stol === item.stol);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ dataSource: newData });
  }

  render() {
            let modalItems;

               modalItems =[
                           <div>
                           <Modal
                         title= 'Nowy kod'
                         visible={this.state.visible}
                         onOk={this.handleOk}
                         onCancel={this.handleCancel}
                         footer={[
                           <Button stol="back" onClick={this.handleCancel}>Anuluj</Button>,
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
          <DatePicker size = 'large'                  onChange={(...args) => {
                                                          console.log(args);
                                                          this.setState({ kto :{value: args[0].label}});
                                                        }
                                                      } />
          <br/>

          STOLIK:
          <br/>
     <Select name = 'select_one' options={options} style={{ width: 120 }}
     //var hiddenInputValue = ${("input[name='select_one']" ).val()};
     defaultValue={{ label: "OGÓLNY", value: 'OGOLNY' }}
       kto={this.state.kto.value}
                 onChange={(...args) => {
                     console.log(args);
                     this.setState({ kto :{value: args[0].label}});
                   }
                 }
       menuIsOpen={this.state.menuIsOpen}
       onMenuOpen={() => this.setState({ menuIsOpen: true })}
       onMenuClose={() => this.setState({ menuIsOpen: false })}
     />

                                     <FormItem label="Osoba/firma"
                                         hasFeedback
                                         validateStatus={this.state.stol.validateStatus}
                                         help={this.state.stol.errorMsg}>
                                         <Input
                                             size="large"
                                             name="stol"
                                             autoComplete="off"
                                             placeholder="A unique stol"
                                             value={this.state.stol.value}
                                             onBlur={this.validateStolAvailability}
                                             onChange={(event) => this.handleInputChange(event, this.validateStol)} />
                                     </FormItem>

                                 </Form>
                             </div>
                     </Modal>
                   </div>
            ];

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
                      <h1 className="page-title">Obsługa rezerwacji</h1>
                                  <div className="button-container">
                <Button className="but1" type="primary" size = 'large' onClick={this.actAdd} >
                Nowa rezerwacja
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

    validateKto = (kto) => {
        if(kto.length < KIND_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Kto is too short (Minimum ${KIND_MIN_LENGTH} characters needed.)`
            }
        } else if (kto.length > KIND_MAX_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `Kto is too long (Maximum ${KIND_MAX_LENGTH} characters allowed.)`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null,
              };
        }
    }



    validateStolAvailability() {

validateStatus: 'success'
    }

      validateStol = (code) => {
            if(code.length < CODE_MIN_LENGTH) {
                return {
                    validateStatus: 'error',
                    errorMsg: `code is too short (Minimum ${CODE_MIN_LENGTH} characters needed.)`
                }
            } else {
                return {
                    validateStatus: null,
                    errorMsg: null
                }
            }
        }


        validateValue = (data) => {
            if(data.value == '') {
                return {
                    validateStatus: 'error',
                    errorMsg: `Data must be bigger than 0`
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