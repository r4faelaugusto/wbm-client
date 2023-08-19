$(document).ready(function() {

    var timer;

    var qrcode = new QRCode(document.getElementById("qrcode"), {
        width: 200,
        height: 200,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });
    
    function makeCode(text) {		
        qrcode.makeCode(text);
    }

    $('#apagar').click(function(e) {
        e.preventDefault();

        $('#inputMensagem').val('');
        $('#inputLista').val('');
        $('#apagar').hide();
    });

    $('#myModal').on('hide.bs.modal', () => {
        $('#conectar').attr('disabled', false);
        clearInterval(timer);
    })

    let updateQRCode = async () => {
        await $.get('/whatsapp/qrcode')
        .then((resposta) => {
            if (resposta.error) {
                $('#conectar').attr('disabled', false);
                alert(resposta.msg);
                clearInterval(timer);
                return;
            }
            console.info(resposta.code);
            makeCode(resposta.code);
            $("#myModal").modal('show');
        });
    }

    $('#conectar').click(function(e) {
        e.preventDefault();
        $('#conectar').attr('disabled', true);

        updateQRCode();

        timer = setInterval(async () => {
            $.get('/whatsapp/connected')
            .then((resposta) => {
                if (resposta.connected) {
                    $('#submit').show();
                    $('#conectar').hide();
                    $('#conectar').attr('disabled', false);
                    $('#inputMensagem').attr('disabled', false);
                    $('#inputLista').attr('disabled', false);
                    $('#myModal').modal('hide');

                    clearInterval(timer);
                    return;
                }
                updateQRCode();
            })
    
        }, 20000);
    })

    $('#submit').click(async function(e) {
        e.preventDefault();

        let mensagem = $('#inputMensagem').val();
        let lista = $('#inputLista').val();
        $('#inputMensagem').attr('disabled', true);
        $('#inputLista').attr('disabled', true);

        const params = {
            msg: mensagem,
            lista: lista
        };

        $.post('/whatsapp/envio', params, envioMensagemResponse)
        .catch((err) => {
            console.error(err);
            alert('erro ao conectar');
            $('#inputMensagem').attr('disabled', false);
            $('#inputLista').attr('disabled', false);
        })
    })

    function envioMensagemResponse(resp) {
        $('#inputMensagem').attr('disabled', false);
        $('#inputLista').attr('disabled', false);

        if (resp.error) {
            alert(resp.error);
            return;
        }

        $('#apagar').show();
        alert(resp.msg);
    }
})
