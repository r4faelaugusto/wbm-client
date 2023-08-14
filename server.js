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
app.use('/whatsapp/', router);

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
})

router.get('/site-main.js', (req, res) => {
    res.sendFile(path.join(__dirname + '/site-main.js'));
})

router.post('/enviar', async (req, res) => {
    validation(req, res);
    this.transaction = true;

    let mensagem = req.body.msg;
    let lista = req.body.lista.split('\n');

    wbm.start({showBrowser: false, qrCodeData: false, session: true})
    .then(async () => {
        await wbm.waitQRCode();

        const message = 'Testando: ' + mensagem;
        const phones = lista;

        console.info(message, phones);

        wbm.send(phones, message)
            .then(() => {
                this.transaction = false;
                res.send('ENVIADO');
                return;
            })
            .catch(() => {
                res.send({"error": "Erro ao enviar", "err": err});
            })
    })
    .catch((err) => {
        console.info(err);
        this.transaction = false;
        res.send({"error": "erro ao conectar no whatsapp"});
        return;
    })
})

app.listen(process.env.PORT || 9999, () => {
    console.info('server ok ', process.env.PORT || 9999);
});

function validation(req, res) {
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
}
