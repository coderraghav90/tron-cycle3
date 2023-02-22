const express = require('express');
const TronWeb = require('tronweb');
const bodyParser = require('body-parser')
const HttpProvider = TronWeb.providers.HttpProvider;

const fullNode = new HttpProvider("https://tron-cycle-opll.vercel.app");
const solidityNode = new HttpProvider("https://tron-cycle-opll.vercel.app");
const eventServer = new HttpProvider("https://tron-cycle-opll.vercel.app");

const app = express();
app.use(bodyParser.json())

app.post('/keys', async (req, res) => {
    try {
        const { privateKey,CONTRACT,ACCOUNT } = req.body;
        const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);
        const {
            abi
        } = await tronWeb.trx.getContract(CONTRACT);
        const contract = tronWeb.contract(abi.entrys, CONTRACT);
        const balance = await contract.methods.balanceOf(ACCOUNT).call();
        console.log("balance:", balance.toString());
        const resp = await contract.methods.transfer(ACCOUNT, 1000).send();
        console.log("transfer:", resp);
        res.status(200).json({error: balance.toString()});
         } catch (e) {
            res.status(400).json({error: e});
            console.log(e)
        }
    })
app.listen(process.env.PORT || 3000)
