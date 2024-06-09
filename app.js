const dialogflow = require('@google-cloud/dialogflow');
const { WebhookClient, Suggestion } = require('dialogflow-fulfillment');
const express = require("express")
const cors = require("cors");
const nodemailer = require('nodemailer')

const app = express();
app.use(express.json())
app.use(cors());
const PORT = 3002;


app.get('/', (req, res) => {
    res.send('Hello Dialogflow!')
})

app.post("/webhook", async (req, res) => {
    var id = (res.req.body.session).substr(43);
    console.log(id)
    const agent = new WebhookClient({ request: req, response: res });

    // function welcome(agent) {
    //     console.log(`intent  =>  hi`);
    //     agent.add("Hi there, I am your AI Assistant. Before starting the conversation, Could you please tell me your name?")
    // }


    function sendemail(agent) {
        const { person, phone, email } = agent.parameters;
        console.log(`intent => email`);
        const accountSid = 'AC7b3d94adab382bb7ee590066c4a6b988';
        const authToken = 'bac2cff0130b9ed6466986b067241a74';
        const client = require('twilio')(accountSid, authToken);

        agent.add(
            `Email has sent to the user.`
        )
        client.messages
            .create({
                body: `Hi there, We received your email with your name ${person.name}  with your phone number ${phone}. Thank You for your email.`,
                from: '+17154494659',
                to: '+923082323198'
            })
            .then(message => console.log(message.sid));

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'mubashirahmed87576@gmail.com',
                pass: 'uwmiphjjfnavybxf'
            }
        });

        var mailOptions = {
            from: 'mubashirahmed87576@gmail.com',
            to: 'zuuzee447@gmail.com',
            subject: 'Sending Email From Node JS Server',
            text: `Hi there, We received your email with your name ${person.name}  with your phone number ${phone}. Thank You for your email.`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }

    let intentMap = new Map();
    // intentMap.set('contact', contact);
    // intentMap.set('about', about);
    intentMap.set('Default Welcome Intent', welcome);
    intentMap.set('sendemail', sendemail);
    agent.handleRequest(intentMap);
})

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});