const express = require('express');
const wbm = require('wbm');
const QRCode = require('qrcode');
const path = require('path');
const app = express();
const router = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let wbmSession = undefined;

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
})

router.get('/site-main.js', (req, res) => {
    res.sendFile(path.join(__dirname + '/site-main.js'));
})

router.all('/desconectar', (req, res) => {
    if (this.wbmSession != undefined) {
        this.wbmSession = undefined;
        wbm.start(false, false, false);
        // this.wbmSession.then(() => {
        //     wbm.end();
        //     this.wbmSession = undefined;
        // })
    }
    res.send('ok');
})
router.all('/conectar', (req, res) => {
    if (this.wbmSession !== undefined) {
        res.send('OK.');
        return;
    }

    this.wbmSession = wbm.start({showBrowser: true, qrCodeData: false, session: true})
        .then(() => {
            res.send('OK');
        })
        .catch((err) => {
            throw err;
        })
})


router.post('/envio', async (req, res) => {
    if (
        !req.body.msg
        || !req.body.lista
    ) {
        res.send({"error": "preencha os campos"});
        return;
    }

    if (this.wbmSession == undefined) {
        throw 'error, session nao iniciada';
    }

    let mensagem = req.body.msg;
    let lista = req.body.lista.split('\n');

    this.wbmSession.then(async () => {
        const message = 'Testando: ' + mensagem;
        const phones = lista;

        console.info(message, phones);

        wbm.send(phones, message);
        res.send('ENVIADO');
    }).catch((err) => {
        wbm.end();
        console.error(err);
        res.send({"erro": "interno", "err": err});
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
