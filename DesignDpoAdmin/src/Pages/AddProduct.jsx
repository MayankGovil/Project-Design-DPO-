import React, { useContext, useState,useEffect } from 'react'
import { mainContext } from '../Context';
import Header from '../Common/Header';
import Sidebar from '../Common/Sidebar';
import Footer from '../Common/Footer';
import prev from '../img/generic-image-file-icon-hi.png'
import { useNavigate } from 'react-router';
import { useParams } from 'react-router';


function AddProduct() {
  let { changemenu } = useContext(mainContext);
  let nav = useNavigate();
  let { id } = useParams();
  const [productData, setproductData] = useState({});
  console.log(productData);

  const [designData, setdesignData] = useState([]);
  console.log(designData);

  const [previmg, setimgprev] = useState('');


  const fetchproductbyid = async () => {
    let response = await fetch(`http://localhost:5000/getProductby_id/${id}`);
    response = await response.json();
    setproductData(response.data);
    setimgprev(response.data.productimage);
  }

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
  };

  useEffect(() => {
    if (id) {
      fetchproductbyid();
      fetchdesigndata();
    }
    setimgprev('');
    fetchdesigndata();
  }, []);

  const formSumbitHandle = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    if (!id) {
      let response = await fetch('http://localhost:5000/AddProduct', {
        method: 'POST',
        body: data
      });
      response = await response.json();
      if (response.data) {
        nav('/viewproduct');
      }
      else {
        alert(response.message);
      }
    } else {
      let response = await fetch(`http://localhost:5000/UpdateProduct/${id}`, {
        method: 'PUT',
        body: data
      });
      console.log(response)
      nav('/viewproduct');
    }
  }

  const handlePrevimg = (e) => {
    const reader = new FileReader();
    const file = e.target.files[0];
    if (file) {
      reader.readAsDataURL(file);
    }
    reader.onload = () => {
      console.log(reader)
      setimgprev(reader.result);
    };
  }
  return (
    <div>

      <Header />

      <div className='flex  bg-[#F5F7FF]'>
        <Sidebar />

        <div className={` ${changemenu == true ? 'w-[95%]' : 'w-[84%]'} relative px-[30px] pt-[20px] pb-[60px]  bg-[#F5F7FF]`}>

          <h1 className='text-[25px] font-[500] mb-[10px]'>
            Product
          </h1>
          <div className=''>
            <div className='bg-white w-[100%] mb-[50px] p-4 h-full rounded-[20px]'>
              <form action=""onSubmit={formSumbitHandle}>
                Product Category
                <select name="productcategory" id="" className='w-full border my-3 border-gray-400 h-[50px]'>
                  {designData.map((item, index) => (<option key={index + 1} value={item._id} className=''  >{item.designname}</option>))}
                </select>
                Product Name
                <input type="text" value={productData.productname} onChange={(e) => { setproductData({ ...productData, productname: e.target.value }) }} name='productname' className='border border-gray-400 w-full h-[50px] mb-3 mt-2 px-4 ' />
                Product Finishing
                <input type="text" name='finishing' value={productData.finishing} onChange={(e)=>{setproductData({ ...productData, finishing: e.target.value })}} className='border px-4 border-gray-400 w-full h-[50px] mb-3 mt-2 ' />
                Product Size
                <input type="text" name='size' value={productData.size} onChange={(e)=>{setproductData({ ...productData, size: e.target.value })}} className='border px-4 border-gray-400 w-full h-[50px] mb-3 mt-2 ' />
                <input type="file" id='file-input' name='image' onChange={handlePrevimg} className='border hidden border-gray-400 w-full h-[50px] mb-3 ' />
                Product Image
                <div className='flex items-center gap-0 mt-[10px]'>
                  <div className='w-full flex items-center'>
                    <input type="text" name='image' readOnly placeholder='Upload File' className=' px-4 rounded-[10px_0px_0px_10px] border border-gray-400 w-[70%] h-[50px]' />
                    <label id="file-input-label" for="file-input" className='border block  bg-[#4B49AC] text-white text-center leading-[50px]  w-[10%] rounded-[0px_20px_20px_0px] h-[50px]  '>Upload</label>
                  </div>
                  <div className=''>
                    <img src={previmg || prev} alt="" width={150} />
                  </div>
                </div>

                Product Status
                <div className='flex items-center mt-5  mb-8 gap-2'>
                  <input type="radio"name='productstatus'value={true} checked={productData.productstatus === true || true}className='mx-2 w-[20px] h-[20px] text-[20px]' /> Active
                  <input type="radio"name='productstatus'value={false} checked={productData.productstatus === false} className='mx-2 w-[20px] h-[20px] text-[20px]' /> Deactive
                </div>

                <input type="submit" className='bg-[#4B49AC] mb-8 mt-7 text-[18px] px-8 py-2 rounded-[10px] text-white' />
                <input type="reset" value="Cancel" className='bg-[#F8F9FA] ml-4  text-[18px] px-8 py-2 rounded-[10px] text-black' />
              </form>
            </div>
          </div>
          <Footer />
        </div>
      </div>

    </div>
  )
}

export default AddProduct