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
    if (wbmSession != undefined) {
        await wbm.start(false, false, false).then(() => wbmSession = undefined);
    }

    res.send('ok');
})
router.all('/conectar', async (req, res) => {
    if (wbmSession !== undefined) {
        inicializar(res, wbmSession)
        return;
    }

    if (transaction == false) {
        transaction = true;
        
        wbmSession = wbm.start({showBrowser: false, qrCodeData: false, session: true});
        
        inicializar(res, wbmSession)
        return;
    }

    res.send({"error": "existe uma transacao em aberto"});
})


router.post('/envio', async (req, res) => {
    validation(req, res, wbmSession);

    transaction = true;
    let mensagem = req.body.msg;
    let lista = req.body.lista.split('\n');

    wbmSession.then(async () => {
        const message = 'Testando: ' + mensagem;
        const phones = lista;

        wbm.send(phones, message)
            .then(() => {
                transaction = false;
                res.send('Enviado!');
                return ;
            })
            .catch(() => {
                res.send({"error": "erro ao enviar as mensagens"});
                return ;
            })
    })
    .catch((err) => {
        transaction = false;
        console.error(err);
        res.send({"erro": "interno", "err": err});
        return ;
    });
})


app.use('/whatsapp/', router);





app.listen(process.env.PORT || 9999, '0.0.0.0');


function inicializar(res, wbmSession) {
    wbmSession
        .then(async () => {
            await wbm.waitQRCode();
            res.send('Conectado!');
            console.info('pareado!');
            transaction = false;
        })
        .catch((err) => {
            console.info(err);
            transaction = false;
            res.send({msg: 'qr code nao reconhecido', err: err});
        })
}

function validation(req, res, wbmSession) {
    if (transaction == true) {
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
