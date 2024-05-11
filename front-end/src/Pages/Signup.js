import React, { useContext, useState } from 'react'
import './Signin.css'
import axios from 'axios'
import { AuthContext } from '../Context/AuthContext.js'
import Switch from '@material-ui/core/Switch';
import { Dropdown } from 'semantic-ui-react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'
import {useHistory} from "react-router-dom"

function Signup() {
    const history  = useHistory();
 
    const [DateOfBirthString, setDateOfBirthString] = useState(null)
    const [address, setAddress] = useState()
    const [mobileNumber, setMobileNumber] = useState()
    const [email, setEmail] = useState()
    const [userFullName, setuserFullName] = useState()
    const [password, setPassword] = useState()
    const [error, setError] = useState("")

    const [gender, setGender] = useState(null)

    const [DateOfBirth, setDateOfBirth] = useState(null)


    const API_URL = process.env.REACT_APP_API_URL


    
    const genderTypes = [
        { value: "Nam", text: "Nam" },
        { value: "Nu", text: "Nữ" }
    ]


    const handleForm = async (e) => {
        e.preventDefault()
        if (
            userFullName !== "" &&
            DateOfBirthString !== "" &&
            gender !== "" &&
            address !== "" &&
            mobileNumber !== "" &&
            email !== "" &&
            password!== "")
            {
                const userData = {
                    userFullName: userFullName,
                    userType:"student",
                    isAdmin:false,
                    dob: DateOfBirthString,
                    gender: gender,
                    address: address,
                    mobileNumber: mobileNumber,
                    email: email,
                    password: password
                };

                try{
                    const response = await axios.post(API_URL+"api/auth/register",userData);
                    setuserFullName(null)
                    setAddress(null)
                    setMobileNumber(null)
                    setEmail(null)
                    setPassword(null)
                    setGender(null)
                    setDateOfBirth(null)
                    setDateOfBirthString(null)
                    alert("Đăng ký thành công!");
                    history.push("/signin")
                    
                }catch(e){
                    console.log(e);
                    setError("Đã xảy ra lỗi");
                }


            }
        
    }

    return (
        <div className='signin-container'>
            <div className="signin-card">
                <form onSubmit={handleForm}>
                    <h2 className="signin-title"> Đăng ký tài khoản</h2>
                    <p className="line"></p>

                    <div className="error-message"><p>{error}</p></div>
                    <div className="signin-fields">

                        <label htmlFor="userFullName"><b>Họ và tên</b><span className="required-field">*</span></label>
                        <input className="signin-textbox" type="text" name="userFullName" required onChange={(e) => setuserFullName(e.target.value)}></input>

                        <label htmlFor="userFullName"><b>Email</b><span className="required-field">*</span></label>
                        <input className="signin-textbox" type="text" name="email" required  onChange={(e) => setEmail(e.target.value)}></input>
                        <label htmlFor="password"><b>Mật khẩu</b><span className="required-field">*</span></label>

                        <input className='signin-textbox' type="password" minLength='6' placeholder="Nhập mật khẩu" name="psw" required onChange={(e) => { setPassword(e.target.value) }} />

                        <label htmlFor="mobileNumber"><b>Số điện thoại</b><span className="required-field">*</span></label>
                        <input className="signin-textbox" type="phone" required onChange={(e) => setMobileNumber(e.target.value)} ></input>

                        <label chtmlFor="dob">
                            <b>Ngày sinh</b><span className="required-field">*</span>
                        </label>

                        <DatePicker
                            className="date-picker"
                            placeholderText="dd/MM/yyyy"
                            selected={DateOfBirth}
                            onChange={(date) => {
                                setDateOfBirth(date);
                                setDateOfBirthString(moment(date).format('MM/DD/YYYY'))
                            }}
                            dateFormat="dd/MM/yyyy"
                            maxDate={new Date()}
                        />


                        <label htmlFor="gender"><b>Giới tính</b><span className="required-field">*</span></label>
                        <div className='semanticdropdown'>
                            <Dropdown
                                className="date-picker"
                                placeholder='Chọn giới tính'
                                fluid
                                selection
                                value={gender}
                                options={genderTypes}
                                onChange={(event, data) => setGender(data.value)}
                            />

                        </div>
                        <div className="ready-question">
                            <p>Chấp hành nghiêm quy định thư viện?</p>
                            <Switch color="primary" />
                        </div>
                        <button className="signin-button">Đăng ký</button>

                    </div>

                </form>
                <div className='signup-option'>
                    <p className="signup-question">Đã có tài khoản?<a className="forget-pass" href="/signin"> Đăng nhập</a></p>
                </div>
            </div>
        </div>
    )
}

export default Signup