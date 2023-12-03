const prefix = ""
const configs = {
    getBackendUrl: (suffix) => {return "https://master-forky.up.railway.app" + suffix},
    sampleUserDetails: {
        _id: "h9h38hd92hn3d92",
        fullname: "Abhineet Kelley",
        email: "abhi@kelley.com",
        password: "ihbieuwhfouoiwe",
        role: "student",
        courses_bought: ["h9f28hf9203", "h29f83hfioh2", "huhdui3hodi"]
    },
    sampleCourseDetails: {
        _id: "28d81j0dn0120d",
        title: "Loading Title...",
        instructor: "Mr. ABC",
        description: "Loading description...",
        summary: "Loading summary...",
        thumbnail: "/courseThumb.png",
        comingSoon: false,
        cost: "Loading..."
    },
    sampleVideoDetails: {
        _id: "hf9h8f89h8fh3f",
        title: "Video Title",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui corporis veritatis vero! Obcaecati maxime facere vel sit deleniti eveniet fugit quibusdam voluptas! Ipsum.",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        week: 1,
        day: 1
    },
    tokenKey: "mh928m98cr2nu390mu302cmirmh492hr982cm4hr",

    homePage: `${prefix}/`,
    aboutPage: `${prefix}/about`,
    contactPage: `${prefix}/contact`,
    coursesPage: `${prefix}/courses`,
    coursePage: `${prefix}/course`,
    profilePage: `${prefix}/profile`,
    getStartedPage: `${prefix}/get-started`
}

export default configs