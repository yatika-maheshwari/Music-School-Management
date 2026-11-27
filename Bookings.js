
// Set minimum date to today

var today = new Date();

var year = today.getFullYear();
var month = today.getMonth() + 1;
var day = today.getDate();

if(month < 10)
{
    month = "0" + month;
}

if(day < 10)
{
    day = "0" + day;
}

var todayDate = year + "-" + month + "-" + day;

document.getElementById("bookDate").min = todayDate;


// Function to book a new class

document.getElementById("bookBtn").onclick = function()
{
    var student = document.getElementById("bookStudent").value;
    var course = document.getElementById("bookCourse").value;
    var date = document.getElementById("bookDate").value;
    var time = document.getElementById("bookTime").value;
    var notes = document.getElementById("bookNotes").value;

    var message = document.getElementById("bookMessage");

    if(student == "" || course == "" || date == "" || time == "")
    {
        message.innerHTML = "Please fill all required fields!";
        message.style.color = "red";
    }

    else if(date < todayDate)
    {
        message.innerHTML = "Please select a future date!";
        message.style.color = "red";
    }

    else
    {
        var table = document.getElementById("bookingBody");

        var row = table.insertRow();

        var count = table.rows.length;

        // Change date format

        var newDate = date.split("-");

        var finalDate = newDate[2] + "-" + newDate[1] + "-" + newDate[0];

        // Get selected time text

        var timeList = document.getElementById("bookTime");

        var finalTime = timeList.options[timeList.selectedIndex].text;

        // Add booking details to table

        row.insertCell(0).innerHTML = count;
        row.insertCell(1).innerHTML = student;
        row.insertCell(2).innerHTML = course;
        row.insertCell(3).innerHTML = finalDate;
        row.insertCell(4).innerHTML = finalTime;
        row.insertCell(5).innerHTML = notes == "" ? "-" : notes;
        row.insertCell(6).innerHTML = "<span class='pending'>Pending</span>";

        row.insertCell(7).innerHTML =
        "<button type='button'>Approve</button> " +
        "<button type='button'>Reject</button> " +
        "<button type='button'>Completed</button> " +
        "<button type='button'>Cancel</button>";

        // Add button functions to new row

        addButtonFunctions(row);

        message.innerHTML = "Your class has been booked successfully!";
        message.style.color = "green";

        // Clear form

        document.getElementById("bookStudent").value = "";
        document.getElementById("bookCourse").value = "";
        document.getElementById("bookDate").value = "";
        document.getElementById("bookTime").value = "";
        document.getElementById("bookNotes").value = "";
    }
};


// Function to change booking status

function changeStatus(button, newStatus, className)
{
    var row = button.parentElement.parentElement;

    var oldStatus = row.cells[6].innerText;

    if(newStatus == "Approved")
    {
        if(oldStatus != "Pending")
        {
            alert("Only pending bookings can be approved!");
            return;
        }
    }

    else if(newStatus == "Rejected")
    {
        if(oldStatus != "Pending")
        {
            alert("Only pending bookings can be rejected!");
            return;
        }
    }

    else if(newStatus == "Completed")
    {
        if(oldStatus != "Approved")
        {
            alert("Only approved bookings can be completed!");
            return;
        }
    }

    else if(newStatus == "Cancelled")
    {
        if(oldStatus != "Pending" && oldStatus != "Approved")
        {
            alert("This booking cannot be cancelled!");
            return;
        }
    }

    row.cells[6].innerHTML = "<span class='" + className + "'>" + newStatus + "</span>";

    alert("Booking status changed to " + newStatus + "!");
}


// Function to approve booking

function approveBooking(button)
{
    changeStatus(button, "Approved", "approved");
}


// Function to reject booking

function rejectBooking(button)
{
    changeStatus(button, "Rejected", "rejected");
}


// Function to complete booking

function completeBooking(button)
{
    changeStatus(button, "Completed", "completed");
}


// Function to cancel booking

function cancelBooking(button)
{
    changeStatus(button, "Cancelled", "cancelled");
}


// Function to add actions to table buttons

function addButtonFunctions(row)
{
    var buttons = row.getElementsByTagName("button");

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


// Add functions to existing booking buttons

var table = document.getElementById("bookingBody");

for(var i = 0; i < table.rows.length; i++)
{
    addButtonFunctions(table.rows[i]);
}


// Function to search and filter bookings

document.getElementById("filterBtn").onclick = function()
{
    var search = document.getElementById("bookSearch").value.toLowerCase();

    var status = document.getElementById("statusFilter").value;

    var table = document.getElementById("bookingBody");

    for(var i = 0; i < table.rows.length; i++)
    {
        var course = table.rows[i].cells[2].innerText.toLowerCase();

        var bookingStatus = table.rows[i].cells[6].innerText;

        if(course.indexOf(search) != -1 &&
           (status == "all" || bookingStatus == status))
        {
            table.rows[i].style.display = "";
        }

        else
        {
            table.rows[i].style.display = "none";
        }
    }
};


// Function to reset search and filters

document.getElementById("resetBtn").onclick = function()
{
    document.getElementById("bookSearch").value = "";

    document.getElementById("statusFilter").value = "all";

    var table = document.getElementById("bookingBody");

    for(var i = 0; i < table.rows.length; i++)
    {
        table.rows[i].style.display = "";
    }
};
