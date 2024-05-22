import React, { useEffect, useState } from 'react'
import logo from '../img/main-logo.svg';
import { useNavigate } from 'react-router';
import { Password } from '@mui/icons-material';
import Cookies from "js-cookie";

function Login() {
  let nav = useNavigate();

  const [userdata, setuserdata] = useState({ username: '', Password: '' });
  // console.log(userdata);

  let checklogin = ()=>{

    let userdata = Cookies.get('user');
    console.log(userdata);

    if(userdata){
      nav('/dashboard');
    }
  }

  useEffect(()=>{

    checklogin();
  },[]);
  

  const loginHandler = async (e) => {

    e.preventDefault();

    try {

      let response = await fetch('http://localhost:5000/login', {

        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userdata)
      });

      response = await response.json();
      if (response.status) {
        Cookies.set('user',JSON.stringify(response));
        nav("/dashboard");
      }
    }
    catch (err) {
      console.log(err.message)
      alert('something went wrong');
    }
    
  };
  return (

    <div className='bg-[#F5F7FF] w-full h-[100vh] flex justify-center items-center'>
      <div className='w-[500px]  bg-white px-[50px] py-[50px] '>
        <img src={logo} alt="" width={180} className='mb-5' />
        <h3 className='text-black text-[16px] font-[400]'>Sign in to continue.</h3>
        <form action="" onSubmit={loginHandler}>
          <input type="text" name='Username' className='mt-5 px-7 text-[16px] focus:outline-blue-400 w-full h-[50px] border border-1 border-[#c5c0c0]' placeholder='Username' onChange={(e) => (setuserdata({ ...userdata, username: e.target.value }))} />
          <input type="text" name='User_password' className='mt-6 mb-5 px-7 text-[16px] focus:outline-blue-400 w-full h-[50px] border border-1 border-[#c5c0c0]' placeholder='Password' onChange={(e) => (setuserdata({ ...userdata, password: e.target.value }))} />

          <button type="submit" className='w-full bg-[#4B49AC] text-center text-[30px] text-white py-5 rounded-[18px]  font-sans font-[400]' >Submit</button>
          <div className='flex items-center mt-4 justify-between mb-4'>
            <div className='flex items-center text-[gray] font-sans'> <input type="checkbox" className='mr-3 w-[17px] h-[17px]  appearance-none outline outline-2 outline-blue-700' />Keep me signed in</div>
            <div className='flex items-center text-[black] font-sans'>
              Forgot password? </div>
          </div>
        </form>
      </div>
    </div>

  )
}

export default Login