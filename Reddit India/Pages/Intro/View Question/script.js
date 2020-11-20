document.addEventListener('DOMContentLoaded', async function () {
    var Question_ID = document.cookie;

    Question_ID = Question_ID.split(';');
    var x = -1;
    for (let i = 0; i < Question_ID.length; i++) {
        var Key = Question_ID[i].split('=');
        if (Key[0] === "Question_Id") { 
            Question_ID = Key[1];
            x = 0;
            break;
        }
    }

    if(x === -1) {
        console.log("No ID here");
        alert("Network Error Occured!!\nI think Your Network may take more than 2678400s to load.");
        location.href = "../Intro.html";
        return;
    }

    const data = {
        id : Question_ID
    };

    var response = await fetch("/viewQuestion", {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(data)
    });

    if (response.ok) {
        console.log("Fetched Question from Database through Server.");
    } else { 
        console.log("Error At Fetching");
        return;
    }

    response = await response.json();
    const result = response.data[0];

    await createHTMLPage(result);
});

async function createHTMLPage(data) { 
    const special_Key_word = "###@@@###"; 

    const Ques_Id = data.Id;
    const Ques = data.Question;
    const Desc = data.Description;
    const Likes = data.Likes;
    const Sender_Id = data.Sender_ID;


    const questElement = document.getElementById('ques');
    const descElement = document.getElementById('desc');
    const ansElement = document.getElementById('answer');

    if (data.Answer) {
        const answer_Array = data.Answer;
        var answer = answer_Array;
        answer = answer.split(special_Key_word);
        
        
        var answerHTMLcode = "";
        for (let i = 0; i < answer.length; i++) {
            if (answer.length === (i + 1)) {
                answerHTMLcode += "<div class = \"answerlast\"><h2>Answer " + (i + 1) + "</h2><hr><br>";
                answerHTMLcode += answer[i];
                answerHTMLcode += "</div>";
            } else {
                answerHTMLcode += "<div class = \"answer\"><h2>Answer " + (i + 1) + "</h2><hr><br>";
                answerHTMLcode += answer[i];
                answerHTMLcode += "</div>";
            }
        }

        ansElement.innerHTML = answerHTMLcode;
    } else { 
        ansElement.innerHTML = "No Answer Yet. Be the First to Answer";
    }
    
    questElement.innerHTML = Ques_Id + " : " + Ques;
    descElement.innerHTML = Desc;
}

async function sendAnswer() { 
    const answer = document.getElementById('ans_txt_area').value;

    var Question_ID = document.cookie;
    Question_ID = Question_ID.split(';');
    for (let i = 0; i < Question_ID.length; i++) {
        var Key = Question_ID[i].split('=');
        if (Key[0] === "Question_Id") { 
            Question_ID = Key[1];
            break;
        }
    }

    const data = {
        ans: answer,
        id : Question_ID
    };

    await fetch('/addAnswer', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(data)
    });

    location.reload();
}
