const User = require('../models/User.js').User;
const Role = require('../models/Role.js').Role;
const Employee = require('../models/Employee.js').Employee;
const Resident = require('../models/Resident.js').Resident;
const jwt = require('jsonwebtoken');
const {secret}  = require('../config.js');

function generateAccessToken(id, roles) {
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload, secret, {expiresIn: "24h"});
}

module.exports.registration = async (req,res) => {
    try {   
        const {resident, username, password, role} = req.body;
        const candidate = await User.findOne({username: username});
        if(candidate) {
            console.log("Пользователь уже есть");
            return res.status(400).json({message: "Пользователь уже есть"});
        }
        const candidate2 = await User.findOne({resident});
        if(candidate2) {
            console.log("Пользователь уже есть");
            return res.status(400).json({message: "Пользователь уже есть"});
        }        const userRole = await Role.findOne({value: role});
        if(userRole) {
            const user = await User.create({resident, username, password, roles:[userRole.value]});
            if(user) {
                console.log("Пользователь успешно зарегистрирован");
                res.json({message: "Пользователь успешно зарегистрирован"});
            } else {
                console.log("Ошибка при создании пользователя");
                res.json({message: "Ошибка при создании пользователя"});
            }
        }
    } catch (e) {
        console.log(e);
        res.status(400).json({message: 'Registration error'});
    }
}

module.exports.registrationEmp = async (req,res) => {
    try {   
        const {surname,name,tel, username, password, role} = req.body;
        const candidate = await Employee.findOne({username: username});
        if(candidate) {
            console.log("Работник уже есть");
            return res.status(400).json({message: "Работник уже есть"});
        }
        const userRole = await Role.findOne({value: role});
        if(userRole) {
            const user = await Employee.create({surname,name,tel, username, password, roles:[userRole.value]});
            if(user) {
                console.log("Работник успешно зарегистрирован");
                res.json({message: "Работник успешно зарегистрирован"});
            } else {
                console.log("Ошибка при создании Работника");
                res.json({message: "Ошибка при создании Работника"});
            }
        }
    } catch (e) {
        console.log(e);
        res.status(400).json({message: 'Registration error'});
    }
}

module.exports.login = async (req,res) => {
    try {
        const username1 = req.body.username;
        const password1 = req.body.password;
        let user = await User.findOne({username: username1, password: password1});
        console.log(user);
        console.log('Авторизирован: ' + user.roles[0]);
        const token = generateAccessToken(user._id, user.roles);
        return res.json(token);
    } catch (e) {
        console.log(e);
        return res.status(400).json({message: 'Login error'});
    }
}

module.exports.loginEmployee = async (req,res) => {
    try {
        const username1 = req.body.username;
        const password1 = req.body.password;
        let user = await Employee.findOne({username: username1, password: password1});
        console.log(user);
        console.log('Авторизирован: ' + user.roles[0]);
        const token = generateAccessToken(user._id, user.roles);
        return res.json(token);
    } catch (e) {
        console.log(e);
        return res.status(400).json({message: 'Login error'});
    }
}

module.exports.getUsers = async (req,res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (e) {
        return res.status(400).json({message: 'Login error'});
    }
}

