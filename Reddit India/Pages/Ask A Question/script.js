async function addQuestion() { 
    const question = document.getElementById('txt_area').value;
    const description = document.getElementById('txt_area_desc').value;
    var ID = document.cookie;
    ID = ID.split(';');
    ID = ID[0].split('=');
    ID = ID[1];

    if (!question) {
        console.log("Question Needed!!!");
        alert("Question Needed!");
    } else { 
        await addQuestionToDB(question,description,ID); 
    }
}

async function addQuestionToDB(q,d,ID) { 
    try {
        data = {
            quests: q,
            desc: d,
            id:ID
        };

        const response =  await fetch('/addQuestion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const DATAJSON = await response.json();
        var ID = await DATAJSON.data[0].ID;

        alert("Your Question is Asked!!! with ID :  " + ID);
        window.location.href = "../Intro/Intro.html";
    } catch (e) { 
        console.log("Error :-> " + e);
    }
} 