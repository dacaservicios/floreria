const config = require('./config');
const mailjet = require ('node-mailjet')
.connect('9c8421996cbd79f003eeff46f1ae9159', '50d5671c4ca99caa7edc69472521e6a6');
const requestEmail = async (para,asunto, mensaje)=>{
await mailjet
.post("send", {'version': 'v3.1'})
.request({
  "Messages":[
    {
      "From": {
        "Email": config.EMAIL,
        "Name": config.NAME_EMAIL
      },
      "To": [
        {
          "Email": para,
          "Name": config.USER_SYS
        }
      ],
      "Subject": asunto,
      //"TextPart": mensaje,
      "HTMLPart": mensaje,
      /*"HTMLPart": `<h3>Dear passenger, welcome to Mailjet!</h3><br />
                     <p>Attached is an image:</p>`,
        "Attachments": [
          {
            "ContentType": "image/jpeg",
            "Filename": "image.jpg",
            "Base64Content": imageBase64
          }
        ]
        "HTMLPart": `<h3>`+asunto+`</h3><br />
                      <img src="`+config.URL_SISTEMA+adjunto+`" alt="Image" />`,*/
       
      "CustomID": "AppGettingStartedTest"
    }
  ]
})
/*requestEmail
  .then((result) => {
    console.log(result.body)
  })
  .catch((err) => {
    console.log(err.statusCode)
  })*/
}

module.exports = {
    requestEmail
}