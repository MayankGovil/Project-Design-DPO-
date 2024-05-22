import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { mainContext } from '../Context';
import Header from '../Common/Header';
import Sidebar from '../Common/Sidebar';
import Footer from '../Common/Footer';
import Cookies from 'js-cookie';

function ViewDesign() {
  let { changemenu } = useContext(mainContext);
  let nav = useNavigate();
  // const [designData, setdesignData] = useState({});
  const [designData, setdesignData] = useState([]);

  const [modalContent, setModalContent] = useState(null);

  const tokenAuth = Cookies.get('token');
  console.log(tokenAuth);


  const fetchdesigndata = async () => {
    let designs = await fetch('http://localhost:5000/ViewDesigns', {
      method: 'GET',
    });
    designs = await designs.json();
    if (designs.data) {
      setdesignData(designs.data);
    } else {
      alert(designs.message);
    }
  };

  useEffect(() => {
    fetchdesigndata();
  }, []);



  const handleStatus = async (e) => {
    setsearchValue('');
    const id = e.target.value;
    const status = e.target.textContent;

    const UpdatedStatus = status !== 'Active';

    try {
      const res = await fetch(`http://localhost:5000/updateDesign_status/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: UpdatedStatus })
      });

      const resData = await res.json();
      console.log(resData);
      fetchdesigndata();
    } catch (err) {
      console.log(err);
      alert('Something went wrong');
    }
  };

  const handleDelete = async (e) => {
    const id = e.target.value;
    const name = e.target.name;
    if (window.confirm(`Are you want to delete design with name :- ${name}`)) {
      try {
        let response = await fetch(`http://localhost:5000/Deletedesign/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ _id: id })
        });
        response = await response.json();
        console.log(response);
        fetchdesigndata();
      } catch (err) {
        console.log(err);
        alert('Something went wrong');
      }
    }
  };

  const handleUpdate = (e) => {
    const id = e.target.value;
    nav(`/adddesign/${id}`);
  };


  const [deleteArray, setDeleteArray] = useState([]);
  console.log(`These are the id's are selected: [${deleteArray}]`);


  const [isAllChecked, setisAllChecked] = useState(false);
  // console.log(isAllChecked);


  const handleCheckboxChange = (e) => {
    const designId = e.target.value;
    const isChecked = e.target.checked;

    if (isChecked) {
      setDeleteArray([...deleteArray, designId]);
    } else {
      setDeleteArray(deleteArray.filter((id) => id !== designId));
    }
  };

  const handleAllCheck = (e) => {
    const idAllCheck = e.target.checked;
    console.log(idAllCheck);

    setisAllChecked(idAllCheck);
    let newDataArray = [];
    if (idAllCheck) {
      designData.forEach((item) => {
        newDataArray.push(item._id);
      });
      setDeleteArray(newDataArray);
    }
    else {
      setDeleteArray([]);
    }
  };



  const DeleteMultipledesigns = async () => {
    //Perform deletion logic with the selected IDs stored in deletedArray
    if (deleteArray.length > 0 && window.confirm('Are you sure you want to delete Slected designs' + deleteArray)) {
      let response = await fetch('http://localhost:5000/multiple_designsDelete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: deleteArray }),
      });
      response = await response.json();
      if (response.data) {
        setisAllChecked(false);
        fetchdesigndata();
      } else {
        alert(response.message);
      }
    }
    else {
      setisAllChecked(false);
      setDeleteArray([]);
      alert('Please select the designs');
    }
  };


  const [searchValue, setsearchValue] = useState('');

  const handleSearch = async (e) => {
    const sVal = e.target.value;
    setsearchValue(sVal);
    if (!sVal) {
      fetchdesigndata();
    } else {
      console.log(searchValue);
      let Response = await fetch(`http://localhost:5000/searchDesign/${sVal}`)
      Response = await Response.json();
      if (Response.data) {
        setdesignData(Response.data);
      }
    }
  };

  const handleDescriptionClick = (design) => {
    setModalContent(design);
  };

  const handleCloseModal = () => {
    setModalContent(null);
  };


  return (
    <div>
      <Header />
      <div className='flex  bg-[#F5F7FF]'>
        <Sidebar />
        <div className={` ${changemenu === true ? 'w-[95%]' : 'w-[84%]'} relative px-[30px] py-[50px] bg-[#F5F7FF]`}>
          <h1 className='text-[25px] flex font-[500] mb-[10px]'>
            <span className='mt-3'>Welcome To View design Table</span>
            <form class="max-w-md  mb-[10px] w-3/4 mx-auto">
              <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
              <div class="relative">
                <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                  </svg>
                </div>
                <input type="search" value={searchValue} onChange={handleSearch} id="default-search" class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Mockups, Logos..." required />
                {/* <button type="submit" class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button> */}
              </div>
            </form>
          </h1>



          <div className=''>
            <div className='bg-white w-[100%] mb-[50px] p-4 h-full rounded-[20px]'>
              <table>
                <thead>
                  <tr>
                    <th>S.no</th>
                    <th>Design Name</th>
                    <th><button onClick={DeleteMultipledesigns} className='bg-red-400 text-white mr-2 px-3 py-1'>Delete</button>
                      <input type="checkbox" checked={isAllChecked} onChange={handleAllCheck} name='Select all checkbox' className='h-[20px] my-2 mt-3 cursor-pointer w-5' />
                    </th>
                    <th>Design Price(&#8377;)</th>
                    <th>Design Description</th>
                    <th>Design Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {(designData.length >= 1) ? designData.map((design, index = 0) => (
                    <tr key={design._id}>
                      <td>{index + 1}</td>
                      <td>{design.designname}</td>
                      <td><input type="checkbox" checked={isAllChecked || deleteArray.includes(design._id)} onChange={handleCheckboxChange} value={design._id} className='h-[20px] ml-6 cursor-pointer w-5' name="" id="" /></td>
                      <td>&#8377;{design.designprice}</td>

                      <td>
                        <span
                          onClick={() => handleDescriptionClick(design)}
                          style={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}
                        >
                          {design.designdescription.split(' ').slice(0, 3).join(' ')}...
                        </span>
                      </td>
                      <td><button onClick={handleStatus} value={design._id} className={`py-2 w-20 px-3 text-white rounded ${(design.designstatus) ? 'bg-green-400' : 'bg-red-400'}`}>{(design.designstatus) ? 'Active' : 'Inactive'}</button></td>
                      <td className='text-center py-10 mt-2 flex border-0'>
                        <button onClick={handleUpdate} value={design._id} className='bg-green-500 text-white px-5 mr-2 py-1'>Edit</button>
                        <button value={design._id} name={design.designname} onClick={handleDelete} className='bg-red-400 text-white px-5 py-1'>Delete</button>
                      </td>
                    </tr>
                  )) : <td className='text-center' colSpan={9} >No data Found In API</td>}
                </tbody>
              </table>
            </div>
          </div>
          <Footer />
        </div>
        {/*Main content end here  */}
        {modalContent && (
          <div className={`mainOverlay ${modalContent ? 'activemainOverlay' : ''}`}>
            <div className={`popup ${modalContent ? 'activepopup' : ''}`}>
              {/* <img src={modalContent.designimage} alt="designimage" /> */}
              <h2 className='ml-[10px] text-[16px] font-semibold space-x-4'><span className='text-[20px] mr-2 font-extrabold underline underline-offset-2 decoration-3'>Design Name:- </span>{modalContent.designname}</h2>
              <p className='ml-[10px] text-[16px] font-semibold space-x-4'><span className='text-[20px] mr-2 font-extrabold underline underline-offset-2 decoration-3'>Design Price:- </span>&#8377;{modalContent.designprice}</p>
              <p className='ml-[10px] text-[16px] font-semibold space-x-4'>
                <span className='text-[20px] mr-2 font-extrabold underline underline-offset-2 decoration-3'>Design Description:- </span>{modalContent.designdescription}
              </p>
              <span className='close' onClick={handleCloseModal}>&times;</span>
            </div>
          </div>

        )}
      </div>
    </div>
  )
};

export default ViewDesign;
