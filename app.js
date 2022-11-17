const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const app = express();



app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});
app.post("/", function(req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  const data = {
    fname: firstName,
    lname: lastName,
    email: email

  };

  mailchimp.setConfig({
    apiKey: "addapikeyhere",
    server: "addserverhere"
  });
  const listId = "addlistidhere";
  const run = async () => {
    const response = await mailchimp.lists.batchListMembers(listId, {
      members: [{
        email_address: data.email,
        status: 'subscribed',
        merge_fields: {
          FNAME: data.fname,
          LNAME: data.lname
        }
      }],
    }).then(responses => {

            if(responses.id !== "") {
                res.sendFile(__dirname+"/success.html");

            }
          }).catch(err => {
              res.sendFile(__dirname+"/failure.html");
                console.log("err");
          });

      };



  run();

});

app.post("/failure",function(req,res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("server is running in port 3000");
});
