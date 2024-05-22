import React, { useContext, useState, useEffect } from 'react'
import Header from '../Common/Header'
import Sidebar from '../Common/Sidebar'
// import DashboardItems from '../Common/DashboardItems'
import Footer from '../Common/Footer'
import { mainContext } from '../Context'
import { useNavigate } from 'react-router'
import { useParams } from 'react-router'
// import prev from '../img/generic-image-file-icon-hi.png'
// import AdminForms from '../Common/AdminForms'

function Adddesign() {
  let { changemenu } = useContext(mainContext);
  let nav = useNavigate();
  let { id } = useParams();
  const [designData, setdesignData] = useState({});
  console.log(designData);

  const fetchDesignbyid = async () => {
    let res = await fetch(`http://localhost:5000/getDesign_byid/${id}`);
    res = await res.json();
    setdesignData(res.data);
  }
  useEffect(() => {
    if (id) {
      fetchDesignbyid();
    }
    else {
      setdesignData({});
    }
  }, []);


  const formSumbitHandle = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    if (!id) {
      let response = await fetch('http://localhost:5000/AddDesign', {
        method: 'POST',
        body: data
      });
      response = await response.json();
      if (response.data) {
        nav('/viewdesign');
      }
      else {
        alert(response.message);
      }
    }
    else {
      let response = await fetch(`http://localhost:5000/updateDesign/${id}`, {
        method: 'PUT',
        body: data
      });
      console.log(response)
      nav('/viewdesign');
    }
  }


  return (
    <div>
      <Header />
      <div className='flex  bg-[#F5F7FF]'>
        <Sidebar />
        <div className={` ${changemenu == true ? 'w-[95%]' : 'w-[84%]'} relative px-[30px] pt-[20px] pb-[60px]  bg-[#F5F7FF]`}>
          <h1 className='text-[25px] font-[500] mb-[10px]'>
            Weclome to Add Design
          </h1>
          <div className=''>
            <div className='bg-white w-[100%] mb-[50px] p-4 h-full rounded-[20px]'>
              <form action="" onSubmit={formSumbitHandle}>
                Design Name
                <input type="text" name='designname' value={designData.designname} onChange={(e) => { setdesignData({ ...designData, designname: e.target.value }) }} className='border px-4 border-gray-400 w-full h-[50px] mb-3 mt-2 ' />
                Design Price
                <input type="text" name='designprice' value={designData.designprice} onChange={(e) => { setdesignData({ ...designData, designprice: e.target.value }) }} className='border px-4 border-gray-400 w-full h-[50px] mb-3 mt-2 ' />
                Design Description
                <textarea type="text" name='designdescription' value={designData.designdescription} onChange={(e) => { setdesignData({ ...designData, designdescription: e.target.value }) }} className='border px-4 pt-3 border-gray-400 my-2 w-full h-[100px]' cols="30" rows="10"></textarea>
                
                Design Status
                <div className='flex items-center mt-5  mb-8 gap-2'>
                  <input type="radio" name='designstatus' checked={designData.designstatus === true||true}  value={true} onChange={(e) => { setdesignData({ ...designData, designstatus: e.target.value }) }} className='mx-2 w-[20px] h-[20px] text-[20px]' /> Active
                  <input type="radio"name='designstatus' checked={designData.designstatus === false} value={false} onChange={(e) => { setdesignData({ ...designData, designstatus: e.target.value }) }} className='mx-2 w-[20px] h-[20px] text-[20px]' /> Deactive
                </div>

                <input type="submit" className='bg-[#4B49AC] mb-8 mt-7 text-[18px] px-8 py-2 rounded-[10px] text-white' />
                <input type="reset" value="Cancel" className='bg-[#F8F9FA] ml-4  text-[18px] px-8 py-2 rounded-[10px] text-black' />
              </form>
            </div>
          </div>
          <Footer className />
        </div>
      </div>

    </div>
  )
}

export default Adddesign;