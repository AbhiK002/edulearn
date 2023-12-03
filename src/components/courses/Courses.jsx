import { useNavigate } from 'react-router-dom';
import configs from '../../config';
import './courses.css'
import { useState } from 'react';

function Courses({courses}) {
    let [coursesView, setCoursesView] = useState(courses)
    const navigate = useNavigate();

    const iconEffect = (event) => {
        let i = document.getElementById("search");
        let s = document.getElementsByClassName('search-icon')[0];
        let c = document.getElementsByClassName('cleartext-button')[0];
        setTimeout(() => {
            if (i.value.length > 0) {
                let filteredCourses = coursesView.filter(course => {
                    return course.title.toLowerCase().includes(i.value.toLowerCase());
                })
                setCoursesView([...filteredCourses]);

                i.style.marginLeft = "24px";
                s.style.display = "none";
                c.style.visibility = "visible";
            }
            else {
                setCoursesView(courses);
                i.style.marginLeft = "0px";
                s.style.display = "flex";
                c.style.visibility = "hidden"
            }
        }, 1);
    }

    const clearText = () => {
        document.getElementById("search").value = "";
        iconEffect(null);
    }

    return <div className='courses-main'>
        <section className="course-nav">
            <h1>Our Courses</h1>
            <div className="search-bar" onKeyDown={iconEffect}>
                <div className="search-icon"></div>
                <input id="search" type="text" placeholder="Search courses" name="search" />
                <div className="cleartext-button" onMouseDown={clearText}>
                    <div className="clear-text"></div>
                </div>
                <span className="line"></span>
            </div>
        </section>
        <section className="courses-grid">
        {
            coursesView.map((course, index) => {
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
        </section>
    </div>
}

export default Courses