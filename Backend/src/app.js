const express = require('express');
require('dotenv').config();


const authRoutes = require('./api/auth');
const userRoutes = require('./api/users');
const roleRoutes = require('./api/roles.js');
const auditLogRoutes=require('./api/auditLog.js');
const analyticsRoutes = require('./api/analytics'); 
const errorHandler = require('./middleware/errorHandler');
const AppError=require('./utils/appError.js')

const app=express();



app.use(express.json());
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/superadmin/users',userRoutes);
app.use('/api/v1/superadmin', roleRoutes); 
app.use('/api/v1/superadmin', auditLogRoutes); 
app.use('/api/v1/superadmin', analyticsRoutes); 


app.get('/',(req,res)=>{
    res.send("Super Admin Backend is Running");
});


// app.all('*',(req,res,next)=>{
//     next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
// })


app.use(errorHandler);

module.exports=app;


