"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function required(name) {
    const v = process.env[name];
    if (!v)
        throw new Error(`Missing env: ${name}`);
    return v;
}
exports.env = {
    port: parseInt(process.env.PORT || '3001', 10),
    mongoUri: required('MONGODB_URI'),
    jwtSecret: required('JWT_SECRET'),
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:4200'
};
