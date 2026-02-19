"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const env_1 = require("./config/env");
const auth_1 = require("./routes/auth");
const profile_1 = require("./routes/profile");
async function main() {
    await mongoose_1.default.connect(env_1.env.mongoUri);
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({ origin: env_1.env.corsOrigin }));
    app.use(express_1.default.json());
    app.get('/health', (_req, res) => {
        res.json({ ok: true });
    });
    app.use('/api/auth', auth_1.authRouter);
    app.use('/api/profile', profile_1.profileRouter);
    const webDir = path_1.default.resolve(__dirname, '../../web');
    app.use(express_1.default.static(webDir));
    app.get('*', (req, res) => {
        if (req.path.startsWith('/api')) {
            res.status(404).json({ message: 'Not found' });
            return;
        }
        res.sendFile(path_1.default.join(webDir, 'index.html'));
    });
    app.listen(env_1.env.port, () => {
        // eslint-disable-next-line no-console
        console.log(`Backend listening on port ${env_1.env.port}`);
    });
}
main().catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
});
