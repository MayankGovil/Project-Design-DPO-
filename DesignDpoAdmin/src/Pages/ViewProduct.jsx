import React, { useContext, useEffect, useState } from 'react'
import { mainContext } from '../Context';
import Header from '../Common/Header';
import Sidebar from '../Common/Sidebar';
import Footer from '../Common/Footer';
import { useNavigate } from 'react-router';

function ViewProduct() {
  let { changemenu } = useContext(mainContext);
  const [ProductData, setProductData] = useState([]);
  let nav = useNavigate();

  const fetchProducts = async () => {
    let products = await fetch(`http://localhost:5000/viewproducts`);
    products = await products.json();
    if ( products.data) {
      setProductData(products.data);
    } else {
      alert(products.message)
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchdesigndata();
  }, []);


  const handleStatus = async (e) => {
    setsearchValue('');
    const id = e.target.value;
    const status = e.target.textContent;

    const UpdatedStatus = status !== 'Active';

    try {
      const res = await fetch(`http://localhost:5000/updateProductStatus/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: UpdatedStatus })
      });

      const resData = await res.json();
      console.log(resData);
      fetchProducts();
    } catch (err) {
      console.log(err);
      alert('Something went wrong');
    }
  };


  const handleUpdate = (e) => {
    const id = e.target.value;
    nav(`/addproduct/${id}`);
  };


  const handleDelete = async (e) => {
    const id = e.target.value;
    const name = e.target.name;
    window.confirm(`Are you want to delete Product with name & id:- ${name}`);
    try {
      let response = await fetch(`http://localhost:5000/deleteProduct/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: id })
      });
      response = await response.json();
      console.log(response.message);
      fetchProducts();
    } catch (err) {
      console.log(err);
      alert('Something went wrong');
    }
  };

  const [deleteArray, setDeleteArray] = useState([]);
  // console.log(`These are the id's are selected: [${deleteArray}]`);


  const [isAllChecked, setisAllChecked] = useState(false);
  // console.log(isAllChecked);


  const handleCheckboxChange = (e) => {
    const productId = e.target.value;
    const isChecked = e.target.checked;

    if (isChecked) {
      setDeleteArray([...deleteArray, productId]);
    } else {
      setDeleteArray(deleteArray.filter((id) => id !== productId));
    }
  };

  const handleAllCheck = (e) => {
    const idAllCheck = e.target.checked;
    // console.log(idAllCheck);

    setisAllChecked(idAllCheck);
    let newDataArray = [];
    if (idAllCheck) {
      ProductData.forEach((item) => {
        newDataArray.push(item._id);
      });
      setDeleteArray(newDataArray);
    }
    else {
      setDeleteArray([]);
    }
  };


  const DeleteMultipleProduct = async () => {
    if (deleteArray.length > 0 && window.confirm('Are you sure you want to delete Slected Products')) {
      let response = await fetch('http://localhost:5000/multipleProductDelete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: deleteArray }),
      });
      response = await response.json();
      if (response.data) {
         fetchProducts();
      } else {
        alert(response.message);
      }
    }
    else {
      alert('Please select the courses');
      setDeleteArray([]);
    }
  };


  const [searchValue, setsearchValue] = useState('');

  const handleSearch = async (e) => {
    const sVal = e.target.value;
    setsearchValue(sVal);
    if (!sVal) {
       fetchProducts();
    } else {
      console.log(searchValue);
      let Response = await fetch(`http://localhost:5000/searchproducts/${sVal}`)
      Response = await Response.json();
      if (Response.data) {
        setProductData(Response.data);
      }
    }
  };

  const [designData, setdesignData] = useState([]);
  // console.log(courseData);
  const fetchdesigndata = async () => {
    let designs = await fetch('http://localhost:5000/ViewDesignsbystatus', {
      method: 'GET',
    });
    designs = await designs.json();
    if (designs.data) {
      setdesignData(designs.data);
    } else {
      alert(designs.message);
    }
  }

  const [categoryValue,setcategoryValue] = useState('');
  // console.log(categoryValue);
  const SearchProductsByCategory = async(e)=>{
    const searchVal = e.target.value;
    setcategoryValue(searchVal);
    if (!searchVal){
       fetchProducts();
    }else{
      console.log("The Selected Product Category ID:- "+categoryValue);
     let Response = await fetch(`http://localhost:5000/searchproductsByCategory/${searchVal}`)
      Response = await Response.json();
      if (Response.data) {
        console.log(Response.data);// this wll console array which having same course category products by using the category
        setProductData(Response.data);
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
            <span className='mt-3'>Welcome To View Product's Table</span>
            <form class="max-w-md mb-[10px] w-3/4 mx-auto">
              <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
              <div class="relative">
                <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                  </svg>
                </div>
                <input type="search" value={searchValue} onChange={handleSearch} id="default-search" class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Mockups, Logos..." required />
              </div>
            </form>
          </h1>
          <div className="category-buttons overflow-x-auto whitespace-nowrap pb-2 max-w-full">
          <button type="button" name="All Design" onClick={fetchProducts} className='rounded-lg text-dark bg-white text-gray-900 px-4 py-2 mr-4 mb-4 border-blue-600'>All Design Products</button>
            {designData.map((item) => (
              <button type="button" name={item.designname} value={item._id} onClick={SearchProductsByCategory} className='rounded-lg border-blue-600 bg-white text-gray-900 px-4 py-2 mr-4 mb-4'>
                {item.designname}
              </button>
            ))}
          </div>
          <div className=''>
            <div className='bg-white w-[100%] mb-[50px] p-4 h-full rounded-[20px]'>
              <table >
                <thead>
                  <tr>
                    <th>S.no</th>
                    <th>Course Category</th>
                    <th><button onClick={DeleteMultipleProduct} className='bg-red-400 text-white px-3 py-1'>Delete</button>
                      <input type="checkbox" checked={isAllChecked} onChange={handleAllCheck} name='Select all product' className='h-[20px] my-2 cursor-pointer w-5' />
                    </th>
                    <th>Product Name</th>
                    <th>Product Image</th>
                    <th>Product Finishing</th>
                    <th>Product Size</th>
                    <th>Product Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>{(ProductData.length >= 1) ? ProductData.map((product, index = 0) => (
                  <tr key={product._id}>
                    <td>{index + 1}</td>
                    <td>{product.productcategory.designname}</td>

                    <td><input type="checkbox" checked={isAllChecked || deleteArray.includes(product._id)} onChange={handleCheckboxChange} value={product._id} className='h-[20px] ml-6 cursor-pointer w-5' name="" id="" /></td>
                    <td>{product.productname}</td>
                    <td><img src={product.productimage} className='w-[100px] h-[100px] cursor-pointer' alt="productimage" /></td>
                    <td>{product.finishing}</td>
                    <td>{product.size}</td>
                    
                    <td><button onClick={handleStatus} value={product._id} className={`py-2 w-20 px-3 text-white rounded ${(product.productstatus) ? 'bg-green-400' : 'bg-red-400'}`}>{(product.productstatus) ? 'Active' : 'Inactive'}</button></td>
                    <td className='text-center mt-8 flex border-0'>
                      <button onClick={handleUpdate} value={product._id} className='bg-green-500 text-white px-5 mr-5 py-1'>Edit</button>
                      <button className='bg-red-400 text-white px-5 py-1'name={product.productname} value={product._id} onClick={handleDelete} >Delete</button>
                    </td>
                  </tr>
                ))
                  : <td className='text-center' colSpan={7} >No data Found In API</td>}</tbody>

              </table>
            </div>
          </div>
          <Footer />
        </div>
      </div>

    </div>
  )
}

export default ViewProduct;