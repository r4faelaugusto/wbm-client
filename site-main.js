$(document).ready(function() {
    $('#apagar').click(function(e) {
        e.preventDefault();

        $('#inputMensagem').val('');
        $('#inputLista').val('');
        $('#apagar').hide();
    });
        
    $('#desconectar').click(function(e) {
        e.preventDefault();

        $.get('/whatsapp/desconectar')
            .then(() => {
                $('#conectar').show();
                $('#desconectar').hide();
                $('#submit').hide();
                $('#inputMensagem').attr('disabled', true)
                $('#inputLista').attr('disabled', true)
                $('#conectar').attr('disabled', false);
            })
            .catch((err) => {
                alert('erro ao desconectar');
                console.error(err);
                return;
            });
    })

    $('#conectar').click(function(e) {
        e.preventDefault();
        $('#conectar').attr('disabled', true);

        $.get('/whatsapp/conectar')
            .then((resposta) => {
                
                if (resposta.error) {
                    $('#conectar').attr('disabled', false);
                    alert(resposta.error);

                    return;
                }

                $('#desconectar').show();
                $('#submit').show();
                $('#conectar').hide();
                $('#conectar').attr('disabled', false);
                $('#inputMensagem').attr('disabled', false);
                $('#inputLista').attr('disabled', false);
                console.info("Conectado");
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
            .catch((err) => {
                console.error(err);
                alert('erro ao conectar');
            });

    })

    function envioMensagemResponse(resp) {
        if (resp.error) {
            alert(resp.error);
            return;
        }

        $('#apagar').show();
    }
})
