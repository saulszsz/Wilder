const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const bodyParser = require("body-parser");
const express = require("express");
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


router.post('redirect', (req, res) => {
    res.redirect(req.get('host') + req.body.liga);
    res.end();
});

router.post('/logout', (req, res) => {
    res.clearCookie('session');
    res.json(true);
});

//Cosas necesarias para enviar el formulario de contact
router.use(express.urlencoded({extended: false})); //Sirve para entender los datos que lleguen del formulario y que no salga como undefined
router.use(express.json());//Hace que el servidor entienda datos en formatos JSON

require('dotenv').config(); 
const nodemailer = require('nodemailer');

router.post('/enviar_contacto', (req,res) => {
    var body=req.body;     //console.log(req.body);
    contentHTML = `
        <h1>Informacion del Usuario</h1>
        <ul>
        <li>Nombre: ${body.name}</li>
        <li>Email: ${body.mail}</li>
        <li>Telefono: ${body.phone}</li>
        </ul>
        <p>Mensaje: ${body.message}</p>
    `;
                                                            //console.log(contentHTML);    
    //Step 1
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth:{
            user:'WilderApiISC@gmail.com',
            pass:'Hola1234'
        }
    });

    //Step 2
    let mailOptions={
        from: '',
        to:'WilderApiISC@gmail.com',
        subject:'Mensaje de Contacto',
        html:contentHTML
        //text:''+contentHTML
    };

    //Step 3
    transporter.sendMail(mailOptions, function (err,data){
        if(err){
            console.log('Error');
        }else{
            console.log('Succes');
        }
    });

    res.send('/succes.html');
});
//Fin de Cosas necesarias para enviar el formulario de contact


module.exports = router;
