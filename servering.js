const express = require('express');
const wbm = require('wbm');
const path = require('path');
const app = express();
const router = express.Router();
const dotenv = require("dotenv");

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var connected = false;

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
})

router.get('/site-main.js', (req, res) => {
    res.sendFile(path.join(__dirname + '/site-main.js'));
})

router.get('/qrcode.js', (req, res) => {
    res.sendFile(path.join(__dirname + '/qrcodejs.js'));
})

router.get('/connected', (req, res) => {
    res.send({connected: connected});
})

router.all('/qrcode', async (req, res) => {
    let code,error,msg;

    await wbm.start({qrCodeData: true, session: false})
    .then(async (qrCodeData) => {
        code = qrCodeData;

        wbm.waitQRCode()
        .then(() => {
            connected = true;
            console.info('pareado!');
        })
        .catch((err) => {
            connected = false;
            error = err;
        })

    }).catch((wbmError) => {
        connected = false;
        console.info(2, err);
        error = wbmError;
        msg = 'erro ao iniciar whatsapp para parear';
    });

    res.send({code, error, msg});
})

router.post('/envio', async (req, res) => {
    if (
        !req.body.msg
        || !req.body.lista
    ) {
        res.send({"error": "preencha os campos"});
        return;
    }

    if (connected == false) {
        res.send({"error": "nao esta conectado!"});
        return;
    }

    let mensagem = req.body.msg;
    let lista = req.body.lista.split('\n');

    wbm.send(lista, mensagem);

    res.send({msg: 'Mensagem enviada para fila de envio!'});
})

app.use('/whatsapp/', router);
app.listen(process.env.PORT || 9999, '0.0.0.0');
