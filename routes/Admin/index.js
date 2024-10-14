const express = require("express");
const Route = express.Router();

const AuthMiddleware = require("../../middleware/authMidlleware");
const AdminMiddleware = require("../../middleware/adminMiddleware");

const MemberController = require("../../controller/Admin/MemberController");

Route.get("/admin/member", AuthMiddleware, AdminMiddleware, MemberController.getMembers);

module.exports = Route;