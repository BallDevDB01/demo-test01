"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const env_1 = require("../config/env");
exports.authRouter = (0, express_1.Router)();
exports.authRouter.post('/register', [
    (0, express_validator_1.body)('email').isEmail().normalizeEmail(),
    (0, express_validator_1.body)('password').isString().isLength({ min: 6 }),
    (0, express_validator_1.body)('firstName').isString().trim().notEmpty(),
    (0, express_validator_1.body)('lastName').isString().trim().notEmpty(),
    (0, express_validator_1.body)('phone').optional().isString().trim()
], async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const { email, password, firstName, lastName, phone } = req.body;
    const existing = await User_1.User.findOne({ email });
    if (existing) {
        res.status(409).json({ message: 'Email already exists' });
        return;
    }
    const passwordHash = await bcryptjs_1.default.hash(password, 10);
    const user = await User_1.User.create({ email, passwordHash, firstName, lastName, phone });
    const signOptions = { expiresIn: env_1.env.jwtExpiresIn };
    const token = jsonwebtoken_1.default.sign({ userId: user._id.toString() }, env_1.env.jwtSecret, signOptions);
    res.status(201).json({ token });
});
exports.authRouter.post('/login', [(0, express_validator_1.body)('email').isEmail().normalizeEmail(), (0, express_validator_1.body)('password').isString().notEmpty()], async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const { email, password } = req.body;
    const user = await User_1.User.findOne({ email });
    if (!user) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
    }
    const ok = await bcryptjs_1.default.compare(password, user.passwordHash);
    if (!ok) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
    }
    const signOptions = { expiresIn: env_1.env.jwtExpiresIn };
    const token = jsonwebtoken_1.default.sign({ userId: user._id.toString() }, env_1.env.jwtSecret, signOptions);
    res.json({ token });
});
