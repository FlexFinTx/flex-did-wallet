import express from "express";
import { Encodings } from "../../Wallet";
import {
  CreateWalletRequest,
  PatchWalletRequest,
  GetWalletRequest,
  SignRequest,
} from "./interfaces";
import { WalletManager } from "../../Manager";
import { Ed25519KeyPair } from "crypto-ld";

const router = express.Router();

router.get("/test", async (req: express.Request, res: express.Response) => {
  const keyOne = await Ed25519KeyPair.generate();
  const keyTwo = await Ed25519KeyPair.generate();
  const addLaterKey = await Ed25519KeyPair.generate();

  const createWalletReq: CreateWalletRequest = {
    data: {
      keys: [
        {
          type: "assymetric",
          encoding: Encodings.Base58,
          publicKey: keyOne.publicKeyBase58,
          privateKey: keyOne.privateKeyBase58,
          tags: ["Ed25519VerificationKey2018", "#primary"],
          notes: "",
        },
        {
          type: "assymetric",
          encoding: Encodings.Base58,
          publicKey: keyTwo.publicKeyBase58,
          privateKey: keyTwo.privateKeyBase58,
          tags: ["Ed25519VerificationKey2018", "#recovery"],
          notes: "",
        },
      ],
    },
    password: "securePassword",
  };

  const patchWalletRequest: PatchWalletRequest = {
    type: "add-key",
    password: "securePassword",
    key: {
      type: "assymetric",
      encoding: Encodings.Base58,
      publicKey: addLaterKey.publicKeyBase58,
      privateKey: addLaterKey.privateKeyBase58,
      tags: ["Ed25519VerificationKey2018", "#secondary"],
      notes: "",
    },
  };

  const patchWalletRequest2: PatchWalletRequest = {
    type: "remove-key",
    password: "securePassword",
    kid: "<FILL THIS>",
  };

  const getWalletRequest: GetWalletRequest = {
    password: "securePassword",
  };

  res.status(200).json({
    createWalletReq,
    patchWalletRequest,
    patchWalletRequest2,
    getWalletRequest,
  });
});

router.post("/create", async (req: express.Request, res: express.Response) => {
  const walletManager = req.app.get("walletManager") as WalletManager;
  const createWalletRequest = req.body as CreateWalletRequest;
  const response = await walletManager.createNewWalletWithKeys(
    createWalletRequest.data,
    createWalletRequest.password
  );
  if (response) {
    res.status(200).json({ id: response });
    return;
  }
  res.status(500).json({
    error: "Something went wrong trying to create your wallet",
  });
});

router.get("/:id", async (req: express.Request, res: express.Response) => {
  const walletManager = req.app.get("walletManager") as WalletManager;
  const id = req.params.id as string;
  const getWalletRequest = req.body as GetWalletRequest;
  const wallet = await walletManager.getWallet(id, getWalletRequest.password);
  if (wallet) {
    res.status(200).json(wallet);
    return;
  }

  res.status(400).json({
    error: "Invalid wallet id or password",
  });
});

router.patch("/:id", async (req: express.Request, res: express.Response) => {
  const walletManager = req.app.get("walletManager") as WalletManager;
  const id = req.params.id as string;
  const patchWalletRequest = req.body as PatchWalletRequest;
  if (patchWalletRequest.type === "add-key") {
    const response = await walletManager.addKeyToWallet(
      id,
      patchWalletRequest.password,
      patchWalletRequest.key
    );
    if (response) {
      res.status(200).json({ kid: response });
      return;
    } else {
      res.status(400).json({ error: "Invalid key" });
      return;
    }
  } else if (patchWalletRequest.type === "remove-key") {
    const response = await walletManager.removeKeyFromWallet(
      id,
      patchWalletRequest.password,
      patchWalletRequest.kid
    );
    if (response) {
      res.status(200).json({ message: "Successfully removed key!" });
      return;
    } else {
      res.status(400).json({ error: "Invalid kid" });
      return;
    }
  }

  res.status(400).json("Invalid request");
});

router.post("/:id/sign", async (req: express.Request, res: express.Response) => {
  const walletManager = req.app.get("walletManager") as WalletManager;
  const id = req.params.id as string;
  const signRequest = req.body as SignRequest;
  const response = await walletManager.sign(id, signRequest.password, signRequest.kid, signRequest.data);
  if (response) {
    res.status(200).json({signature: response})
    return;
  }

  res.status(400).json("Invalid request")
})

export = router;
