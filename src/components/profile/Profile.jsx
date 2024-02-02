import './profile.css'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import configs from '../../config.js';
import { toast } from 'react-toastify';

function Profile({ currUser, setCurrUser, coursesList }) {
    let isAdmin = false;
    if (currUser.role === "admin") {
        isAdmin = true;
    }
    const navigate = useNavigate();
    if (!currUser?._id) {
        navigate(configs.getStartedPage);
    }

    const adminActions = ["users", "courses", "payments", "highfives"];
    let [currAdminAction, setCurrAdminAction] = useState(0);
    let [refresh, setRefresh] = useState(0);
    function refreshPage() {
        setRefresh(refresh + 1);
    }
    let [users, setUsers] = useState([]);
    let [courses, setCourses] = useState([]);
    let [courseForm, setCourseForm] = useState({
        title: "", description: "", summary: "",
        thumbnail: "", instructor: "", cost: "", coming_soon: false
    })
    const courseOnChange = (e) => {
        const { name, value } = e.target;
        setCourseForm((courseForm) => ({ ...courseForm, [name]: value }));
    }
    function addCourse() {
        const token = localStorage.getItem(configs.tokenKey);
        axios.post(configs.getBackendUrl("/add-course"), {
            ...courseForm
        }, {
            headers:
            {
                Authorization: `Bearer ${token}`
            }
        }).then(res => {
            if (res.data.valid) {
                toast.info("course added");
                refreshPage();
            }
            else {
                toast.error("failed to add course")
            }
        }).catch(err => {
            toast.error("failed to add course")
        })
    }
    function editCourse() {
        const token = localStorage.getItem(configs.tokenKey);
        axios.post(configs.getBackendUrl("/edit-course"), {
            ...courseForm, _id: (courseView ? courseView : "haha") 
        }, {
            headers:
            {
                Authorization: `Bearer ${token}`
            }
        }).then(res => {
            if (res.data.valid) {
                toast.success("course edited");
                refreshPage();
            }
            else {
                toast.error("failed to edit course")
            }
        }).catch(err => {
            toast.error("failed to edit course")
        })
    }
    let [courseView, setCourseView] = useState(null);
    let [payments, setPayments] = useState([]);
    let [highfives, setHighfives] = useState([]);

    let [boughtCourses, setBoughtCourses] = useState([])
    let [userPayments, setUserPayments] = useState([])

    useEffect(() => {
        let li = coursesList.filter(course => {
            return (currUser?.courses_bought?.includes(course._id) || currUser?.role === "admin");
        })
        setBoughtCourses([...li]);
    }, [currUser])

    useEffect(() => {
        if (!currUser._id) {
            return;
        }
        const token = localStorage.getItem(configs.tokenKey)

        axios.get(configs.getBackendUrl("/get-payments"), {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => {
            if (res.data.valid) {
                setUserPayments(res.data.data)
            }
            else {
                toast.error("error retrieving payments")
            }
        }).catch(err => {
            toast.error("Error retrieving payments")
        })
    }, [currUser])

    return <div className="profile-main">
        <div className="profile-container">
            <h1>{currUser.fullname}</h1>
            <h2>{currUser.email}</h2>
            <button className="critical" onClick={() => {
                toast.success("Logged out successfully")
                localStorage.removeItem(configs.tokenKey);
                setCurrUser({});
                navigate(configs.homePage);
            }}>Log Out</button>
        </div>
        <div className="profile-container">
            <h1>My Courses</h1>
            <div className="courses-container">
                {
                    boughtCourses.map((course, index) => {
                        return <div className="course-card" key={index}>
                            <div className="course-img-container">
                            <img src={course.thumbnail !== "" ? course.thumbnail : configs.sampleCourseDetails.thumbnail} alt="Course Image" width={400} className="course-img" />
                            </div>
                            <div className="course-details">
                                <h2 className='course-title'>{course.title}</h2>
                                <p className="course-instructor">{course.instructor}</p>
                                <h5 className="course-summary">{course.summary}</h5>
                                <button className={"course-view-button secondary " + (course.coming_soon ? "coming-soon" : "")} onClick={() => {if (!course.coming_soon) navigate(configs.coursePage + "/" + course._id);}} disabled={course.coming_soon}>{course.coming_soon ? "Coming Soon" : "View Course"}</button>
                            </div>
                        </div>
                    })
                }
            </div>
        </div>
        <div className="profile-container">
            <h1>My Payments</h1>
            <div className="payments-container">
                {
                    userPayments.map((payment, index) => {
                        return <div className="payment-card" key={index}>
                            <h2 className='payment-id'>{payment.payment_id}</h2>
                            <p className="payment-amount">Rs. {payment.amount}</p>
                        </div>
                    })
                }
            </div>
        </div>
    </div>
}

export default Profile