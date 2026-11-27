
// Function to book a new class

document.getElementById("bookBtn").onclick = function()
{
    var course = document.getElementById("bookCourse").value;
    var date = document.getElementById("bookDate").value;
    var time = document.getElementById("bookTime").value;
    var notes = document.getElementById("bookNotes").value;

    var message = document.getElementById("bookMessage");

    if(course == "" || date == "" || time == "")
    {
        message.innerHTML = "Please fill all required fields!";
        message.style.color = "red";
    }

    else
    {
        var table = document.getElementById("bookingBody");

        var row = table.insertRow();

        var count = table.rows.length;

        var student = "Aarav Singh";

        row.insertCell(0).innerHTML = count;
        row.insertCell(1).innerHTML = student;
        row.insertCell(2).innerHTML = course;
        row.insertCell(3).innerHTML = date;
        row.insertCell(4).innerHTML = time;
        row.insertCell(5).innerHTML = "<span class='pending'>Pending</span>";

        row.insertCell(6).innerHTML =
        "<button type='button' onclick='approveBooking(this)'>Approve</button> " +
        "<button type='button' onclick='rejectBooking(this)'>Reject</button> " +
        "<button type='button' onclick='completeBooking(this)'>Completed</button> " +
        "<button type='button' onclick='cancelBooking(this)'>Cancel</button>";

        message.innerHTML = "Your class has been booked successfully!";
        message.style.color = "green";

        document.getElementById("bookCourse").value = "";
        document.getElementById("bookDate").value = "";
        document.getElementById("bookTime").value = "";
        document.getElementById("bookNotes").value = "";
    }
};


// Function to approve booking

function approveBooking(button)
{
    var row = button.parentElement.parentElement;

    row.cells[5].innerHTML = "<span class='approved'>Approved</span>";

    alert("Booking Approved!");
}


// Function to reject booking

function rejectBooking(button)
{
    var row = button.parentElement.parentElement;

    row.cells[5].innerHTML = "<span class='rejected'>Rejected</span>";

    alert("Booking Rejected!");
}


// Function to complete booking

function completeBooking(button)
{
    var row = button.parentElement.parentElement;

    row.cells[5].innerHTML = "<span class='completed'>Completed</span>";

    alert("Class Completed!");
}


// Function to cancel booking

function cancelBooking(button)
{
    var row = button.parentElement.parentElement;

    row.cells[5].innerHTML = "<span class='cancelled'>Cancelled</span>";

    alert("Booking Cancelled!");
}


// Function to search and filter bookings

document.getElementById("filterBtn").onclick = function()
{
    var search = document.getElementById("bookSearch").value.toLowerCase();

    var status = document.getElementById("statusFilter").value.toLowerCase();

    var table = document.getElementById("bookingBody");

    for(var i = 0; i < table.rows.length; i++)
    {
        var course = table.rows[i].cells[2].innerHTML.toLowerCase();

        var bookingStatus = table.rows[i].cells[5].innerText.toLowerCase();

        if(course.includes(search) && (status == "all" || bookingStatus == status))
        {
            table.rows[i].style.display = "";
        }

        else
        {
            table.rows[i].style.display = "none";
        }
    }
};


// Add functions to existing buttons

var table = document.getElementById("bookingBody");

for(var i = 0; i < table.rows.length; i++)
{
    var buttons = table.rows[i].getElementsByTagName("button");

    buttons[0].onclick = function()
    {
        approveBooking(this);
    };

    buttons[1].onclick = function()
    {
        rejectBooking(this);
    };

    buttons[2].onclick = function()
    {
        completeBooking(this);
    };

    buttons[3].onclick = function()
    {
        cancelBooking(this);
    };
}
