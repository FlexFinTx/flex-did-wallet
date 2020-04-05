"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var Manager_1 = require("./Manager");
var PORT = parseInt(process.env.PORT) || 3000;
var app = express_1.default();
if (!process.env.COUCH_CONNECTION_URL) {
    throw new Error("Missing CouchDB connection URL");
}
var walletManager = new Manager_1.WalletManager(process.env.COUCH_CONNECTION_URL);
app.use(cors_1.default());
app.use(express_1.default.json());
app.set("walletManager", walletManager);
app.use("/api", require("./routes/wallet"));
app.listen(PORT, function () {
    console.log("Listening on port " + PORT);
});
