const prisma = require("../../bin/prismaConfig");
const { hashSync, genSaltSync, compareSync, hash } = require("bcrypt");

class MemberController {
    static async getMembers(req, res, next) {
        try{
            const { search } = req.query;
            const page = req.query.page || 0;
            const limit = 10; // Jumlah data per halaman
            const offset = (page - 0) * limit;
      
            // Menyiapkan kondisi pencarian
            let whereCondition = {
              role: "user",
              is_active: true,
            };
      
            if (search) {
              whereCondition = {
                ...whereCondition,
                OR: [
                  { name: { contains: search } },
                  { email: { contains: search } },
                  { username: { contains: search } },
                ],
              };
            }

            const member = await prisma.user.findMany({
                where: whereCondition,
                select: {
                  id: true,
                  barnId: true,
                  name: true,
                  address: true,
                  email: true,
                  username: true,
                },
                take: limit,
                skip: offset,
            });


            const totalData = await prisma.user.count({where: whereCondition });
            const totalPage = Math.ceil(totalData / limit);

            if(member.length === 0){
                return res.status(404).json({
                    status: 404,
                    message:"Member not found", 
                });
            } else {
                return res.status(200).json({
                    status: 200,
                    message: "Success",
                    data: member,
                    page: parseInt(page),
                    totalPage,
                    totalData,
                });
            }
        }catch(error){
            console.log(error);
            return res.status(500).json({
                status: 500,
                message: "Internal Server Error",
            });
        }
    }

    static async getMemberById(req, res, next) {
      try {
        let { id } = req.params;
        id = parseInt(id);

            const member = await prisma.user.findUnique({
                where: {
                id: id,
                },
                select: {
                    barnId: true,
                    name: true,
                    address: true,
                    email: true,
                },
            });

            if (!member) {
                return res.status(404).json({
                status: "404",
                message: "Member with id " + id + " not found",
                });
            } else {
                return res.status(200).json({
                status: "200",
                message: "Success get member " + member.name + "",
                data: member,
                });
            }
        } catch (error) {
        console.log(error);
        return res.status(500).json(error);
        }
    }

    static async storeMember(req, res, next) {
        try {
            const {name , address, email, username, password} = req.body;
            if(!name || !address || !email || !username || !password){
                return res.status(400).json({
                    status: 400,
                    message: "All field is required",
                });
            }

            const existingUsername = await prisma.user.findFirst({
                where: {
                  OR: [
                    { username: username, is_active: true },
                    { username: username, is_active: false },
                  ],
                },
              });
        
              const existingEmail = await prisma.user.findFirst({
                where: {
                  OR: [
                    { email: email, is_active: true },
                    { email: email, is_active: false },
                  ],
                },
              });
        
              if (existingUsername && existingEmail) {
                return res.status(400).json({
                  status: false,
                  message: "Username and Email already exist",
                });
              }
        
              if (existingUsername) {
                return res.status(400).json({
                  status: "400",
                  message: "Username has already been taken",
                });
              }
        
              if (existingEmail) {
                return res.status(400).json({
                  status: "400",
                  message: "Email has already been taken",
                });
              }

              const salt = genSaltSync(10);
              const hashedPassword = hashSync(password, salt);

              const newMember = await prisma.user.create({
                data:{
                    name: name,
                    address: address,
                    email: email,
                    username: username,
                    password: hashedPassword,
                }
              })

            return res.status(201).json({
                status: 201,
                message: "Member created",
                data: newMember,
            });
            
        } catch (error) {
            console.log(error);
            return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            });
        }
    }

    static async updateMember(req, res, next) {
        try {
          const {name, address, email, username, password} = req.body;
          let { id } = req.params;
          id = parseInt(id);
          if (!id || isNaN(id)) {
            return res.status(400).json({
              status: 400,
              message: "ID is required",
            });
          }

          const findMember = await prisma.user.findUnique({
            where: {
              id: id,
            },
          });

          if(!findMember){
            return res.status(404).json({
              status: 404,
              message: `Member with id ${id} not found`,
            });
          }

          const existingUsername = await prisma.user.findFirst({
            where: {
              OR: [
                { username: username, is_active: true },
                { username: username, is_active: false },
              ],
            },
          });
    
          const existingEmail = await prisma.user.findFirst({
            where: {
              OR: [
                { email: email, is_active: true },
                { email: email, is_active: false },
              ],
            },
          });
    
          if (username && existingUsername && existingUsername.id !== id) {
            return res.status(400).json({
              status: "400",
              message: "Username has already been taken",
            });
          } else if (email && existingEmail && existingEmail.id !== id) {
            return res.status(400).json({
              status: "400",
              message: "Email has already been taken",
            });
          }

          const salt = genSaltSync(10);
          const hashedPassword = hashSync(password, salt);

          const updatedMember = await prisma.user.update({
            where: {
              id: id,
            },
            data: {
              name: name || findMember.name,
              address: address || findMember.address,
              email: email || findMember.email,
              username: username || findMember.username,
              password: hashedPassword || findMember.password,
            },
          })

          if(!updatedMember){
            return res.status(400).json({
              status: 400,
              message: "Failed to update member",
            });
          }

          return res.status(200).json({
            status: 200,
            message: "Member updated",
            data: {
              name: updatedMember.name,
              address: updatedMember.address,
              email: updatedMember.email,
              username: updatedMember.username,
            }
          });

        } catch (error) {
          return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
          });
        }
    }
}

module.exports = MemberController;
