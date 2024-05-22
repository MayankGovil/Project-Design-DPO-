import { faBook, faPeopleGroup, faSliders, faUsers, faVideo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const data = [
    {
        id:1,
        icon:<FontAwesomeIcon icon={faBook}/>,
        uid:"Design",
        sub1:"Add Design",
        sub2:"View Design",
        link1:'/adddesign',
        link2:'/viewdesign',
    },
    {
        id:2,
        icon:<FontAwesomeIcon icon={faVideo}/>,
        uid:"Products",
        sub1:"Add Products",
        sub2:"View Products",
        link1:'/addproduct',
        link2:'/viewproduct',

    },
    {
        id:3,
        icon:<FontAwesomeIcon icon={faSliders}/>,
        uid:"Slides",
        sub1:"Add Slides",
        sub2:"View Slides",
        link1:'/addslider',
        link2:'/viewslider',
    },
    {
        id:4,
        icon:<FontAwesomeIcon icon={faPeopleGroup}/>,
        uid:"Add Card",
        sub1:"Add Card",
        sub2:"View Card",
        link1:'/addcard',
        link2:'/viewcard',
    },
    {
        id:5,
        icon:<FontAwesomeIcon icon={faUsers}/>,
        uid:"User",
        sub1:"View User",
        sub2:"",
        link1:'/viewuser',
    },
   
]