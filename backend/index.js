import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 8080

mongoose.connect(process.env.MONGODB_URL)
.then(() => console.log('database connected'))
.catch((error) => console.log(error))


//schema
const userSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        unique: true,
    },
    password: String,
    confirmPassword: String,
    image: String
})

const userModel = mongoose.model("user", userSchema);




app.get('/', (req, res) => {
    res.send("Server is running")
})

app.post('/signup', async(req, res) => {
    // console.log(req.body);
    const {email} = req.body;

    const user = await userModel.findOne({email: email});

        if(user){
            res.send({message: "Email id is already registered", alert: false})
        }else{
            const data = userModel(req.body).save();
            res.send({message: "Successfully sign up", alert: true})
        }
    
})

// login api
app.post('/login', async(req, res) => {
    console.log('login:',req.body);
    const {email} = req.body;
    
    const user = await userModel.findOne({email: email});
    console.log('user::', user)
    const dataSend = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        image: user.image,
    }
    console.log('obj:', dataSend)
    if(user){
        res.send({message: 'Login is successfull',alert: true, data: dataSend});
    }else if(!user){
        res.send({message: 'User is not register', alert: false});
    }
})

// product section

const schemaProduct = mongoose.Schema({
    name: String,
    category: String,
    image: String,
    price: String,
    description: String,
})

const productModel = mongoose.model("product", schemaProduct);


app.post('/uploadProduct', async(req, res)=> {
    console.log(req.body);
    const data = await productModel(req.body);
    const datasave = await data.save();
    console.log(datasave);
    res.send({message: 'Upload successfully'});
})

app.get('/product', async(req, res)=> {
    const data = await productModel.find({})
    res.send(JSON.stringify(data))

})



app.listen(port, () => console.log("server is running on port " + port))



