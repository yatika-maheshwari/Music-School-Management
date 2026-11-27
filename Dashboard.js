
// Welcome message
document.getElementById("dashWelcome").innerHTML = "Welcome, Aarav";

// Display current date
var today = new Date();
document.getElementById("dashDate").innerHTML = today.toDateString();


// Function to show dashboard according to user role
function showDashboard(role)
{
    if(role == "Student")
    {
        document.getElementById("studentView").style.display = "block";
        document.getElementById("teacherView").style.display = "none";
        document.getElementById("adminView").style.display = "none";

        document.getElementById("dashRole").innerHTML = "You are logged in as: Student";
    }

    else if(role == "Teacher")
    {
        document.getElementById("studentView").style.display = "none";
        document.getElementById("teacherView").style.display = "block";
        document.getElementById("adminView").style.display = "none";

        document.getElementById("dashRole").innerHTML = "You are logged in as: Teacher";
    }

    else if(role == "Admin")
    {
        document.getElementById("studentView").style.display = "none";
        document.getElementById("teacherView").style.display = "none";
        document.getElementById("adminView").style.display = "block";

        document.getElementById("dashRole").innerHTML = "You are logged in as: Admin";
    }
}


// Show student dashboard by default
showDashboard("Student");


// Function to approve or reject booking requests
function changeStatus(button)
{
    var row = button.parentElement.parentElement;

    if(button.innerHTML == "Approve")
    {
        alert("Booking Approved!");
        row.cells[5].innerHTML = "Approved";
    }

    else if(button.innerHTML == "Reject")
    {
        alert("Booking Rejected!");
        row.cells[5].innerHTML = "Rejected";
    }
}
