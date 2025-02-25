import React, { useContext, useState, useEffect } from 'react'
import { mainContext } from '../Context';
import { useNavigate } from 'react-router';
import Header from '../Common/Header';
import Sidebar from '../Common/Sidebar';
import Footer from '../Common/Footer';

function Viewcard() {
  let { changemenu } = useContext(mainContext);
  let nav = useNavigate();

  const [CardData, setCardData] = useState([]);

  const fetchCardData = async () => {
    let Data = await fetch('http://localhost:5000/viewCards', {
      method: 'GET'
    });
    Data = await Data.json();
    if (Data.data) {
      setCardData(Data.data);
    } else {
      alert(Data.message);
    }
  };

  const handleStatus = async (e) => {
    setsearchValue('');
    const id = e.target.value;
    const status = e.target.textContent;

    const UpdatedStatus = status !== 'Active';

    try {
      const res = await fetch(`http://localhost:5000/updateCardStatus/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: UpdatedStatus })
      });

      const resData = await res.json();
      console.log(resData);
      fetchCardData();
    } catch (err) {
      console.log(err);
      alert('Something went wrong');
    }
  };

  const handleUpdate = (e) => {
    const id = e.target.value;
    nav(`/addcard/${id}`);
  };


  const handleDelete = async (e) => {
    const id = e.target.value;
    const name = e.target.name;
    if (window.confirm(`Are you want to delete Card with name :- ${name}`)) {
      try {
        let response = await fetch(`http://localhost:5000/deleteCard/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ _id: id })
        });
        response = await response.json();
        console.log(response);
        fetchCardData();
      } catch (err) {
        console.log(err);
        alert('Something went wrong');
      }
    }
  };

  useEffect(() => {
    fetchCardData();
  }, []);

  const [deleteArray, setDeleteArray] = useState([]);
  console.log(`These are the id's are selected: [${deleteArray}]`);

  const [isAllChecked, setisAllChecked] = useState(false);


  const handleCheckboxChange = (e) => {
    const courseId = e.target.value;
    const isChecked = e.target.checked;

    if (isChecked) {
      setDeleteArray([...deleteArray, courseId]);
    } else {
      setDeleteArray(deleteArray.filter((id) => id !== courseId));
    }
  };


  const handleAllCheck = (e) => {
    const idAllCheck = e.target.checked;
    console.log(idAllCheck);

    setisAllChecked(idAllCheck);
    let newDataArray = [];
    if (idAllCheck) {
      CardData.forEach((item) => {
        newDataArray.push(item._id);
      });
      setDeleteArray(newDataArray);
    }
    else {
      setDeleteArray([]);
    }
  };

  const DeleteMultipleCard = async () => {
    if (deleteArray.length > 0 && window.confirm('Are you sure you want to delete Slected Cards')) {
      let response = await fetch('http://localhost:5000/multipleCardDelete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: deleteArray }),
      });
      response = await response.json();
      if (response.data) {

        fetchCardData();
      } else {
        alert(response.message);
      }
    } else {
      setDeleteArray([]);
      alert('Please select atleast one Card to delete');

    }
  };


  const [searchValue, setsearchValue] = useState('');

  const handleSearch = async (e) => {
    const sVal = e.target.value;
    setsearchValue(sVal);
    if (!sVal) {
      fetchCardData();
    } else {
      console.log(searchValue);
      let Response = await fetch(`http://localhost:5000/searchCards/${sVal}`)
      Response = await Response.json();
      if (Response.data) {
        setCardData(Response.data);
      }
    }
  };




  return (
    <div>

      <Header />

      <div className='flex  bg-[#F5F7FF]'>
        <Sidebar />

        <div className={` ${changemenu === true ? 'w-[95%]' : 'w-[84%]'} relative px-[30px] py-[50px]  bg-[#F5F7FF]`}>

          <h1 className='text-[25px] flex font-[500] mb-[10px]'>
            <span className='mt-3'>Welcome To View Card Table</span>
            <form class="max-w-md mb-[10px] w-3/4 mx-auto">
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
                    <th>Main Heading</th>
                    <th>Sub Heading</th>
                    <th><button onClick={DeleteMultipleCard} className='bg-red-400 text-white mr-2 px-3 py-1'>Delete</button>
                      <input type="checkbox" name='Select all checkbox' checked={isAllChecked} onChange={handleAllCheck} className='h-[20px] my-2 mt-3 cursor-pointer w-5' /></th>
                    <th>Card Image</th>
                    <th>Card Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {CardData.length > 0 ? CardData.map((Card, index = 0) => (<tr key={Card._id}>
                    <td>{index + 1}</td>
                    <td>{Card.mainHeading}</td>
                    <td>{Card.subHeading}</td>
                    <td><input type="checkbox" onChange={handleCheckboxChange} value={Card._id} className='h-[20px] ml-[35px] cursor-pointer w-5' checked={isAllChecked || deleteArray.includes(Card._id)} name="" id="" /></td>
                    <td><img src={Card.cardImage} className='w-[100px] h-[100px] cursor-pointer' alt="Cardimage" /></td>
                    <td><button onClick={handleStatus} value={Card._id} className={`py-2 w-20 px-3 text-white rounded ${(Card.cardStatus) ? 'bg-green-400' : 'bg-red-400'}`}>{(Card.cardStatus) ? 'Active' : 'Inactive'}</button></td>
                    <td className='text-center mt-[30px] flex border-0'>
                      <button onClick={handleUpdate} value={Card._id} className='bg-green-500 text-white px-5 mr-5 py-1'>Edit</button>
                      <button value={Card._id} name={Card.mainHeading} onClick={handleDelete} className='bg-red-400 text-white px-5 py-1'>Delete</button>
                    </td>
                  </tr>))
                    : <tr> <td className='text-center' colSpan={7} >No data Found In API</td></tr>}

                </tbody>

              </table>
            </div>
          </div>
          <Footer />
        </div>
      </div>

    </div>
  )
}

export default Viewcard;