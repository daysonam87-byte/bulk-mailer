const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();
app.use(bodyParser.json());

app.get("/", (req,res)=>{

res.send(`

<!DOCTYPE html>
<html>
<head>

<title>Bulk Mailer</title>

<link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">

<style>

body{
font-family:Arial;
background:#f5f5f5;
display:flex;
justify-content:center;
padding:30px;
}

.box{
background:white;
width:450px;
padding:25px;
border-radius:12px;
box-shadow:0 0 10px rgba(0,0,0,0.1);
}

input{
width:100%;
padding:12px;
margin:8px 0;
border-radius:8px;
border:1px solid #ddd;
}

button{
width:100%;
padding:12px;
background:#4f46e5;
color:white;
border:none;
border-radius:8px;
cursor:pointer;
margin-top:10px;
}

.dark{
background:#111;
color:white;
}

</style>

</head>

<body>

<div class="box">

<h2>Good Morning</h2>

<button onclick="dark()">🌙 DARK MODE</button>

<label>First Name</label>
<input id="name" placeholder="Enter your first name">

<label>Sent From</label>
<input id="email" placeholder="your.email@gmail.com">

<label>App Password</label>
<input id="pass" placeholder="Gmail App Password">

<label>Subject</label>
<input id="subject" placeholder="Email Subject">

<label>Email Body</label>

<div id="editor" style="height:150px"></div>

<label>Emails</label>
<input id="emails" placeholder="email1@gmail.com,email2@gmail.com">

<button onclick="send()">Send Mail</button>

<p id="status"></p>

</div>

<script src="https://cdn.quilljs.com/1.3.6/quill.js"></script>

<script>

var quill = new Quill('#editor', {
theme: 'snow'
});

function dark(){
document.body.classList.toggle("dark")
}

function send(){

fetch("/send",{

method:"POST",
headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

name:document.getElementById("name").value,
email:document.getElementById("email").value,
pass:document.getElementById("pass").value,
subject:document.getElementById("subject").value,
message:quill.root.innerHTML,
emails:document.getElementById("emails").value

})

})
.then(res=>res.text())
.then(data=>{

document.getElementById("status").innerText=data

})

}

</script>

</body>
</html>

`)

})

app.post("/send",async(req,res)=>{

const {name,email,pass,subject,message,emails}=req.body

const transporter = nodemailer.createTransport({

service:"gmail",

auth:{
user:email,
pass:pass
}

})

const list = emails.split(",")

for(let i=0;i<list.length;i++){

await transporter.sendMail({

from:name+"<"+email+">",
to:list[i],
subject:subject,
html:message

})

}

res.send("Emails Sent Successfully")

})

app.listen(3000,()=>{

console.log("Server running on port 3000")

})