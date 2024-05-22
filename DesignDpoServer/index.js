const express = require("express");
require('./config');
const multer = require('multer');

const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());
const port = 5000;

const cors = require('cors');
app.use(cors());

const Admin = require('./models/Admin');

const Slider = require('./models/AddSlider');

const Card = require('./models/AddCard');

const Design = require('./models/AddDesign');

const Product = require('./models/AddProducts');

const uploadDesign = multer();

app.post('/AddDesign', uploadDesign.none(), async (req, res) => {
    const { designname, designprice, designdescription, designstatus } = req.body;
    try {
        // Check if the design name already exists
        const existingDesign = await Design.findOne({ designname });
        if (existingDesign) {
            return res.status(400).json({ status: false, message: 'Design name already exists' });
        }

        // If design name is unique, create a new Design document
        const newDesign = new Design({ designname, designprice, designdescription, designstatus: designstatus === 'true' });
        console.log(newDesign);

        const result = await newDesign.save();
        if (!result) {
            return res.status(404).json({ status: false, message: 'An error has occurred in saving Design' });
        }
        res.status(200).json({ status: true, message: 'Design Added Successfully', data: result });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


app.get('/ViewDesigns', async (req, res) => {
    try {
        const designs = await Design.find();
        res.status(200).json({ status: true, message: 'Designs are Founded Successfully', data: designs });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


app.get('/searchDesign/:searchKey', async (req, res) => {
    let searchKey = req.params.searchKey;
    let searchCriteria = [];

    // Search by design name and description
    searchCriteria.push(
        { designname: { $regex: new RegExp(searchKey, 'i') } },
        { designdescription: { $regex: new RegExp(searchKey, 'i') } }
    );

    // Check if searchKey is a number, then add price search criteria
    if (!isNaN(parseFloat(searchKey)) && isFinite(searchKey)) {
        searchCriteria.push({ designprice: searchKey });
    }

    // Add design status search criteria
    const designStatus = ['true', 'false'];
    if (designStatus.includes(searchKey.toLowerCase())) {
        searchCriteria.push({ designstatus: searchKey.toLowerCase() });
    }

    try {
        const designs = await Design.find({ $or: searchCriteria });
        res.status(200).json({ status: true, message: 'Designs found successfully', data: designs });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.get('/getDesign_byid/:id', async (req, res) => {
    let id = req.params.id;
    try {
        let design = await Design.findById(id);
        if (!design) {
            return res.status(404).json({ message: `Design not found by this id:- ${id}` });
        }
        res.status(200).json({ message: 'Slider found successfully', data: design })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.put('/updateDesign_status/:id', async (req, res) => {
    const id = req.params.id;
    const newStatus = req.body.status; // Changed variable name to camelCase convention
    try {
        let design = await Design.findById(id);
        if (!design) { // Changed condition to check if design is not found
            return res.status(404).json({ message: `Design not found by this id:- ${id}` });
        }
        // Update the design status
        design.designstatus = newStatus;
        const updatedDesign = await design.save(); // Save the updated design
        res.status(200).json({ message: 'Design status updated successfully by using ID', data: updatedDesign });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});



app.put('/updateDesign/:id', uploadDesign.none(), async (req, res) => {
    const id = req.params.id;
    const { designname, designprice, designdescription, designstatus } = req.body;
    try {
        // Check if the design name already exists except for the design being updated
        const existingDesign = await Design.findOne({ designname, _id: { $ne: id } });
        if (existingDesign) {
            return res.status(400).json({ status: false, message: 'Design name already exists. Please provide a unique design name.' });
        }

        // If design name is unique, proceed with updating the design
        const updatedDesign = await Design.updateOne({ _id: id }, {
            $set: { designname, designprice, designdescription, designstatus }
        });

        res.status(200).json({ message: 'Design is updated successfully by using ID', data: updatedDesign, status: true});
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


app.delete('/DeleteDesign/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const design = await Design.findById(id);
        if (!design) {
            return res.status(404).json({ message: `Design not found by this id:- ${id}` });
        }
        // const tmp_path = path.join(__dirname, uploadDesign.none(), design.designimage);
        // if (fs.existsSync(tmp_path)) {
        //     fs.unlinkSync(`${__dirname}/uploadDesign.none()/${design.designimage}`);
        // }
        const result = await Design.deleteOne({ _id: id });
        res.status(200).json({ message: 'Design Deleted Successfully', data: result });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server error' });
    }
});


app.delete('/multiple_DesignsDelete', async (req, res) => {
    const AllIds = req.body.ids;
    console.log(AllIds);
    try {
        // const DeleteImage = await Design.find({ _id: { $in: AllIds } });
        // DeleteImage.forEach((item) => {
        //     const tmp_path = path.join(__dirname, design, item.designimage);
        //     if (fs.existsSync(tmp_path)) {
        //         fs.unlinkSync(`${__dirname}/design/${item.designimage}`);
        //     }
        // });
        try {
            const Deletedesign = await Design.deleteMany({ _id: { $in: AllIds } });
            res.status(200).json({ message: 'Design deleted successfully', data: Deletedesign });
        }
        catch (err) {
            console.log(err);
            res.status(400).json({ message: 'Error in Deleting the course' });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server error' });
    }
});

const store_productmage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'products');
    }, filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});

const uploadProduct = multer({ storage: store_productmage }).single('image');

app.use('/products', express.static(path.join(__dirname, 'products')));

//view only those Designs whose status is ture 
app.get('/ViewDesignsbystatus', async (req, res) => {
    try {
        const designs = await Design.find({ designstatus: true });
        res.status(200).json({ status: true, message: 'Designs founded whose status are Active', data: designs });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.post('/AddProduct', uploadProduct, async (req, res) => {
    try {
        const { productcategory, productname, finishing, size, productstatus } = req.body;
        const productimage = req.file.filename;

        const newProduct = new Product({ productcategory, productname, finishing, size, productstatus, productimage });

        const result = await newProduct.save();
        if (!result) {
            return res.status(404).json({ status: false, message: 'An error has occurred' });
        }
        res.status(200).json({ status: true, message: 'Product Added successfully', data: result });

    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


app.get('/viewproducts', async (req, res) => {
    try {
        const products = await Product.find().populate('productcategory');
        const finalProducts = products.map((item) => ({
            ...item._doc, productimage: `${req.protocol}://${req.get('host')}/products/${item.productimage}`
        }));
        res.status(200).json({ message: 'Products found Successfully', data: finalProducts })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


app.get('/searchproducts/:searchkey', async (req, res) => {
    let searchKey = req.params.searchkey;
    try {
        // Search for designs matching the search key
        const designs = await Design.find({ designname: { $regex: new RegExp(searchKey, "i") } });
        const designIds = designs.map(design => design._id);

        // Prepare search criteria for products
        let searchCriteria = [
            { productcategory: { $in: designIds } },
            { productname: { $regex: new RegExp(searchKey, 'i') } },
            { finishing: { $regex: new RegExp(searchKey, 'i') } },
            { size: { $regex: new RegExp(searchKey, 'i') } }
        ];

        // Add search criteria for product status if searchKey is defined
        if (searchKey) {
            const productstatus = ['true', 'false'];
            if (productstatus.includes(searchKey.toLowerCase())) {
                searchCriteria.push({ productstatus: searchKey.toLowerCase() });
            }
        }

        // Find products based on search criteria
        const products = await Product.find({ $or: searchCriteria }).populate('productcategory');
        
        // Format product image URLs
        const finalProducts = products.map((item) => ({
            ...item._doc, productimage: `${req.protocol}://${req.get('host')}/products/${item.productimage}`
        }));

        res.status(200).json({ message: 'Products found successfully', data: finalProducts });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


app.get('/searchproductsByCategory/:id', async (req, res) => {
    let categoryId = req.params.id;
    try {
        const products = await Product.find({ productcategory: categoryId }).populate('productcategory');
        const finalProducts = products.map((item) => ({
            ...item._doc, productimage: `${req.protocol}://${req.get('host')}/products/${item.productimage}`
        }));

        res.status(200).json({ message: 'Products found successfully', data: finalProducts });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


app.get('/getProductby_id/:id', async (req, res) => {
    let id = req.params.id;
    try {
        let ProductData = await Product.findById(id).populate('productcategory');
        ProductData = { ...ProductData._doc, productimage: `${req.protocol}://${req.get('host')}/products/${ProductData.productimage}` }

        if (!ProductData) {
            return res.status(404).json({ message: `Product not found by this id:- ${id}` });
        }
        res.status(200).json({ message: 'Product found successfully', data: ProductData });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


app.put('/updateProductStatus/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const newstatus = req.body.status;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: `Product not found by this id:- ${id}` });
        }
        const updatedProductStatus = await Product.updateOne(
            { _id: id }, { $set: { productstatus: newstatus } }
        );
        res.status(200).json({ message: 'Product Status updated successfully', data: updatedProductStatus });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" })
    }
});


app.put('/UpdateProduct/:_id', uploadProduct, async (req, res) => {
    const _id = req.params._id;
    const { productcategory, productname, finishing, size, productstatus } = req.body;
    let productimage;
    if (req.file) {
        productimage = req.file.filename;
        const existingProduct = await Product.findById(_id);
        if (!existingProduct) {
            return res.status(404).json({ message: `Product not found by this id:-${_id}` });
        }
        try {
            fs.unlinkSync(`products/${existingProduct.productimage}`);
        } catch (err) {
            console.log(`Error in deleting old image:- ${err}`);
        }
    } else {
        const existingProduct = await Product.findById(_id);
        if (!existingProduct) {
            return res.status(404).json({ message: `Product not found by this id:-${_id}` });
        }
        productimage = existingProduct.productimage;
    }
    try {
        const Updatedproduct = await Product.updateOne({ _id }, {
            $set: {
                productcategory, productname, finishing, size, productstatus, productimage
            }
        });
        res.status(200).json({ message: 'Slider updated successfully', data: Updatedproduct });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.delete('/deleteProduct/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: `Product not found by this id:- ${id}` });
        }
        const tmp_path = path.join(__dirname, 'products', product.productimage);
        if (fs.existsSync(tmp_path)) {
            fs.unlinkSync(`${__dirname}/products/${product.productimage}`);
        }
        // Delete the team member from the database
        const result = await Product.deleteOne({ _id: id });
        res.status(200).json({ message: 'Product Deleted Successfully', data: result });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.delete('/multipleProductDelete', async (req, res) => {
    try {
        const AllIds = req.body.ids;
        const DeleteImage = await Product.find({ _id: { $in: AllIds } });
        DeleteImage.forEach((product) => {
            const tmp_path = path.join(__dirname, 'products', product.productimage);
            if (fs.existsSync(tmp_path)) {
                fs.unlinkSync(`${__dirname}/products/${product.productimage}`);
            }
        });
        const DeleteProducts = await Product.deleteMany({ _id: { $in: AllIds } });
        res.status(200).json({ message: 'Sliders deleted successfully', data: DeleteProducts });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


//Slider API's
const store_sliderimage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'sliders');
    }, filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});
const uploadSlider = multer({ storage: store_sliderimage }).single('image');
app.use('/sliders', express.static(path.join(__dirname, 'sliders')));


app.post('/addslider', uploadSlider, async (req, res) => {
    try {
        const { slidername, slidersubheading, sliderdecription, slidertatus } = req.body;
        const sliderimage = req.file.filename;

        const newSlider = new Slider({
            slidername, slidersubheading, sliderdecription, slidertatus, sliderimage
        });

        const result = await newSlider.save();
        if (!result) {
            return res.status(404).json({ status: false, message: 'An error has occurred' });
        }
        res.status(200).json({ status: true, message: 'Team Member Added successfully', data: result });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.get('/viewslider', async (req, res) => {
    try {
        const slides = await Slider.find();
        const finalSlides = slides.map((slide) => ({
            ...slide._doc, sliderimage: `${req.protocol}://${req.get('host')}/sliders/${slide.sliderimage}`
        }));
        res.status(200).json({ message: 'Slides found Successfully', data: finalSlides });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

//view only those slider whose status is 'Active' this we will use in our Website
app.get('/veiwsliderbystatus', async (req, res) => {
    try {
        const Sliders = await Slider.find({ slidertatus: true });
        const finalSlides = Sliders.map((slides) => ({
            ...slides._doc, sliderimage: `${req.protocol}://${req.get('host')}/sliders/${slides.sliderimage}`
        }));
        res.status(200).json({ message: 'Sliders founded whose status are Active', data: finalSlides });
    } catch (err) {
        console.log(err);
        response.status(500).json({ message: 'Internal Server Error' });
    }
});


app.get('/searchSlider/:searchKey', async (req, res) => {
    let searchKey = req.params.searchKey;
    let searchCriteria = [
        { slidername: { $regex: new RegExp(searchKey, 'i') } },
        { slidersubheading: { $regex: new RegExp(searchKey, 'i') } },
        { sliderdecription: { $regex: new RegExp(searchKey, 'i') } },
    ];

    let Sliderstatus = ['true', 'false'];
    if (Sliderstatus.includes(searchKey.toLowerCase())) {
        searchCriteria.push({ slidertatus: searchKey.toLowerCase() });
    };
    try {
        const slides = await Slider.find({ $or: searchCriteria });
        const finalSlides = slides.map((slide) => ({
            ...slide._doc, sliderimage: `${req.protocol}://${req.get('host')}/sliders/${slide.sliderimage}`
        }));
        res.status(200).json({ message: 'Slides found Successfully', data: finalSlides });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
app.get('/getSlide_byid/:id', async(req, res)=>{
    let id = req.params.id;
    try {
        let Slide = await Slider.findById(id).lean();
        Slide = { ...Slide, sliderimage: `${req.protocol}://${req.get('host')}/sliders/${Slide.sliderimage}`}
        if (!Slide) {
            return res.status(404).json({ message: `Slider not found by this id:- ${id}` });
        }
        res.status(200).json({ message: 'Slider found successfully', data: Slide });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


app.put('/UpdateSlider/:_id', uploadSlider, async (req, res) => {
    const _id = req.params._id;
    const { slidername, slidersubheading, sliderdecription, slidertatus } = req.body;
    let sliderimage;
    if (req.file) {
        sliderimage = req.file.filename;
        const existingSlider = await Slider.findById(_id);
        if (!existingSlider) {
            return res.status(404).json({ message: `Slide not found by this id:- ${_id}` });
        }
        try {
            fs.unlinkSync(`sliders/${existingSlider.sliderimage}`);
        } catch (err) {
            console.log(`Error in deleting old image:- ${err}`);
        }
    } else {
        const existingSlider = await Slider.findById(_id);
        if (!existingSlider) {
            return res.status(400).json({ message: `Slide not found by this id:- ${_id}` });
        }
        sliderimage = existingSlider.sliderimage;
    }

    try {
        const SliderUpdated = await Slider.updateOne({ _id }, {
            $set: {
                slidername, slidersubheading, sliderdecription, slidertatus, sliderimage
            }
        });
        res.status(200).json({ message: 'Slider updated successfully', data: SliderUpdated });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.put('/updateSliderStatus/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const newstatus = req.body.status;
        const slider = await Slider.findById(id);
        if (!slider) {
            return res.status(404).json({ message: `Team Member not found by this id:- ${id}` });
        }
        const updatedSliderStatus = await Slider.updateOne(
            { _id: id }, { $set: { slidertatus: newstatus } }
        );
        res.status(200).json({ message: 'Team Member Status updated successfully', data: updatedSliderStatus });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" })
    }
});
app.delete('/deleteSlider/:id', async (req, res) => {
    try {
        const id = req.params.id;
        // Find the team member by ID
        const slide = await Slider.findById(id);
        if (!slide) {
            return res.status(404).json({ message: `Slider not found by this id:- ${id}` });
        }
        // Delete the team member's image file from the server
        const tmp_path = path.join(__dirname, 'sliders', slide.sliderimage);
        if (fs.existsSync(tmp_path)) {
            fs.unlinkSync(`${__dirname}/sliders/${slide.sliderimage}`);
        }

        // Delete the team member from the database
        const result = await Slider.deleteOne({ _id: id });
        res.status(200).json({ message: 'Slider Deleted Successfully', data: result });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server error' });
    }
});

app.delete('/multipleSliderDelete', async (req, res) => {
    try {
        const AllIds = req.body.ids;
        const DeleteImage = await Slider.find({ _id: { $in: AllIds } });
        DeleteImage.forEach((slide) => {
            const tmp_path = path.join(__dirname, 'sliders', slide.sliderimage);
            if (fs.existsSync(tmp_path)) {
                fs.unlinkSync(`${__dirname}/sliders/${slide.sliderimage}`);
            }
        });
        const DeleteSliders = await Slider.deleteMany({ _id: { $in: AllIds } });
        res.status(200).json({ message: 'Sliders deleted successfully', data: DeleteSliders });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server' });
    }
});

// ADD CARD API

// Set up Multer storage for handling file uploads
const store_cardimage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Define the destination directory for storing uploaded images
        cb(null, 'cards');
    },
    filename: function (req, file, cb) {
        // Generate a unique filename for the uploaded image
        cb(null, Date.now() + file.originalname);
    }
});

// Set up Multer middleware to handle single image uploads
const uploadCard = multer({ storage: store_cardimage }).single('image');

// Serve uploaded images statically for viewing
app.use('/cards', express.static(path.join(__dirname, 'cards')));

// Route to add a new card
app.post('/addCard', uploadCard, async (req, res) => {
    try {
        // Extract data from request body
        const { mainHeading, subHeading, cardStatus } = req.body;
        const cardImage = req.file.filename;

        // Create a new Card object
        const newCard = new Card({
            mainHeading,
            subHeading,
            cardImage,
            cardStatus: cardStatus === 'true'
        });
        console.log(newCard);
        // Save the new card to the database
        const result = await newCard.save();

        // Check if the save operation was successful
        if (!result) {
            return res.status(404).json({ status: false, message: 'An error has occurred' });
        }

        // Respond with success message and data
        res.status(200).json({ status: true, message: 'Card Added successfully', data: result });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Route to view all cards
app.get('/viewCards', async (req, res) => {
    try {
        // Retrieve all cards from the database
        const cards = await Card.find();

        // Modify each card's image path to include the host URL
        const finalCards = cards.map((card) => ({
            ...card._doc, cardImage: `${req.protocol}://${req.get('host')}/cards/${card.cardImage}`
        }));
        // Respond with success message and data
        res.status(200).json({ message: 'Cards Found Successfully', data: finalCards });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

//view only those Cards whose status is 'Active' this we will use in our Website
app.get('/viewCardsbystatus', async (req, res) => {
    try {
        const cards = await Card.find({ cardStatus: true });
        const finalCards = cards.map((card) => ({
            ...card._doc, cardImage: `${req.protocol}://${req.get('host')}/cards/${card.cardImage}`
        }));
        // Respond with success message and data
        res.status(200).json({ message:'Cards founded whose status are Active',
        data: finalCards });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Route to update a card by ID
app.put('/updateCard/:_id', uploadCard, async (req, res) => {
    const _id = req.params._id;
    const { mainHeading, subHeading, cardStatus } = req.body;
    let cardImage;

    // Check if a file is uploaded
    if (req.file) {
        // If a file is uploaded, set the new image
        cardImage = req.file.filename;

        // Fetch existing card to get old image path
        const existingCard = await Card.findById(_id);
        if (!existingCard) {
            return res.status(404).json({ message: `Card not found by this id:- ${_id}` });
        }

        // Delete the old card image file from (cards) folder
        try {
            fs.unlinkSync(`cards/${existingCard.cardImage}`);
        } catch (err) {
            console.error('Error deleting old image:', err);
        }
    } else {
        // If no file is uploaded, retain the existing image
        const existingCard = await Card.findById(_id);
        if (!existingCard) {
            return res.status(404).json({ message: `Card not found by this id:- ${_id}` });
        }
        cardImage = existingCard.cardImage;
    }

    try {
        const cardUpdated = await Card.updateOne({ _id }, {
            $set: {
                mainHeading,
                subHeading,
                cardImage,
                cardStatus
            }
        });
        res.status(200).json({ message: 'Card updated successfully', data: cardUpdated });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Route to delete a card by ID
app.delete('/deleteCard/:id', async (req, res) => {
    try {
        const id = req.params.id;
        // Find the card by ID
        const card = await Card.findById(id);
        if (!card) {
            return res.status(404).json({ message: `Card not found by this id:- ${id}` });
        }
        // Delete the card's image file from the server
        const tmp_path = path.join(__dirname, 'cards', card.cardImage);
        if (fs.existsSync(tmp_path)) {
            fs.unlinkSync(`${__dirname}/cards/${card.cardImage}`);
        }

        // Delete the card from the database
        const result = await Card.deleteOne({ _id: id });
        res.status(200).json({ message: 'Card Deleted Successfully', data: result });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server error' });
    }
});

// Route to update a card's status
app.put('/updateCardStatus/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const newStatus = req.body.status;
        // Find the card by ID
        const card = await Card.findById(id);
        if (!card) {
            return res.status(404).json({ message: `Card not found by this id:- ${id}` });
        }
        // Update the card's status
        const updatedCardStatus = await Card.updateOne(
            { _id: id }, { $set: { cardStatus: newStatus } }
        );
        res.status(200).json({ message: 'Card Status updated successfully', data: updatedCardStatus });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server error' });
    }
});

// Route to delete multiple cards by IDs
app.delete('/multipleCardDelete', async (req, res) => {
    try {
        const allIds = req.body.ids;
        // Find all cards to be deleted
        const deleteCards = await Card.find({ _id: { $in: allIds } });
        // Delete each card's image file from the server
        deleteCards.forEach((item) => {
            const tmpPath = path.join(__dirname, 'cards', item.cardImage);
            if (fs.existsSync(tmpPath)) {
                fs.unlinkSync(`${__dirname}/cards/${item.cardImage}`);
            }
        });
        // Delete the cards from the database
        const deleteResult = await Card.deleteMany({ _id: { $in: allIds } });
        res.status(200).json({ message: 'Cards deleted successfully', data: deleteResult });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server error' });
    }
});

// Route to get a card by ID
app.get('/getCardById/:id', async (req, res) => {
    try {
        const id = req.params.id;
        // Find the card by ID
        let card = await Card.findById(id).lean();
        card = { ...card, cardImage: `${req.protocol}://${req.get('host')}/cards/${card.cardImage}` }
        if (!card) {
            return res.status(404).json({ message: `Card not found by this id:- ${id}` });
        }
        res.status(200).json({ message: 'Card found successfully', data: card });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Route to search cards
app.get('/searchCards/:searchKey', async (req, res) => {
    let searchKey = req.params.searchKey;
    const searchCriteria = [
        { mainHeading: { $regex: new RegExp(searchKey, 'i') } },
        { subHeading: { $regex: new RegExp(searchKey, 'i') } },
    ];

    let cardStatus = ['true', 'false',];
    if (cardStatus.includes(searchKey.toLowerCase())) {
        searchCriteria.push({ cardStatus: searchKey.toLowerCase() });
    }

    try {
        const cards = await Card.find({ $or: searchCriteria });
        const finalCards = cards.map((card) => ({
            ...card._doc, cardImage: `${req.protocol}://${req.get('host')}/cards/${card.cardImage}`
        }));
        res.status(200).json({ message: 'Cards Found Successfully', data: finalCards });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});



// login API
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    // console.log(username,password);
    try {
        const userdata = await Admin.find({ username: username });
        // console.log(userdata[0].password);
        if (userdata.length === 0) {
            return res.status(404).json({ status: false, message: 'user not found' });
        }
        if (userdata[0].password != password) {
            return res.status(501).json({ status: false, message: 'password does not matched' });
        }
        res.status(200).json({ status: true, message: 'Login Successful', data: userdata })
    }
    catch (err) {
        res.status(500).json({ status: false, message: 'internal server error' })
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});