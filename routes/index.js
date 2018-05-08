var express=require('express');
var router=express.Router();
var jwt = require('express-jwt');
var auth = jwt({
 secret: 'SYSTEM',
 userProperty: 'payload'
});

