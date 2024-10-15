const express = require("express");
const Route = express.Router();

const AuthMiddleware = require("../../middleware/authMidlleware");
const AdminMiddleware = require("../../middleware/adminMiddleware");

const MemberController = require("../../controller/Admin/MemberController");

Route.get("/admin/member", AuthMiddleware, AdminMiddleware, MemberController.getMembers);
Route.get("/admin/member/:id", AuthMiddleware, AdminMiddleware, MemberController.getMemberById);
Route.post("/admin/member", AuthMiddleware, AdminMiddleware, MemberController.storeMember);
Route.put("/admin/member/:id", AuthMiddleware, AdminMiddleware, MemberController.updateMember);


module.exports = Route;