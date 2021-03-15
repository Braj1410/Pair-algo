import "./styles.css";
import { Config } from "./config.js";
import Web3 from "web3";
import { Token, Pair, ChainId, Fetcher } from "@pancakeswap-libs/sdk";
var Provider = require("@ethersproject/providers");

var pairOne = [];
var Ax = [];
var Ay = [];
var pairThree = [];
var FinalPair = [];

const Ether = new Provider.StaticJsonRpcProvider(
  "https://bsc-dataseed3.defibit.io/"
);

async function multiHop() {
  Config.map(async (token, i) => {
    //Checksum Address
    const checksumInput1 = Web3.utils.toChecksumAddress(
      "0xe9e7cea3dedca5984780bafc599bd69add087d56"
    );
    const checksumInput2 = Web3.utils.toChecksumAddress(token.address);

    //Initiate Tokens
    const fixed = new Token(
      ChainId.MAINNET,
      checksumInput1,
      18,
      "BUSD",
      "BUSD Token"
    );

    const x = new Token(
      ChainId.MAINNET,
      checksumInput2,
      token.decimals,
      token.symbol,
      token.name
    );
    try {
      const pair = await Fetcher.fetchPairData(fixed, x, Ether);
      pairOne.push(pair);
      Ax.push(token);
    } catch {}
  });
  console.log(pairOne);
  await pairTwo();
  await END();
}

async function pairTwo() {
  Config.map(async (token, i) => {
    //Checksum Address
    const checksumInput2 = Web3.utils.toChecksumAddress(token.address);
    const checksumInput3 = Web3.utils.toChecksumAddress(
      "0x55d398326f99059ff775485246999027b3197955"
    );

    //Initiate Tokens
    const fixed = new Token(
      ChainId.MAINNET,
      checksumInput3,
      18,
      "USDT",
      "Tether USD"
    );

    const y = new Token(
      ChainId.MAINNET,
      checksumInput2,
      token.decimals,
      token.symbol,
      token.name
    );
    try {
      const pair = await Fetcher.fetchPairData(fixed, y, Ether);
      pairThree.push(pair);
      Ay.push(token);
    } catch {}
  });
  console.log(pairThree);
  console.log(pairThree.length, Ay.length);
}

async function END() {
  Ax.forEach(async (x, i) => {
    Ay.forEach(async (y, j) => {
      const Xchecksum = Web3.utils.toChecksumAddress(x.address);
      const Ychecksum = Web3.utils.toChecksumAddress(y.address);
      const TokenX = new Token(
        ChainId.MAINNET,
        Xchecksum,
        x.decimals,
        x.symbol,
        x.name
      );

      const TokenY = new Token(
        ChainId.MAINNET,
        Ychecksum,
        y.decimals,
        y.symbol,
        y.name
      );

      try {
        const temp = await Fetcher.fetchPairData(TokenX, TokenY, Ether);
        FinalPair.push(temp);
      } catch {
        console.log(Error);
      }
    });
  });
  console.log(FinalPair);
}

export default function App() {
  return (
    <div className="App">
      <button onClick={() => multiHop()}>Compare</button>
    </div>
  );
}
