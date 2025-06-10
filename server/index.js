const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const userdataModel = require('./models/userdata')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const itemdataModel = require('./models/itemdata')
const orderdataModel = require('./models/orderdata');
const otpCache = {};
const axios = require("axios");
const CASAuthentication = require("cas-authentication");

const app = express()
app.use(express.json())
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true
}))
app.use(cookieParser())

const session = require("express-session");
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}))

mongoose.connect("mongodb://127.0.0.1:27017/buysellrent"); 

const cas = new CASAuthentication({
  cas_url: 'https://login.iiit.ac.in/cas',
  service_url: 'http://localhost:3001',
  cas_version: '3.0'
});

const verifyUser = (req, res, next)=> {
    const token = req.cookies.token;
    if(!token) {
        return res.json("The token was not available")
    }
    else {
        jwt.verify(token, "jwt-secret-key", (err, decoded) => {
            if(err) return res.json("Token is wrong")
            req.email = decoded.email;
            next();
        })
    }
}

app.get('/verify_user', verifyUser, (req,res) => {
  res.json("Verified");
});

app.post('/changepassword', verifyUser, async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  
  if (newPassword !== confirmPassword) {
    return res.json({ error: "New password and confirmation do not match" });
  }

  try {
    
    const user = await userdataModel.findOne({ email: req.email });
    if (!user) {
      return res.json({ error: "User not found" });
    }

    
    const isMatch = bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.json({ error: "Old password is incorrect" });
    }

    
    const hash = await bcrypt.hash(newPassword, 10);
    user.password = hash;
    await user.save();

    return res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Error changing password:", err);
    return res.json({ error: "Error changing password" });
  }
});

app.get('/cas-login', cas.bounce, (req, res) => {
  const casUser = req.session.cas_user;
  userdataModel.findOne({ email: casUser })
    .then(user => {
      if (!user) {
          const token = jwt.sign({ email: user.email }, "jwt-secret-key", { expiresIn:"1d" });
          res.cookie("token", token);
          bcrypt.hash("hehehe", 10)
          .then(hash =>{
              userdataModel.create({
                  email: casUser,
                  firstName: casUser,
                  lastName: "",
                  age: 0,
                  contactNumber: "",
                  password: hash
              });
              res.redirect('http://localhost:5173/profile');
          })
      }
      else{
          res.user = user;
          const token = jwt.sign({ email: user.email }, "jwt-secret-key", { expiresIn:"1d" });
          res.cookie("token", token);
          res.redirect('http://localhost:5173/profile');
      }
      
    })
    .catch(err => {
        console.error("CAS login error:", err);
        res.status(500).json({ error: "CAS login failed" });
    });
});

app.post('/signup', (req, res) => {
    const {firstName, lastName, email, age, contactNumber, password} = req.body;
    userdataModel.findOne({email: email})
    .then(result => {
        if(result){
            res.json({message: "User already exists"})
        }else{
            bcrypt.hash(password, 10)
            .then(hash => {
                userdataModel.create({firstName, lastName, email, age, contactNumber, password: hash})
                .then(users => res.json({message: "Success", users: users}))
                .catch(err => res.json(err))
            })
            .catch(err => console.log(err.message))
        }
    })
    
})

app.post('/login', async (req, res) => {
    const { email, password, recaptchaToken } = req.body;
    const secretKey = "6LfUFs0qAAAAAOmy8lfeavSfgJC6JHUG6UDcTb-t";

    try {
      const googleResponse = await axios.post(
        `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`
      );
      
      if (!googleResponse.data.success) {
        return res.status(400).json("reCAPTCHA verification failed. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying reCAPTCHA:", error);
      return res.status(500).json("Error verifying reCAPTCHA.");
    }
      
    userdataModel.findOne({ email: email })
      .then(user => {
        if(user) {
          bcrypt.compare(password, user.password, (err, response) => {  
            if(response) {
              const token = jwt.sign({ email: user.email }, "jwt-secret-key", { expiresIn:"1d" });
              res.cookie("token", token);
              res.json("Success");
            } else {
              res.json("Incorrect Password");
            }
          });
        } else {
          res.json("No record existed");
        }
      })
      .catch(err => {
        console.error("Login error:", err);
        res.status(500).json("Login failed.");
    });
});

app.post('/logout', (req, res) => {
    res.clearCookie("connect.sid");
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
});
  


app.get('/profile', verifyUser, (req, res) => {

    userdataModel.findOne({ email: req.email})
    .then(user => {
        if (user) {
            res.json({firstName: user.firstName, lastName: user.lastName, email: user.email, age: user.age, contactNumber: user.contactNumber});
        } else {
            res.json({ message: "User not found" });
        }
    })
    .catch(error => {
        console.error("Error retrieving profile:", error)
        res.status(500).json({ message: "Error retrieving profile" })
    })
    
}) 

app.post('/profileupdate',verifyUser, (req,res) => {
    userdataModel.findOneAndUpdate({email: req.email}, {firstName: req.body.firstName, lastName: req.body.lastName, age: req.body.age, contactNumber: req.body.contactNumber})
    .then(user =>{
        if(user) res.json({message: "Successfully updated"});
        else res.json({message: "error in updating user"});
    })
})

app.get('/getitems', verifyUser, (req, res) => {
    itemdataModel.find({})
    .then(items => res.json(items))
    .catch(error => res.status(500).json({ error: "Error retrieving items" }));
});

app.get('/getitem/:id', verifyUser, (req, res) => {
    itemdataModel.findById(req.params.id)
    .then(item => {
        if (item) res.json(item);
        else res.status(404).json({ error: "Item not found" });
    })
    .catch(err => res.status(500).json({ error: "Error retrieving item" }));
});  

app.post('/addtocart', verifyUser, async (req, res) => {
    try {
      const { itemId } = req.body;
      
      const item = await itemdataModel.findById(itemId);
      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }
      
      if (item.sellerid === req.email) {
        return res.status(400).json({ error: "Cannot add your own item to the cart." });
      }

      const updatedUser = await userdataModel.findOneAndUpdate(
        { email: req.email },
        { $push: { cart: itemId } },
        { new: true }
      );
      
      res.json({ message: "Item added to cart", cart: updatedUser.cart });
    } catch (err) {
      console.error("Error updating cart:", err);
      res.status(500).json({ error: "Error adding item to cart" });
    }
});
  

