async function register() { 
    const User_Fname_check = document.getElementById("User_firstname").value;
    const User_Lname_check = document.getElementById("User_lastname").value;
    const User_email_check = document.getElementById("User_email").value;
    const User_password_check = document.getElementById("User_password").value;
    const User_Cpassword_check = document.getElementById("User_confirm_password").value;

    if (!User_Fname_check || !User_Lname_check || !User_email_check || !User_password_check || !User_Cpassword_check) { 
        alert("Please Fill all Details");
        return;
    }

    if (User_password_check === User_Cpassword_check) {
        url = "/register";
        datatosend = {
            FirstName: User_Fname_check,
            LastName: User_Lname_check,
            Email : User_email_check,
            Password : User_password_check,
        };

        const dataFromServer = await FetchDataFromServer(url, datatosend);

        if (!dataFromServer) {
           alert("Account Created!!!\nEmail Sent to " + User_email_check + "\n                    Check Your Email");
        } else {  
            alert("Error From Database : " + dataFromServer);
        }

    } else { 
        alert("Password Does't Matched with Confirm Password");
    }
}

async function FetchDataFromServer(url, data) {
    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(data)
    });

    if (response.ok) {
        console.log("Fetched Data Successfully");

        const DataFile = await response.json().catch(function (err) { 
            console.log("Error while Converting data to JSON.");
        });

        return DataFile.data.sqlMessage;

    } else { 
        console.log("Error in Fetching");
        return null;
    }
}