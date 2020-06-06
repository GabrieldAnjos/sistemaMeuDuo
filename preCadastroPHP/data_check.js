
/**
 * Uses Regex for email check
 * @param {String} email 
 */
function is_email_valid(email) {

    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
}


$(document).ready(function () {

    //campo de email
    const email_field = $('form > #email')

    //mostra dica visual que o email está no formato errado
    email_field.on('input', () => {

        if (is_email_valid(email_field.val()))
            email_field.removeClass('error');
        else
            email_field.addClass('error');

    })

});

