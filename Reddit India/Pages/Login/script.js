async function login() {
    //-----------Getting the values in Input in Login.html-----------//
    const User_email_check = document.getElementById("User_email").value;
    const User_password_check = document.getElementById("User_password").value;
//------------------------------------------------------------------------//
    
    
    //---Checking if both of them are null or not ----------------//
    if (!User_email_check || !User_password_check) { 
        alert("Please Fill All TextFields");
        return;
    }
// if null then return with console.log--------------------------------------------//
    
    
    //-----URL for fetching page from backend API ---------//
    var url = "http://localhost:3001/login";

    //Email varible to pass in backend API ------/////
    const variables = {
        email : User_email_check 
    };

    // ---- Function that will extract data from mysql database
    //------ data will have only UserPassword stored in database
    //----if UserPassword is equal to check password then Redirecting 
    const data = await getDataFromServer(url,variables);

    if (!data) {
        console.log("May Be Solution : \n\tI think There is error in url.");
    } else {
        if (data.data[0] && data.data[0].User_Password === User_password_check) { 
            await Cookies(data.data[0].User_Id, data.data[0].User_Fname, data.data[0].User_Lname);
            
            alert("Password Matched Successfully! You Will be auto logged in Reddit India For next full Month");
            window.location.href = "../Intro/Intro.html";
        } else {
            alert("Password or E-mail Does't Matched!");
        }
    }
}

async function Cookies(id,fname,lname) { 
    await createCookies(id,fname,lname);
    console.log("after " + document.cookie);
}

async function createCookies(Id,Fname,Lname) { 
    console.log("Created UserID");

    var d = new Date();
    //Month is of 31days
    d.setTime(d.getTime() + (31 * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    
    document.cookie = "userid = " + Id + "; " + expires + "; path=/";
    document.cookie = "userfname = " + Fname + "; " + expires + "; path=/";
    document.cookie = "userlname = " + Lname + "; " + expires + "; path=/";
}

async function getDataFromServer(url,data) {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        console.log("Fetched Data from server Correctly");

        const dataJSON = await response.json().catch(function (err) {
            console.log(err);
        });

        return dataJSON;
    }
    else {
        console.log("Error while Fetching Data from server");
        return null;
    }
}