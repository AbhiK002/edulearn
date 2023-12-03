import { useEffect, useState } from 'react'
import './course.css'
import configs from '../../config'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';

function Course({ refreshApp, userDetails, setUserDetails }) {
    const { id } = useParams();
    const [courseView, setCourseView] = useState({
        ...configs.sampleCourseDetails,
    })
    const navigate = useNavigate();
    const [videos, setVideos] = useState([]);
    const [videoMode, setVideoMode] = useState(false);
    const [hasPremium, setHasPremium] = useState(userDetails?.courses_bought?.includes(courseView._id) || userDetails?.role === "admin");
    const [payMode, setPayMode] = useState(false);

    useEffect(() => {
        axios.post(configs.getBackendUrl("/get-course"), { _id: id }).then(res => {
            if (res.data.valid) {
                setCourseView(res.data.data);
                setHasPremium(userDetails?.courses_bought?.includes(courseView._id) || userDetails?.role === "admin")
            }
            else {
                alert("error retrieving course")
            }
        }).catch(err => {
            alert("error retrieving course")
        })
    }, [id])
    useEffect(() => {
        setHasPremium(userDetails?.courses_bought?.includes(courseView._id) || userDetails?.role === "admin")
    })

    function buyCourse() {
        if (!userDetails?._id) {
            alert("Please log in to buy course");
            navigate(configs.getStartedPage);
            return;
        }
        if (hasPremium) {alert("You have already bought this course"); return;}

        // setPayMode(true);
        displayRazor();
    }

    function confirmBuyCourse(payment_id) {
        const token = localStorage.getItem(configs.tokenKey);

        axios.patch(configs.getBackendUrl("/buy-course"), {
            course_id: courseView._id,
            cost: courseView.cost,
            payment_id: payment_id
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => {
            if (res.data?.valid) {
                alert(res.data?.message);
                document.getElementsByClassName("buy-course-button")[0].setAttribute("disabled", "false");
                setUserDetails({ ...res.data?.data });
            }
            else {
                document.getElementsByClassName("buy-course-button")[0].setAttribute("disabled", "false");
                alert("could not buy course");
            }
        }).catch(err => {
            alert("could not buy course");
            document.getElementsByClassName("buy-course-button")[0].setAttribute("disabled", "false");
        })
    }

    const loadscript = (src) => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => {
                resolve(true);
            }
            script.onerror = () => {
                resolve(false);
            }

            document.body.appendChild(script);
        })

    }
    // on page Load , we are adding script.
    useEffect(() => {
        loadscript("https://checkout.razorpay.com/v1/checkout.js")
    }, [])

    function displayRazor() {
        axios.post(configs.getBackendUrl("/razorpay"), {
            cost: courseView.cost,
            course_id: courseView._id,
            user_id: userDetails?._id
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem(configs.tokenKey)}`
            }
        }).then(res => {
            const data = res.data;
            const option = {
                key: "rzp_test_1i2aLyMzJSJzaM",
                currency: data.currency,
                amount: data.amount,
                description: "Buy Premium Course",
                image: "/logo.png",
                handler: (res) => {
                    if (res.razorpay_payment_id) {
                        document.getElementsByClassName("buy-course-button")[0].setAttribute("disabled", "true");
                        confirmBuyCourse(res.razorpay_payment_id);
                    }
                },
                // name that will shown on the popUp
                prefill: {
                    name: userDetails?.fullname,
                    email: userDetails?.email,
                    contact: ""
                }
            }
            const paymentObject = new window.Razorpay(option);
            paymentObject.open();
        })
    }

    function playVideos() {
        const token = localStorage.getItem(configs.tokenKey);
        if (!hasPremium) alert("You haven't bought this course");

        axios.post(configs.getBackendUrl("/get-course-videos"), { course_id: courseView._id }, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => {
            if (res.data.valid) {
                if (res.data.data.length === 0) {
                    alert("No videos to display");
                }
                else {
                    setVideos([...res.data.data]);
                    setVideoMode(true);
                }
            }
            else {
                alert("error retrieving video")
            }
        }).catch(err => {
            alert("error retrieving videos")
        })
    }

    return <div className="course-main">
        <div className="left-pane">
            <h1>{courseView.title}</h1>
            <p className="course-summary">{courseView.summary}</p>
            <p className='course-description'>{courseView.description}</p>
        </div>
        <div className="right-pane">
            <div className="course-img-container">
                <img src={courseView.thumbnail === "" ? configs.sampleCourseDetails.thumbnail : courseView.thumbnail} alt="Course Image" className="course-img" width={300} />
            </div>
            <h2 className='course-cost'>Rs. {courseView.cost}</h2>
            {
                hasPremium ?
                    <>
                        <button type="button" className='buy-course-button critical' onClick={playVideos}>Start Learning</button>
                    </> :
                    <>
                        <button type="button" className='buy-course-button' onClick={buyCourse}>Buy Course</button>
                    </>
            }
        </div>
        {
            hasPremium && videoMode ?
                <CourseVideos courseView={courseView} videoList={videos} /> :
                <></>
        }
    </div>
}

function CourseVideos({ courseView, videoList }) {
    let [currVideo, setCurrVideo] = useState(0);
    let videoView = videoList[currVideo];
    const navigate = useNavigate();

    useEffect(() => {
        videoView = videoList[currVideo];
    }, [currVideo])

    return (
        <div className="video-main">
            <aside className="upcoming-videos">
                {
                    videoList.map((video, index) => {
                        return <div className={"upcoming-video " + (currVideo === index ? "viewing" : "")} key={index} onClick={() => { setCurrVideo(index) }}>
                            <h3 className="upcoming-title">{video.title}</h3>
                            <p>Week {video.week}, Day {video.day} </p>
                        </div>
                    })
                }
            </aside>
            <div className="video-preview">
                <div className='video-caption'>
                    <h1>{videoView?.title}</h1>
                    <p>Week {videoView?.week} Day {videoView?.day}</p>
                    <button className="close-videos" onClick={() => { navigate(configs.coursesPage) }}>Back</button>
                </div>
                <iframe src={videoView.url} frameborder="0" height={300} width={300}></iframe>
            </div>
        </div>
    )
}

export default Course