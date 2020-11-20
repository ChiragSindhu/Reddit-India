const express = require('express');
const nmailer = require('nodemailer');
const app = express();
const path = require('path');

require('dotenv').config();

const cors = require('cors');
const sqlCon = require('../Server/database/mysql_connection');

const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(express.static(path.resolve(__dirname, '../Pages/')));

app.get('/', function(request, response) {
    response.sendFile(path.resolve(__dirname, '../Pages/Intro/Intro.html'));
});

///---------------------Show Questions On HomePage---------------/////
app.get('/question', async function (request, response) { 
    var statement = "SELECT Id,Question,Sender_ID,Likes FROM question ORDER BY Id;";
    sqlCon.query(statement, async function (err, result) { 
        if (err) { 
            console.log(err);
            response.json({
                data: err.message
            });
        }
        //console.log(result);
        response.json({
            data : result
        });
    });
});
///------------------------------------------------------------///

///---------------------Show SEARCHED Questions On HomePage---------------/////
app.post('/search', async function (request, response) { 
    const search = request.body.s;
    const Type = request.body.sv;

    var statement = "SELECT Id,Question FROM question where " + Type + " like '%" + search + "%' ORDER BY Id;";
    sqlCon.query(statement,async function (err, result) { 
        if (err) { 
            console.log(err);
            response.json({
                data: err.message
            });
        }
        //console.log(result);
        response.json({
            data : result
        });
    });
});
///------------------------------------------------------------///

//////------------------Ask a Question---------------------------------//
app.post('/addQuestion', function (request,response) { 
    const question = request.body.quests;
    const description = request.body.desc;
    const ID = request.body.id;

    var statement = "INSERT INTO question(Question,Description,Sender_ID) VALUES (?,?,?);"
    sqlCon.query(statement, [question,description,ID], function (err) { 
        if (err) { 
            console.log("Error Found!!!");
            throw err;
        }
        statement = "SELECT Max(Id) as ID FROM Question;";
        sqlCon.query(statement, function (errs,result) { 
            if (errs) throw errs;
            console.log(result);
            response.json({
                data: result
            });
        });
    });
})
/////--------------------------------------------------------------------------------//

///-----------LOGIN PAGE---------------//
app.post('/login',async function (request, response) {
    var email = await request.body.email;
    console.log(email);
    const statement = "SELECT User_Id,User_Fname,User_Lname,User_Password FROM user WHERE User_Email = ? ;";
    sqlCon.query(statement,email,function (err,result) { 
        if (err) throw err;
        console.log(result);
        response.json({
            data: result
        });
    });

});
//---------------------------------------//

///------Register Page-----------------------------//
app.post('/register', async function (request, response) {
    const Fname = request.body.FirstName;
    console.log(Fname);

    const Lname = request.body.LastName;
    console.log(Lname);

    const E_mail = request.body.Email;
    console.log(E_mail);

    const Pword = request.body.Password;
    console.log(Pword);

    const statement = "INSERT INTO user(User_Fname,User_Lname,User_Email,User_Password) VALUES (?,?,?,?);";
    sqlCon.query(statement, [Fname, Lname, E_mail, Pword], async function (err, result) { 
        if (err) {
            console.log("Error");
            response.json({ data: err });
            return;
        }
        console.log(result);
        response.json({ data: result });
        await sendMail(E_mail);
    });
})
//------------------------------------------------//

/////--------------------------------Show Questions-----------------------------//
app.post('/viewQuestion', async function (request, response) { 
    const ques_Id = request.body.id;
    //console.log(ques_Id);
    var statement = "select * from Question,Answer where Question.Id = ? && Question.Id = Answer.ID;";
    sqlCon.query(statement, [ques_Id],function (err, result) { 
        if (err) throw err;
        
        if (result[0] == null) {
            statement = "select * from Question where Question.Id = ?;";
            sqlCon.query(statement, [ques_Id], function (err1, result1) {
                if (err1) throw err1;
                response.json({
                    data: result1
                });
            });
        } else { 
            response.json({
                data : result
            });
        }
    });
});
////----------------------------------------------------------------------------------//

////------------------------Add Answer to Question-----------------------------------//
app.post('/addAnswer', async function (request, response) { 
    var answer = '###@@@###'; 
    answer += request.body.ans;
    var Id = request.body.id;

    var statement = "Select ID from Answer where ID = ?";
    sqlCon.query(statement, [Id], function (err, result1) {
        if (err) throw err;

        if (result1[0] == null) {
            statement = "INSERT INTO Answer VALUES (?,?);";
            sqlCon.query(statement, [Id,request.body.ans], function (err,result) { 
                if (err) throw err;
                response.json({
                    data : result
                });
            });
        } else { 
            statement = "UPDATE Answer set Answer = concat(Answer,?) where ID = ?";
            sqlCon.query(statement, [answer,Id], function (err,result) { 
                if (err) throw err;
                response.json({
                    data : result
                });
            });
        }
    });
});
////----------------------------------------------------------------------------//

//-------------Send Mail--------------------------------------------//
async function sendMail(eemail) {

    var mailOptions = {
        from: 'chiragsindhuroyaljaat@gmail.com',
        to: eemail,
        subject: 'Sending Email using Node.js',
        html: '<h1>Your Account Created Sucessfully.</h1><hr>Your Can Login From here..     file:///D:/Projects/Reddit%20India/Pages/Login/login.html'
    };
  
    var transporter = nmailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'chiragsindhuroyaljaat@gmail.com',
            pass: 'mluarsooalsbhzdv'
        }
    });

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return error;
        } else { 
            return "OK";
        }
    });
}
//------------------------------------------------------------//

app.listen(port, function () { 
    console.log("Server running on Port : " + this.address().port);
});
