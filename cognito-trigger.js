exports.handler = (event, context, callback) => {
    const email = event.request.userAttributes.email;
    let url = `https://iconoclast.selready.com/confirm-code?email=${email}&&code=${event.request.codeParameter}`
    if (process.env.ENV === 'uatenv') {
        url = `https://sandbox-iconoclast.selready.com/confirm-code?email=${email}&&code=${event.request.codeParameter}`
    }
    const signUpMessage = `
    <!DOCTYPE html>
    <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
                .buttons {
                background-color: #f44336;
                border: none;
                color: white;
                padding: 15px 32px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 16px;
                transition-duration: 0.4s;
                }
                .buttons:hover {
                background-color: #4CAF50; 
                color: white;
                }
            </style>
        <body>
            <div style="margin: 0px auto; max-width: 600px;">
                <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%; border-collapse: collapse;">
                    <tbody>
                        <tr>
                            <td style="direction: ltr; font-size: 0px; padding: 20px 0; padding-bottom: 18px; text-align: center; border-collapse: collapse;">
                                <div class="x_mj-column-per-100 x_outlook-group-fix" style="font-size: 0px; text-align: left; direction: ltr; display: inline-block; vertical-align: top; width: 100%;">
                                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="vertical-align: top; border-collapse: collapse;">
                                        <tbody>
                                            <tr>
                                                <td align="center" style="font-size: 0px; padding: 20px 0px 40px 0px; word-break: break-word; border-collapse: collapse;">
                                                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse: collapse; border-spacing: 0px;">
                                                        <tbody>
                                                            <tr>
                                                                <td style="width: 270px; border-collapse: collapse;">
                                                                    <img
                                                                        data-imagetype="External"
                                                                        blockedimagesrc="https://iaimages5.s3.amazonaws.com/marlonwebsite.jpg"
                                                                        height="auto"
                                                                        width="270"
                                                                        style="border: 0; display: block; outline: none; text-decoration: none; height: auto; width: 100%; font-size: 13px; line-height: 100%;"
                                                                        />
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="center" style="font-size: 0px; padding: 0px; word-break: break-word; border-collapse: collapse;">
                                                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse: collapse; border-spacing: 0px;">
                                                        <tbody>
                                                            <tr>
                                                                <td style="width: 600px; border-collapse: collapse;">
                                                                    <img
                                                                        data-imagetype="External"
                                                                        blockedimagesrc="https://iaimages5.s3.amazonaws.com/marlonwebsite.jpg?w=700"
                                                                        height="auto"
                                                                        width="600"
                                                                        style="border: 0; display: block; outline: none; text-decoration: none; height: auto; width: 100%; font-size: 13px; line-height: 100%;"
                                                                        />
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div style="margin: 15px auto; max-width: 500px;">
                <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%; border-collapse: collapse;">
                <tbody>
                    <tr>
                        <td style="direction: ltr; font-size: 0px; padding: 0px; text-align: center; border-collapse: collapse;">
                            <div class="x_mj-column-per-100 x_outlook-group-fix" style="font-size: 0px; text-align: left; direction: ltr; display: inline-block; vertical-align: top; width: 100%;">
                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="background-color: #ffffff; vertical-align: top; border-collapse: collapse;">
                <tbody>
                <tr>
                <td align="center" style="font-size: 0px; padding: 10px 25px; word-break: break-word; border-collapse: collapse;">
                <div style="font-family: martel; font-size: 40px; line-height: 40px; text-align: left; color: #141414;"><p style="margin: 30px 0px 5px 0px; display: block;">Welcome To Iconoclast Artists</p></div>
                <hr>
                </td>
                </tr>
                <tr>
                <td align="left" style="font-size: 0px; margin: 15px;  padding: 10px 25px; word-break: break-word; border-collapse: collapse;">
                <div style="font-family: work sans, sans-serif; font-size: 16px; line-height: 22px; text-align: left; color: #666666;">
                <p style="display: block; padding-left: 1rem">Hi!</p>
                <p style="display: block; margin: 13px 0; padding-left: 1rem">
                Welcome to Iconoclast Artists.  I am excited to invite you to our online community.  All you need to do to join is to click on the button below and it will take you to our registration page. 
                </p>
                <p style="display: block; margin: 13px 0; padding-left: 1rem">
                We look forward to seeing you online shortly. 
                </p>
                <p style="display: block; margin-top:13px; padding-left: 1rem">
                Kind regards,
                </p>
                <p style="line-height:50%; padding-left: 1rem">
                Marlon Lizama 
                </p>
                <p style="display: block; font-size: .9rem; line-height:10%; padding-left: 1rem">
                <i>Co-Founder, Iconoclast Artists</i> 
                </p>
                <br>
                <P style = "padding-left:1rem; border-radius: 5px;">
                <a style=" width: auto;
                    height: 25px;
                    background: #003366;
                    padding: 10px;
                    text-align: center;
                    color: white;
                    margin: 1rem;
                    text-decoration: none;
                    font-weight: bold;"
                    href="${url}" >Click Here To Join Us Online</a>
                </P>
                <p style ="color:white">{####}</p>
                </div>
                </td>
                </tr>
                </div>
            </div>
        </body>
        </head>
    </html>
    `;

    if (event.triggerSource === "CustomMessage_SignUp") {
        event.response.emailMessage = signUpMessage;
    }
    if (event.triggerSource === "CustomMessage_ForgotPassword") {
        event.response.emailMessage = signUpMessage;
    }
    callback(null, event);
};