app.get('/mycart', verifyUser, async (req, res) => {
    try {
        const user = await userdataModel.findOne({ email: req.email }).populate('cart');
        if(user) {
        res.json({ cartItems: user.cart });
        } else {
        res.status(404).json({ error: "User not found" });
        }
    } catch (err) {
        res.status(500).json({ error: "Error retrieving cart" });
    }
});

app.post('/removecartitem', verifyUser, async (req, res) => {
    try {
      const { itemId } = req.body;
      const user = await userdataModel.findOne({ email: req.email });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const index = user.cart.findIndex(id => id.toString() === itemId);
      if (index > -1) {
        user.cart.splice(index, 1);
      } else {
        return res.status(404).json({ error: "Item not found in cart" });
      }
      await user.save();
      
      const updatedUser = await userdataModel.findOne({ email: req.email }).populate('cart');
      res.json({ cartItems: updatedUser.cart });
    } catch(err) {
      console.error("Error removing item from cart:", err);
      res.status(500).json({ error: "Error removing item from cart" });
    }
});
 
app.post('/finalizeorder', verifyUser, async (req, res) => {
    try {
      const user = await userdataModel.findOne({ email: req.email }).populate('cart');
      if (!user) {
        return res.status(404).json({ success: false, error: "User not found" });
      }
  
      
      const itemsToOrder = user.cart.filter(item => item.sellerid !== req.email);
      if (itemsToOrder.length === 0) {
        return res.json({ success: false, error: "No valid items in cart to order" });
      }
  
      
      const ordersWithOtp = [];
  
      for (const item of itemsToOrder) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpHash = await bcrypt.hash(otp, 10);
        const createdOrder = await orderdataModel.create({
          buyerEmail: req.email,
          sellerEmail: item.sellerid,
          item: item._id,
          otpHash: otpHash,
          status: 'pending'
        });
        otpCache[createdOrder._id] = otp;      
        ordersWithOtp.push({ orderId: createdOrder._id, otp });
      }
  
    
      user.cart = [];
      await user.save();

      res.json({ success: true, ordersWithOtp });
    } catch (err) {
      console.error("Error finalizing order:", err);
      res.status(500).json({ success: false, error: "Error finalizing order" });
    }
});

app.get('/orders/buyer', verifyUser, async (req, res) => {
    try {
      let orders = await orderdataModel
        .find({ buyerEmail: req.email })
        .populate('item');

      orders = orders.map(order => {

        const orderObj = order.toObject();
        if (otpCache[order._id]) {
          orderObj.plainOTP = otpCache[order._id];
        }
        return orderObj;
      });
  
      res.json({ orders });
    } catch (err) {
      console.error("Error retrieving buyer orders:", err);
      res.status(500).json({ error: "Error retrieving buyer orders" });
    }
});

app.get('/orders/seller', verifyUser, async (req, res) => {
    try {
      const orders = await orderdataModel
        .find({ sellerEmail: req.email, status: "pending" })
        .populate('item');
      res.json({ orders });
    } catch (err) {
      console.error("Error retrieving seller orders:", err);
      res.status(500).json({ error: "Error retrieving seller orders" });
    }
  });
  

app.post('/closeorder', verifyUser, async (req, res) => {
    try {
      const { orderId, otp } = req.body;
      const order = await orderdataModel.findById(orderId);
      if (!order) return res.status(404).json({ error: "Order not found" });
      if (order.sellerEmail !== req.email) {
        return res.status(403).json({ error: "Not authorized" });
      }

      const match = await bcrypt.compare(otp, order.otpHash);
      if (match) {
        order.status = "completed";
        await order.save();
        res.json({ success: true, message: "Order closed successfully" });
      } else {
        res.status(400).json({ error: "Incorrect OTP" });
      }
    } catch (err) {
      console.error("Error closing order:", err);
      res.status(500).json({ error: "Error closing order" });
    }
});

app.listen(3001, () => {
    console.log("server is running")
})
