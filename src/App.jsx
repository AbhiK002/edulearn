import { useState, useEffect } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import config from './config.js'
import './App.css'
import Home from './components/home/Home.jsx'
import GetStarted from './components/getStarted/GetStarted.jsx'
import About from './components/about/About.jsx'
import Courses from './components/courses/Courses.jsx'
import Course from './components/course/Course.jsx'
import Contact from './components/contact/Contact.jsx'
import Profile from './components/profile/Profile.jsx'

function NavBar(props) {
  const userDetails = props.userDetails;
  let isLoggedIn = false;
  if (userDetails._id) isLoggedIn = true;

  const navigate = useNavigate();
  const location = useLocation();
  const isLinkActive = (path) => {
    return location.pathname === path;
  };

  const [navVisible, setNavVisible] = useState(false);
  function toggleNav() {
    setNavVisible(!navVisible)
  }

  return (
    <header>
      <div className="brand-div" onClick={() => navigate(config.homePage)} tabIndex={1}>
        <img src={"/logo.png"} alt="Logo" className="logo-img" width={64} />
        <h1>EduLearn</h1>
      </div>
      <nav className={navVisible ? 'visible' : ''}>
        <button className='close-nav critical' onClick={toggleNav}>X</button>
        <span className={`nav-link ${isLinkActive(config.homePage) ? 'active' : ''}`} onClick={() => {toggleNav(); navigate(config.homePage)}} tabIndex={1}>Home</span>
        {/* <span className={`nav-link ${isLinkActive(config.aboutPage) ? 'active' : ''}`} onClick={() => navigate(config.aboutPage)} tabIndex={1}>About</span> */}
        <span className={`nav-link ${isLinkActive(config.coursesPage) ? 'active' : ''}`} onClick={() => {toggleNav(); navigate(config.coursesPage)}} tabIndex={1}>Courses</span>
        <span className={`nav-link ${isLinkActive(config.profilePage) ? 'active' : ''}`} onClick={() => {toggleNav(); navigate(config.profilePage)}} tabIndex={1}>Profile</span>
        {/* <span className={`nav-link ${isLinkActive(config.contactPage) ? 'active' : ''}`} onClick={() => navigate(config.contactPage)} tabIndex={1}>Contact</span> */}
      </nav>
      <span className='nav-buttons'>
        <button type='button' className="nav-toggle" onClick={toggleNav}>
          <span className="line"></span><span className="line"></span><span className="line"></span>
        </button>
        {
          isLoggedIn ?
          <button type='button' className="profile outline" onClick={() => {navigate(config.profilePage)}}>{userDetails.fullname.split(" ")[0]}</button> :
          <button type='button' className="sign-up critical" onClick={() => navigate(config.getStartedPage)}>Log In</button>
        }
      </span>
    </header>
  );
}

function App() {
  let [currUser, setCurrUser] = useState({});
  let [courses, setCourses] = useState([]);
  let [refreshCourses, setRefreshCourses] = useState(0);
  function refreshApp() {
    setRefreshCourses(refreshCourses+1)
  }

  useEffect(() => {
    axios.get(config.getBackendUrl("/get-courses")).then(res => {
      if (res.data.valid) {
        let list = res.data.data;
        list.sort((a, b) => {
          if (a.coming_soon && !b.coming_soon) return 1;
          return -1;
        })
        setCourses(list);
      }
      else {
        console.error("error retrieving courses")
      }
    }).catch(err => {
      console.error("error retrieving courses")
    })
  }, [refreshCourses])
  
  useEffect(() => {
    const token = localStorage.getItem(config.tokenKey);
    const checkTokenValidity = () => {
      if (token) {
        axios.post(
            config.getBackendUrl("/autologin-edlearn"),
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
          .then(response => {
            const { user, valid } = response.data;

            if (valid && user) {
              setCurrUser({
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                role: user.role,
                courses_bought: user.courses_bought
              });
            } else {
              setCurrUser({});
              localStorage.removeItem(config.tokenKey);
            }
          })
          .catch(error => {
            console.error('Error checking token validity:', error.message);
            localStorage.removeItem(config.tokenKey);
          });
      }
    };

    checkTokenValidity();
  }, [refreshCourses]);

  return (
    <div className='app-container'>
      <ToastContainer />
      <NavBar userDetails={currUser} />
      <main>
        <Routes>

          <Route path={config.homePage} Component={() => {return <Home userDetails={currUser} courses={courses} />}}></Route>
          <Route path={config.aboutPage} Component={About}></Route>
          <Route path={config.getStartedPage} Component={() => {return <GetStarted userDetails={currUser} setUserDetails={setCurrUser} />}}></Route>
          <Route path={config.coursesPage} Component={() => {return <Courses courses={courses} />}}></Route>
          <Route path={config.coursePage + "/:id"} Component={() => {return <Course refreshApp={refreshApp} userDetails={currUser} setUserDetails={setCurrUser} />}}></Route>
          <Route path={config.contactPage} Component={Contact}></Route>
          <Route path={config.profilePage} Component={() => {return <Profile currUser={currUser} setCurrUser={setCurrUser} coursesList={courses} />}}></Route>
          <Route path='/*' Component={() => {return <h1>404 Page Not Found</h1>}}></Route>

        </Routes>
      </main>
    </div>
  )
}

export default App
