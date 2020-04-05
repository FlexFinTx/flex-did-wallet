import express from "express";
import cors from "cors";
import { WalletManager } from "./Manager";

const PORT: number = parseInt(process.env.PORT) || 3000;

const app = express();

if (!process.env.COUCH_CONNECTION_URL) {
  throw new Error("Missing CouchDB connection URL");
}

const walletManager = new WalletManager(process.env.COUCH_CONNECTION_URL);
app.use(cors());
app.use(express.json());

app.set("walletManager", walletManager);

app.use("/api", require("./routes/wallet"));

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
