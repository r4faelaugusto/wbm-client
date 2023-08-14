$(document).ready(function() {
    $('#apagar').click(function(e) {
        $('#inputMensagem').val('');
        $('#inputLista').val('');
    });

    $('#conectar').click(function(e) {
        e.preventDefault();
        $.get('/whatsapp/conectar')
        .then(() => {
            $('#conectado').val(1);
            $('#desconectar').show();
            $('#submit').show();
            $('#conectar').hide();
            $('#inputMensagem').attr('disabled', false);
            $('#inputLista').attr('disabled', false);
        })
        .catch((err) => {
            console.error(err);
            return;
        });  
    })

    $('#desconectar').click(function(e) {
        e.preventDefault();
        $.get('/whatsapp/desconectar')
        .then(() => {
            $('#conectado').val(undefined);
            $('#desconectar').hide();
            $('#submit').hide();
            $('#conectar').show();
            $('#inputMensagem').attr('disabled', true)
            $('#inputLista').attr('disabled', true)
        })
        .catch((err) => {
            console.error(err);
            return;
        });
    })
    $('#submit').click(async function(e) {
        e.preventDefault();

        let mensagem = $('#inputMensagem').val();
        let lista = $('#inputLista').val();

        const params = {
            msg: mensagem,
            lista: lista
        };

        $.post('/whatsapp/envio', params, envioMensagemResponse)
        .then((data) => {
            console.info('ok', data)
            alert('Enviado');
        })
        .catch((err) => {
            console.error(err);
            alert('erro');
        });

    })

    function envioMensagemResponse(resp) {
    }
})