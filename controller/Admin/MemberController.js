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

module.exports = MemberController;
