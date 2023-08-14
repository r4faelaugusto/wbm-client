const express = require('express');
const wbm = require('wbm');
const QRCode = require('qrcode');
const path = require('path');
const app = express();
const router = express.Router();
const dotenv = require("dotenv");

let wbmSession = undefined;
let transaction = false;
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
})

router.get('/site-main.js', (req, res) => {
    res.sendFile(path.join(__dirname + '/site-main.js'));
})

router.all('/desconectar', (req, res) => {
    console.info('desconectar', wbmSession);
    if (this.wbmSession != undefined) {
        this.wbmSession = undefined;
        wbm.start(false, false, false);
    }
    res.send('ok');
})
router.all('/conectar', async (req, res) => {
    console.info('conectar', wbmSession);
    if (this.wbmSession !== undefined) {
        res.send({"error": "ja esta conectad0"});
        return;
    }

    if (this.transaction == true) {
        res.send({"error": "existe uma transacao em aberto"});
    }

    this.transaction = true;

    this.wbmSession = wbm.start({showBrowser: false, qrCodeData: false, session: true})
        .then(async () => {
            await wbm.waitQRCode();
            res.send('Conectado!');
            this.transaction = false;
        })
        .catch((err) => {
            console.info(err);
            this.transaction = false;
            res.send({msg: 'qr code nao reconhecido', err: err});
        })
})


router.post('/envio', async (req, res) => {
    console.info('envio', this.wbmSession);
    if (this.transaction == true) {
        res.send({"error": "existe uma transacao em aberto"});
        return;
    }

    if (
        !req.body.msg
        || !req.body.lista
    ) {
        res.send({"error": "preencha os campos"});
        return;
    }

    if (this.wbmSession == undefined) {
        res.send({"error": "whatsapp nao esta conectado"});
        return;
    }

    let mensagem = req.body.msg;
    let lista = req.body.lista.split('\n');

    this.wbmSession.then(async () => {
        this.transaction = true;
        const message = 'Testando: ' + mensagem;
        const phones = lista;

        console.info(message, phones);

        wbm.send(phones, message)
        .then(() => {
            this.transaction = false;
        });
        res.send('ENVIADO');
    }).catch((err) => {
        this.transaction = false;
        wbm.end();
        console.error(err);
        res.send({"erro": "interno", "err": err});
    });
})


app.use('/whatsapp/', router);
app.listen(process.env.PORT || 9999, () => {
    console.info('server ok ', process.env.PORT || 9999);
});


// whatsAppStarted.then(async () => {
//     const phones = ['558388072441'];
//     const message = 'Testando: ' + text;
//     await wbm.send(phones, message);
//     await wbm.end();
// }).catch(err => console.log(err));
