const express = require('express');
const wbm = require('wbm');
const QRCode = require('qrcode');
const path = require('path');
const app = express();
const router = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let wbmSession = null;

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
})

router.get('/site-main.js', (req, res) => {
    res.sendFile(path.join(__dirname + '/site-main.js'));
})

router.all('/desconectar', (req, res) => {
    console.info(this.wbmSession);

    if (this.wbmSession != undefined) {
        this.wbmSession.then(() => {
            wbm.end();
            this.wbmSession = undefined;
        })
    }
    res.send('ok');
})
router.all('/conectar', (req, res) => {
    if (this.wbmSession !== undefined) {
        res.send('OK.');
        return;
    }
    console.info(this.wbmSession);

    this.wbmSession = wbm.start({showBrowser: true, qrCodeData: false, session: true})
        .then(() => {
            res.send('OK');
        })
        .catch((err) => {
            res.send(err);
        })
})


router.post('/envio', (req, res) => {
    console.info(this.wbmSession);
    if (
        !req.body.msg
        || !req.body.lista
    ) {
        res.send({"error": "preencha os campos"});
        return;
    }

    if (this.wbmSession == undefined) {
        res.send('error, session nao iniciada');
    }

    let mensagem = req.body.msg;
    let lista = req.body.lista.split('\n');

    this.wbmSession.then(async () => {
        const message = 'Testando: ' + mensagem;
        const phones = lista;

        console.info(message, phones);

        await wbm.send(phones, message);
    }).catch((err) => {
        console.error(err);
        res.send(err);
    });
})


app.use('/whatsapp/', router);
app.listen('9999');


// whatsAppStarted.then(async () => {
//     const phones = ['558388072441'];
//     const message = 'Testando: ' + text;
//     await wbm.send(phones, message);
//     await wbm.end();
// }).catch(err => console.log(err));
