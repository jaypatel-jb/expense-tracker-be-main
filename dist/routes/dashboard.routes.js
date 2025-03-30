"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_controller_1 = __importDefault(require("../controllers/dashboard.controller"));
const router = (0, express_1.Router)();
router.get("/one", dashboard_controller_1.default.Statistics1);
router.get("/two", dashboard_controller_1.default.Statistics2);
router.get("/three", dashboard_controller_1.default.Statistics3);
exports.default = router;
