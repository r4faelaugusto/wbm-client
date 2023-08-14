$(document).ready(function() {
    $('#apagar').click(function(e) {
        e.preventDefault();
        $('#inputMensagem').val('');
        $('#inputLista').val('');
        $('#apagar').hide();
    });

    $('#enviar').click(function(e) {
        e.preventDefault();

        $('#inputMensagem').attr('disabled', true)
        $('#inputLista').attr('disabled', true)
        $('#enviar').attr('disabled', true)

        const params = {
            msg: $('#inputMensagem').val(),
            lista: $('#inputLista').val()
        };

        $.post('/whatsapp/enviar', params, envioMensagemResponse)
            .then((data) => {
                $('#inputMensagem').attr('disabled', false)
                $('#inputLista').attr('disabled', false)
                $('#enviar').attr('disabled', false)
                
                if (data.error) {
                    alert(data.error);
                }
                $('#apagar').show();
            })
            .catch((err) => {
                console.error(err);
                alert('erro ao conectar');
                $('#inputMensagem').attr('disabled', false)
                $('#inputLista').attr('disabled', false)
                $('#enviar').attr('disabled', false)
            });
    });

    $('#conectar').click(function(e) {
        e.preventDefault();
        $('#conectar').attr('disabled', true);

        $.get('/whatsapp/conectar')
        .then(() => {
            $('#conectado').val(1);
            $('#desconectar').show();
            $('#submit').show();
            $('#conectar').hide();
            $('#conectar').attr('disabled', false);
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
        $('#inputMensagem').attr('disabled', true)
        $('#inputLista').attr('disabled', true)

        const params = {
            msg: mensagem,
            lista: lista
        };

        $.post('/whatsapp/envio', params, envioMensagemResponse)
        .then((data) => {
            if (data.error) {
                alert(data.error);
            }

            $('#apagar').show();
            console.info(data);
            $('#inputMensagem').attr('disabled', false)
            $('#inputLista').attr('disabled', false)
        })
        .catch((err) => {
            console.error(err);
            alert('erro ao conectar');
            $('#inputMensagem').attr('disabled', false)
            $('#inputLista').attr('disabled', false)
        });

    })

    function envioMensagemResponse(resp) {
    }
})