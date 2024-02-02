import { useState } from 'react'
import './getStarted.css'
import axios from 'axios';
import configs from '../../config';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function GetStarted(props) {
    const navigate = useNavigate();
    const userDetails = props?.userDetails;
    if (userDetails && userDetails._id) {
        navigate(configs.homePage);
    }

    const [isRegistered, setIsRegistered] = useState(true);
    const [loginFormData, setLoginFormData] = useState({
        fullname: "",
        email: "",
        password: "",
        confirmpass: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    function loginSubmitCallback(e) {
        e.preventDefault()

        if (validateForm()) {
            if (isRegistered) {
                login()
            }
            else {
                register()
            }
        }
    }

    function login() {
        axios.post(configs.getBackendUrl("/login-edlearn"), {
            email: loginFormData.email,
            password: loginFormData.password
        })
        .then((response) => {
            const { user, token, valid, message } = response.data;

            if (valid) {
                localStorage.setItem(configs.tokenKey, token);
                props.setUserDetails(user);
                toast.success("Logged in successfully");
                navigate(configs.homePage);
            }
        })
        .catch((err) => {
            toast.error(err.response ? err.response.data.message : "Some error occurred");
        })
    }
    function register() {
        axios.post(configs.getBackendUrl("/register-edlearn"), {
            fullname: loginFormData.fullname,
            email: loginFormData.email,
            password: loginFormData.password
        })
        .then((response) => {
            const { user, token, valid, message } = response.data;

            if (valid) {
                localStorage.setItem(configs.tokenKey, token);
                props.setUserDetails(user);
                navigate(configs.homePage);
                toast.success("Registered successfully");
            }
        })
        .catch((err) => {
            toast.error(err.response ? err.response.data.message : "Some error occurred");
        })
    }

    function validateForm() {
        const { fullname, email, password, confirmpass } = loginFormData;

        if (!email.trim() || !password.trim() || (!isRegistered && (!fullname.trim() || !confirmpass.trim()) )) {
            toast.warning('All fields are required.');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.match(emailRegex)) {
            toast.warning('Please enter a valid email address.');
            return false;
        }

        if (password.length < 8) {
            toast.warning('Password must contain at least 8 characters.');
            return false;
        }

        if (!isRegistered && password !== confirmpass) {
            toast.warning('Password and Confirm Password must match.');
            return false;
        }

        return true;
    }
    function switchMode() {
        setIsRegistered(!isRegistered);
    }

    return <div className='getstarted-main'>
        <h1>{isRegistered ? 'Log In' : 'Register'}</h1>
        <form className="login-form" onSubmit={loginSubmitCallback}>
            {
                !isRegistered ?
                <div className="form-item">
                    <label htmlFor="fullname">Full Name</label>
                    <input type="text" onChange={handleChange} value={loginFormData.fullname} name="fullname" id="fullname" />
                </div> : <></>
            }
            <div className="form-item">
                <label htmlFor="email">Email</label>
                <input type="email" onChange={handleChange} value={loginFormData.email} name="email" id="email" />
            </div>
            <div className="form-item">
                <label htmlFor="password">Password</label>
                <input type="password" onChange={handleChange} value={loginFormData.password} name="password" id="password" />
            </div>
            {
                !isRegistered ? 
                <div className="form-item">
                    <label htmlFor="confirmpass">Confirm Password</label>
                    <input type="password" onChange={handleChange} value={loginFormData.confirmpass} name="confirmpass" id="confirmpass" />
                </div> : <></>
            }
            <div className="form-buttons">
                <button type="submit" className="login-button">{isRegistered ? "Login" : "Register"}</button>
                <button type='button' className="outline" onClick={switchMode}>{isRegistered ? "Register Instead" : "Log In Instead"}</button>
            </div>
        </form>
    </div>
}

export default GetStarted