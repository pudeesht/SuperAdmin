const express = require('express');
require('dotenv').config();

const authRoutes = require('./api/auth');
const userRoutes = require('./api/users');

const app=express();
const PORT=process.env.PORT||3001;



app.use(express.json());
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/superadmin/users',userRoutes);


app.get('/',(req,res)=>{
    res.send("Super Admin Backend is Running");
});


app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
});

