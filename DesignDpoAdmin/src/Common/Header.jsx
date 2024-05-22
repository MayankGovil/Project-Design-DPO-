import React, { useContext, useEffect } from 'react'
import logo from '../img/main-logo.svg'
import minlogo from '../img/main-logo.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { mainContext } from '../Context';
import Cookies from "js-cookie";
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
function Header() {

  const nav = useNavigate();

  
  let {changemenu,setchangeMenu} = useContext(mainContext);
  
  let checklogin = ()=>{

    let userdata = Cookies.get('user');
   
    if(!userdata){
      nav('/');
    }
  }

  useEffect(()=>{

    checklogin();
  },[]);

  let logout = ()=>{

    Cookies.remove('user');
    nav('/')
  }
  
  return (
    <>
      <header>
    <nav className="bg-white border-gray-200  py-2.5  shadow-lg relative z-[999]">
        <div className="flex  justify-between items-center mx-auto ">
            <div className={` duration-[0.5s] mx-5 cursor-pointer  ${changemenu==true ? 'w-[3%] ':'w-[16%]'}`}>
            <Link to={"/dashboard"} className="flex items-center">
              {
                changemenu==true ?
                <img src={minlogo} className="mr-3 h-6 sm:h-9"  />
                :
                <img src={logo} className="mr-3 h-6 sm:h-9"  />

              }
              
            </Link>
            </div>
            
            
            <div className={`flex items-center lg:order-2 w-[84%] duration-[0.5s] ${changemenu==true ? 'w-[97%]' : 'w-[84%]'}  justify-between`}>
                <FontAwesomeIcon icon={faBars} className='cursor-pointer' onClick={()=>setchangeMenu(!changemenu)}/>
                <div>
                <Link to={'/'}  onClick={logout} className="text-gray-800 cursor-pointer  focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800">Log Out</Link>
                <Link to={""}className=" bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">My Profile</Link>
                </div>
            
           
            </div>
        </div>
    </nav>
</header>
    
    </>
  )
}

export default Header