"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_1 = require("../middleware/auth");
const User_1 = require("../models/User");
exports.profileRouter = (0, express_1.Router)();
exports.profileRouter.get('/me', auth_1.authRequired, async (req, res) => {
    const user = await User_1.User.findById(req.userId).select('-passwordHash');
    if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
    }
    res.json({ user });
});
exports.profileRouter.put('/me', auth_1.authRequired, [
    (0, express_validator_1.body)('firstName').optional().isString().trim().notEmpty(),
    (0, express_validator_1.body)('lastName').optional().isString().trim().notEmpty(),
    (0, express_validator_1.body)('phone').optional().isString().trim()
], async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const { firstName, lastName, phone } = req.body;
    const user = await User_1.User.findByIdAndUpdate(req.userId, { $set: { ...(firstName !== undefined ? { firstName } : {}), ...(lastName !== undefined ? { lastName } : {}), ...(phone !== undefined ? { phone } : {}) } }, { new: true }).select('-passwordHash');
    if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
    }
    res.json({ user });
});
