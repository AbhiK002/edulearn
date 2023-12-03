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
        setFormData({ ...formData, fullname: "", email: "", message: "" })
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
        const { fullname, email, message } = formData;

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
        <section className="section landing" style={{ backgroundImage: 'url("/books-bg.webp")' }}>
            <div className="content">
                <h1 className="landing-title">Unlock Your Potential with Lifelong Learning</h1>
                <p className="landing-desc">
                    Embark on a journey of knowledge and skill development. Our platform offers a diverse range of courses designed to meet your learning goals.
                </p>
                <button className="getting-started secondary large" onClick={() => { navigate(isLoggedIn ? configs.coursesPage : configs.getStartedPage) }}>Get Started</button>
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
                                        <button className={"course-view-button secondary " + (course.coming_soon ? "coming-soon" : "")} onClick={() => { if (!course.coming_soon) navigate(configs.coursePage + "/" + course._id); }} disabled={course.coming_soon}>{course.coming_soon ? "Coming Soon" : "View Course"}</button>
                                    </div>
                                </div>
                            </div>
                        })
                    }
                </div>
                <button className="view-all-courses-button large" onClick={() => { navigate(configs.coursesPage) }}>Browse Courses</button>
            </div>
        </section>
        <section className="section about">
            <img src="/abt.webp" width={200} class="about-photo" alt="About Photo" />
            <div className="about-content">
                <h1>Who are we?</h1>
                <p>We are a team dedicated to creating an enriching learning experience for individuals around the globe. Our mission is to provide accessible and high-quality educational courses that empower learners to enhance their skills and knowledge.</p>
                <p>
                    Our dedicated educators and technologists collaborate to create a dynamic learning environment, empowering learners to thrive in an ever-evolving world.
                </p>
            </div>
        </section>
        <section className="section info">
            <div className="content">
                <h1>Importance of Computer Science</h1>
                <div className="info-cards">
                    <div className="info-card" id='c1'>
                        <h2 className="info-title">Innovation Catalyst</h2>
                        <p className="info-desc">
                            Computer Science drives innovation by enabling the creation of cutting-edge technologies, software, and applications. It fuels progress in various fields, from healthcare to communication, shaping the future of our interconnected world.
                        </p>
                    </div>

                    <div className="info-card" id='c2'>
                        <h2 className="info-title">Problem Solving</h2>
                        <p className="info-desc">
                            Computer Science equips individuals with problem-solving skills essential for addressing complex challenges. It teaches logical thinking, algorithmic problem-solving, and computational methods, fostering analytical prowess applicable across diverse disciplines.
                        </p>
                    </div>

                    <div className="info-card" id='c3'>
                        <h2 className="info-title">Digital Transformation</h2>
                        <p className="info-desc">
                            In the era of digital transformation, Computer Science plays a pivotal role in revolutionizing industries. From automating processes to advancing artificial intelligence, it propels businesses and society into a technology-driven future, enhancing efficiency and capabilities.
                        </p>
                    </div>

                </div>
            </div>
        </section>
        <section className="section contact" style={{ backgroundImage: 'url("/contact-bg.jpg")' }}>
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