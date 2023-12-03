import { useNavigate } from 'react-router-dom'
import configs from '../../config'
import { useState } from 'react'

import './home.css'
import axios from 'axios';

function Home(props) {
    const userDetails = props?.userDetails;

    let isLoggedIn = false;
    if (userDetails && userDetails._id) {
        isLoggedIn = true;
    }

    const navigate = useNavigate()
    let [courses, setCourses] = useState(props.courses);

    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };
    function clearForm() {
        setFormData({ ...formData, fullname: "", email: "", message: ""})
    }

    function contactSubmitCallback(e) {
        e.preventDefault()

        if (validateForm()) {
            postContact()
        }
    }
    function postContact() {
        axios.post(configs.getBackendUrl("/post-highfive"), {
            fullname: formData.fullname,
            email: formData.email,
            message: formData.message
        }).then(res => {
            if (res.data?.valid) {
                alert("Thanks for the high five!");
                clearForm();
            }
            else {
                alert("Some error occurred");
            }
        }).catch(err => {
            alert("Some error occurred")
        })
    }

    function validateForm() {
        const {fullname, email, message} = formData;

        if (!fullname.trim() || !email.trim() || !message.trim()) {
            alert("Please fill all the fields");
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.match(emailRegex)) {
            alert('Please enter a valid email address.');
            return false;
        }

        return true;
    }

    return <div className='home-main'>
        <section className="section landing" style={{backgroundImage: 'url("/books-bg.webp")'}}>
            <div className="content">
                <h1 className="landing-title">Unlock Your Potential with Lifelong Learning</h1>
                <p className="landing-desc">
                    Embark on a journey of knowledge and skill development. Our platform offers a diverse range of courses designed to meet your learning goals. 
                </p>
                <button className="getting-started secondary large" onClick={() => {navigate(isLoggedIn ? configs.coursesPage : configs.getStartedPage)}}>Get Started</button>
            </div>
        </section>
        <section className="section courses">
            <div className="content">
                <h1>Our Courses</h1>
                <div className="courses-container">
                    {
                        courses.map((course, index) => {
                            return <div className='course-card' key={index}>
                                <div className="course-img-container">
                                    <img src={course.thumbnail !== "" ? course.thumbnail : configs.sampleCourseDetails.thumbnail} alt="Course Image" width={400} className="course-img" />
                                </div>
                                <div className="course-details">
                                    <h3 className="course-title">{course.title}</h3>
                                    <span className="course-instructor">{course.instructor}</span>
                                    <div className="course-actions">
                                        <h4 className="course-cost">{course.cost}</h4>
                                        <button className={"course-view-button secondary " + (course.coming_soon ? "coming-soon" : "")} onClick={() => {if (!course.coming_soon) navigate(configs.coursePage + "/" + course._id);}} disabled={course.coming_soon}>{course.coming_soon ? "Coming Soon" : "View Course"}</button>
                                    </div>
                                </div>
                            </div>
                        })
                    }
                </div>
                <button className="view-all-courses-button large" onClick={()=>{navigate(configs.coursesPage)}}>Browse Courses</button>
            </div>
        </section>
        <section className="section about">
            <img src="/abt.webp" width={200} class="about-photo" alt="About Photo" />
            <div className="about-content">
                <h1>Who are we?</h1>
                <p>Our target is to Lorem ipsum, dolor sit amet consectetur adipisicing elit. Cumque quos repellat quisquam blanditiis nostrum ipsam.</p>
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus esse eveniet repellat facilis, sunt magni.
                </p>
            </div>
        </section>
        <section className="section info">
            <div className="content">
                <h1>Importance of DSA</h1>
                <div className="info-cards">
                    <div className="info-card" id='c1'>
                        <h2 className="info-title">Reason 1</h2>
                        <p className="info-desc">Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos cupiditate omnis blanditiis consectetur vitae animi inventore, rem deleniti obcaecati expedita dicta deserunt est itaque corporis.</p>
                    </div>
                    <div className="info-card" id='c2'>
                        <h2 className="info-title">Reason 2</h2>
                        <p className="info-desc">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi explicabo ipsa dolores officiis, excepturi culpa placeat, iste, expedita aspernatur earum voluptatibus consequuntur voluptates.</p>
                    </div>
                    <div className="info-card" id='c3'>
                        <h2 className="info-title">Reason 3</h2>
                        <p className="info-desc">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nam dolore corporis commodi nemo. Quod doloremque illum libero magni quo animi eum eius nihil voluptas.</p>
                    </div>
                </div>
            </div>
        </section>
        <section className="section contact" style={{backgroundImage: 'url("/contact-bg.jpg")'}}>
            <h1>Give us a Virtual High-Five</h1>
            <form className='contact-form' onSubmit={contactSubmitCallback}>
                <div className="form-item">
                    <label htmlFor="fullname">Full Name</label>
                    <input type="text" onChange={handleChange} value={formData.fullname} name="fullname" id="fullname" />
                </div>
                <div className="form-item">
                    <label htmlFor="email">Email</label>
                    <input type="email" onChange={handleChange} value={formData.email} name="email" id="email" />
                </div>
                <div className="form-item">
                    <label htmlFor="message">Message</label>
                    <textarea name="message" onChange={handleChange} value={formData.message} id="message" cols="20" rows="3"></textarea>
                </div>
                <div className="form-buttons">
                    <button type="submit" className='critical large'>Submit</button>
                    <button type="reset" className='critical outline large' onClick={clearForm}>Reset</button>
                </div>
            </form>
        </section>
    </div>
}

export default Home