
// Function to print the report

function printReport()
{
    window.print();
}


// Function to show total bookings

function showTotal()
{
    var total = 19;

    alert("Total Bookings: " + total);
}


// Function to calculate booking percentage

function calculatePercentage()
{
    var total = 19;

    var approved = 7;
    var pending = 4;
    var rejected = 2;
    var completed = 5;
    var cancelled = 1;

    var approvedPercent = (approved / total) * 100;
    var pendingPercent = (pending / total) * 100;
    var rejectedPercent = (rejected / total) * 100;
    var completedPercent = (completed / total) * 100;
    var cancelledPercent = (cancelled / total) * 100;

    alert(
        "Booking Status Percentage\n\n" +
        "Approved: " + approvedPercent.toFixed(2) + "%\n" +
        "Pending: " + pendingPercent.toFixed(2) + "%\n" +
        "Rejected: " + rejectedPercent.toFixed(2) + "%\n" +
        "Completed: " + completedPercent.toFixed(2) + "%\n" +
        "Cancelled: " + cancelledPercent.toFixed(2) + "%"
    );
}


// Function to find the most booked course

function mostBookedCourse()
{
    var guitar = 5;
    var piano = 5;
    var violin = 3;
    var drums = 2;
    var vocals = 3;
    var keyboard = 1;

    var highest = guitar;

    if(piano > highest)
    {
        highest = piano;
    }

    if(violin > highest)
    {
        highest = violin;
    }

    if(drums > highest)
    {
        highest = drums;
    }

    if(vocals > highest)
    {
        highest = vocals;
    }

    if(keyboard > highest)
    {
        highest = keyboard;
    }

    alert("Maximum Bookings: " + highest + "\nMost Booked Courses: Guitar and Piano");
}
