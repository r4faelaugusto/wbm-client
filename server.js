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

router.all('/desconectar', async (req, res) => {
    if (this.wbmSession != undefined) {
        await wbm.start(false, false, false).then(() => this.wbmSession = undefined);
    }

    res.send('ok');
})
router.all('/conectar', async (req, res) => {
    if (this.wbmSession !== undefined) {
        res.send({"error": "ja esta conectad0"});
        return;
    }

    if (this.transaction == true) {
        res.send({"error": "existe uma transacao em aberto"});
    }

    this.transaction = true;

    this.wbmSession = wbm.start({showBrowser: false, qrCodeData: false, session: true});

    this.wbmSession
        .then(async () => {
            await wbm.waitQRCode();
            res.send('Conectado!');
            console.info('pareado!');
            this.transaction = false;
        })
        .catch((err) => {
            console.info(err);
            this.transaction = false;
            res.send({msg: 'qr code nao reconhecido', err: err});
        })
})


router.post('/envio', async (req, res) => {
    validation(req, res, this.wbmSession);

    this.transaction = true;
    let mensagem = req.body.msg;
    let lista = req.body.lista.split('\n');

    this.wbmSession.then(async () => {
        const message = 'Testando: ' + mensagem;
        const phones = lista;

        wbm.send(phones, message)
            .then(() => {
                this.transaction = false;
                res.send('Enviado!');
                return ;
            })
            .catch(() => {
                res.send({"error": "erro ao enviar as mensagens"});
                return ;
            })
    })
    .catch((err) => {
        this.transaction = false;
        console.error(err);
        res.send({"erro": "interno", "err": err});
        return ;
    });
})


app.use('/whatsapp/', router);
app.listen(process.env.PORT || 9999, () => {
    console.info('server ok ', process.env.PORT || 9999);
});

function validation(req, res, wbmSession) {
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

    if (wbmSession == undefined) {
        res.send({"error": "whatsapp nao esta conectado"});
        return;
    }
}