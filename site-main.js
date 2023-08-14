$(document).ready(function() {
    $('#desconectar').click(function(e) {
        e.preventDefault();
        $.get('/whatsapp/desconectar')
        .then(() => {
            $('#conectado').value = undefined;
            $('#desconectar').hide();
        })
        .catch((err) => {
            console.error(err);
            return;
        });
    })
    $('#submit').click(async function(e) {
        e.preventDefault();

        if (!$('#conectado').val()) {
            await $.get('/whatsapp/conectar').catch((err) => {
                console.error(err);
                return;
            });
            $('#conectado').value = 1;
            $('#desconectar').show();
        }

        let mensagem = $('#inputMensagem').val();
        let lista = $('#inputLista').val();

        const params = {
            msg: mensagem,
            lista: lista
        };

        $.post('/whatsapp/envio', params, envioMensagemResponse).catch((err) => {
            console.error(err);

        });

    })

    function envioMensagemResponse(resp) {
        if (resp.error) {
            alert(resp.error);
            return;
        }
        console.info(resp);
        $('#inputMensagem').value = '';
        $('#inputLista').value = '';

        alert('ok');
    }
})