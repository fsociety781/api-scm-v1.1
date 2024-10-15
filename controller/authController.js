const express = require('express');
const router = express.Router();

const jwt = require("jsonwebtoken");
const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const cookieParser = require("cookie-parser");
const prisma = require("../bin/prismaConfig");
const jwtkey = process.env.JWT_KEY;
router.use(cookieParser());

class AuthController{
    static async login(req, res){
        const {username, password} = req.body;
        try{
            if (!username || !password) {
                return res.status(400).json({
                    status: "400",
                    message: "Username or password cannot be empty"
                });
            }
            
            const user = await prisma.user.findFirst({
                where: {
                  username: {
                    equals: username,
                  },
                },
              });
        
              if (!user) {
                return res.status(401).json({
                  status: "401",
                  message: "Account not registered",
                });
              }
              
            const passwordMatch = compareSync(password, user.password);

            if(!passwordMatch){
                return res.status(401).json({
                    status: "401",
                    message: "Incorrect password"
                });
            }

            if(user.status === "inactive"){
                return res.status(401).json({
                    status: "401",
                    message: "Account is inactive"
                });
            }

            const token = jwt.sign(
                {
                  user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                  },
                },
                jwtkey,
                {
                  expiresIn: "5h",
                }
              );

              const AccessToken = await prisma.acces.create({
                data:{
                    userId: user.id,
                    name: 'tokens login',
                    token: token
                }
              })

            return res.status(200).json({
                status: "200",
                message: "Login success",
                data: {
                    name: user.name,
                    message: "Successfully login",
                    token: token
                }
            });
        }catch(error){
            return res.status(500).json({
                status: "500",
                message: error.message
            });
        }
    }

    static async logout(req, res){
        const token = await prisma.acces.deleteMany({
            where:{
                token: req.token
            }
        });

        if(!token){
            return res.status(401).json({
                status: "401",
                message: "Invalid token"
            });
        }

        return res.status(200).json({
            status: "200",
            message: "Logout success"
        });
    }
}

module.exports = AuthController;