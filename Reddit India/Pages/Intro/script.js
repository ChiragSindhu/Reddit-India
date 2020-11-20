document.addEventListener('DOMContentLoaded', async function () { 
    const User = document.getElementById('userComp');
    if (User.innerText.length === 0) {
        var User_Details = document.cookie;
        if (User_Details.length === 0) {
            alert("Please Log in First");
            window.location.href = "../Login/login.html";
        } else { 
            User_Details = User_Details.split(';');
            var ID = "";
            var Fname = "";
            var Lname = "";
            for (let i = 0; i < User_Details.length; i++) {
                var key = User_Details[i].split('=');
                if (key[0].trim() === 'userid') { 
                    ID = key[1];
                }
                if (key[0].trim() === 'userfname') { 
                    Fname = key[1];
                }
                if (key[0].trim() === 'userlname') { 
                    Lname = key[1];
                }
            }        
            User.innerText ="Welcome " + ID + " : " + Fname + " " + Lname;
        }
    }

    const element = document.getElementById('ques');

    const response = await fetch("/question");
    const DataJSON = await response.json();
    const data = DataJSON.data;

    element.innerHTML = await createHTML(data);
});

async function createHTML(data) { 
    var htmlQuery = "";
    var length = data.length;

    if (length > 0) {
        for (let i = 0; i < length; i++) {
            const ID = data[i].Id;
            const question = data[i].Question;
            const Likes = data[i].Likes || 0;

            var sameHTML = "";
            sameHTML += "<div id = \"question_txt\">"
            sameHTML += "ID:" + ID;
            sameHTML += " " + question;
            sameHTML += "<a href = \"View Question/viewQuestion.html\">(Answer)</a>";
            sameHTML += "<div id = \"likescomp\">Likes "
            sameHTML += Likes;
            sameHTML += "</div>"
            sameHTML += "</div>";
            
            if ((i + 1) === length) {
                htmlQuery += "<div class = \"questionsBanklast\" onclick = \"getClick("+ID+")\">";
                htmlQuery += sameHTML;
                htmlQuery += "</div>";
            } else { 
                htmlQuery += "<div class = \"questionsBank\" onclick = \"getClick("+ID+")\">";
                htmlQuery += sameHTML;
                htmlQuery += "</div>";
            }
        }
    } else { 
        htmlQuery += "<div class = \"noQuestion\">";
        htmlQuery += "No Question Uploded Yet.";
        htmlQuery += "</div>";
    }
    
    return htmlQuery;
}

async function keyPressed() {
    const selectedValue = await document.getElementById('id_txt_type').value;
    const search = await document.getElementById('search_txt').value;

    if (search.length === 0) {   
        const element = document.getElementById('ques');

        const response = await fetch("http://localhost:3001/question");
        const DataJSON = await response.json();
        const data = DataJSON.data;

        element.innerHTML = await createHTML(data);
    } else {
        const RequestData = {
            s: search,
            sv: selectedValue
        };
        
        const response = await fetch('http://localhost:3001/search', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(RequestData)
        });
        const DATAJson = await response.json();
        const data = await DATAJson.data;
    
        const element = document.getElementById('ques');
        element.innerHTML = await createHTML(data);
    }
}

async function getClick(event) { 
    await addCookies(event);
    window.location.href = "View Question/viewQuestion.html";
}

async function addCookies(event) { 
    document.cookie = "Question_Id=" + event + ";Max-Age=2678400;";
}
