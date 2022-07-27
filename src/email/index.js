import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API);

export const sendWelcomeEmail = async (email, name) => {
    const mes = {
        to: email,
        from: 'test@gmail.com',
        subject: 'Thanks for joining in',
        text: `Welcome to the app, ${name}, We are thrilled to see you`,
        // html: '<strong>and easy to do anywhere, even with Node.js</strong>'
    }
    try {
     await   sgMail.send(mes)
    }
    catch (e) {
        console.log(e)
    }

}

export const sendCancelEmail = async (email, name) => {
    const mes = {
        to: email,
        from: 'proftoby97@gmail.com',
        subject: 'Whoops, we are disappointed to see you go',
        text: `Goodbye ${name}, is there anything we could have done better`,
    }
    try {
        await   sgMail.send(mes)
    }
    catch (e) {
        console.log(e)
    }

}

// const headers  = {
//     'Content-Type' : 'application/json',
//     api_key : api
// }
// const response = await axios.post('https://api.pepipost.com/v5/mail/send', {
//     from: {
//         email: 'codetest@net.com',
//         name: 'Code test'
//     },
//     subject: 'This is a confirmation',
//     content: [{type: 'html', value: 'Hello Lionel, Your flight for Barcelona is confirmed.'}],
//     personalizations: [{to: [{email: 'proftoby97@gmail.com', name: 'Samuel toby'}]}]
// }, {
//     headers
// })
// console.log(response.data);
