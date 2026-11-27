// Serenova: one script for Courses, Teachers, Students, Bookings,
// Dashboard, Reports and Schedule pages.
// (Home, Register and Login are handled by script.js)
//
// Every page that uses this file just needs:  <script src="app.js"></script>
// The script checks which page it is on by looking for an element that
// only that page has, so the right code runs on the right page.

// ===================================================================
// HELPERS
// ===================================================================

// Who is logged in? (null if nobody) - same storage as script.js
const currentUser = JSON.parse(localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser") || "null");

// Get saved data from localStorage. If nothing is saved yet, save the defaults.
function loadData(key, defaults) {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
    localStorage.setItem(key, JSON.stringify(defaults));
    return defaults;
}

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Makes typed text safe to put inside HTML
function esc(text) {
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

// Show a message in a <p id="..."> on the page
function showMsg(id, text, color) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = text;
    el.style.color = color;
}

// "05-11-2026" -> Date object
function parseDate(text) {
    const [d, m, y] = text.split("-").map(Number);
    return new Date(y, m - 1, d);
}

// "2026-11-05" (from <input type="date">) -> "05-11-2026"
function formatDate(iso) {
    const [y, m, d] = iso.split("-");
    return `${d}-${m}-${y}`;
}

// "14:00" -> "02:00 PM"
function formatTime(time) {
    let [h, m] = time.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")} ${ampm}`;
}

// Today as "yyyy-mm-dd" (local time)
function todayISO() {
    const t = new Date();
    return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
}

// ===================================================================
// DEFAULT DATA (same as the tables already written in the HTML)
// ===================================================================

const DEFAULT_COURSES = [
    { name: "Guitar Basics", instrument: "Guitar", level: "Beginner", teacher: "Aman Verma", fee: 90000, seats: 10 },
    { name: "Piano Foundations", instrument: "Piano", level: "Beginner", teacher: "Neha Kapoor", fee: 100000, seats: 8 },
    { name: "Violin Melodies", instrument: "Violin", level: "Intermediate", teacher: "Riya Sen", fee: 150000, seats: 6 },
    { name: "Drum Rhythms", instrument: "Drums", level: "Intermediate", teacher: "Karan Mehta", fee: 140000, seats: 8 },
    { name: "Vocal Training", instrument: "Vocals", level: "Advanced", teacher: "Simran Kaur", fee: 200000, seats: 12 }
];

const DEFAULT_TEACHERS = [
    { name: "Aman Verma", instrument: "Guitar", exp: 6, phone: "9876500001", status: "Active" },
    { name: "Neha Kapoor", instrument: "Piano", exp: 8, phone: "9876500002", status: "Active" },
    { name: "Riya Sen", instrument: "Violin", exp: 5, phone: "9876500003", status: "Active" },
    { name: "Karan Mehta", instrument: "Drums", exp: 4, phone: "9876500004", status: "Inactive" },
    { name: "Simran Kaur", instrument: "Vocals", exp: 7, phone: "9876500005", status: "Active" }
];

const DEFAULT_STUDENTS = [
    { name: "Aarav Singh", email: "aarav@example.com", course: "Guitar", status: "Active" },
    { name: "Diya Sharma", email: "diya@example.com", course: "Piano", status: "Active" },
    { name: "Kabir Malhotra", email: "kabir@example.com", course: "Drums", status: "Active" },
    { name: "Isha Gupta", email: "isha@example.com", course: "Violin", status: "Inactive" },
    { name: "Rohan Das", email: "rohan@example.com", course: "Vocals", status: "Active" },
    { name: "Meera Nair", email: "meera@example.com", course: "Piano", status: "Active" },
    { name: "Arjun Rao", email: "arjun@example.com", course: "Guitar", status: "Inactive" }
];

const DEFAULT_BOOKINGS = [
    { id: 1, student: "Aarav Singh", course: "Guitar", date: "05-11-2026", time: "10:00 AM", notes: "-", status: "Pending" },
    { id: 2, student: "Diya Sharma", course: "Piano", date: "06-11-2026", time: "11:00 AM", notes: "-", status: "Approved" },
    { id: 3, student: "Isha Gupta", course: "Violin", date: "07-11-2026", time: "02:00 PM", notes: "-", status: "Rejected" },
    { id: 4, student: "Rohan Das", course: "Vocals", date: "01-11-2026", time: "04:00 PM", notes: "-", status: "Completed" },
    { id: 5, student: "Meera Nair", course: "Piano", date: "08-11-2026", time: "06:00 PM", notes: "-", status: "Cancelled" }
];

// Classes shown on the schedule page
const DEFAULT_CLASSES = [
    { date: "02-11-2026", day: "Monday", time: "10:00 AM", course: "Piano", student: "Meera Nair", teacher: "Neha Kapoor" },
    { date: "03-11-2026", day: "Tuesday", time: "02:00 PM", course: "Guitar", student: "Tanvi Joshi", teacher: "Aman Verma" },
    { date: "04-11-2026", day: "Wednesday", time: "11:00 AM", course: "Piano", student: "Diya Sharma", teacher: "Neha Kapoor" },
    { date: "05-11-2026", day: "Thursday", time: "06:00 PM", course: "Piano", student: "Meera Nair", teacher: "Neha Kapoor" },
    { date: "06-11-2026", day: "Friday", time: "04:00 PM", course: "Guitar", student: "Tanvi Joshi", teacher: "Aman Verma" },
    { date: "07-11-2026", day: "Saturday", time: "10:00 AM", course: "Piano", student: "Diya Sharma", teacher: "Neha Kapoor" }
];

// Which status can change to which (used by Bookings and Dashboard)
const STATUS_RULES = {
    Approved: ["Pending"],
    Rejected: ["Pending"],
    Completed: ["Approved"],
    Cancelled: ["Pending", "Approved"]
};

// Change a booking's status. Returns "" if it worked, or an error message.
function changeStatus(bookings, id, newStatus) {
    const booking = bookings.find((b) => b.id === id);
    if (!booking) return "Booking not found.";

    if (!STATUS_RULES[newStatus].includes(booking.status)) {
        return `A ${booking.status.toLowerCase()} booking cannot be marked ${newStatus.toLowerCase()}.`;
    }

    booking.status = newStatus;
    saveData("bookings", bookings);
    return "";
}

// Stop search forms from reloading the page when Enter is pressed
document.querySelectorAll("main form").forEach((form) => {
    form.addEventListener("submit", (event) => event.preventDefault());
});

// ===================================================================
// COMMON: account button in the nav bar (same idea as script.js)
// ===================================================================

if (currentUser) {
    const nav = document.querySelector("nav");
    const loginLink = nav.querySelector('a[href="login.html"]');
    if (loginLink) loginLink.style.display = "none"; // hide Login

    const button = document.createElement("button");
    button.className = "account-btn";
    button.textContent = `👤 ${currentUser.name} (${currentUser.role})`;

    const box = document.createElement("div");
    box.className = "account-box";
    box.hidden = true;

    const details = document.createElement("p");
    details.textContent = currentUser.email || "";

    const logout = document.createElement("button");
    logout.textContent = "Logout";

    box.append(details, logout);
    nav.append(button, box);

    button.addEventListener("click", () => {
        box.hidden = !box.hidden;
    });

    logout.addEventListener("click", () => {
        localStorage.removeItem("currentUser");
        sessionStorage.removeItem("currentUser");
        location.href = "login.html";
    });
}

// ===================================================================
// COURSES PAGE
// ===================================================================

if (document.getElementById("courseBody")) {
    const courses = loadData("courses", DEFAULT_COURSES);
    const body = document.getElementById("courseBody");

    // Draw the table (only the courses that match the search and filters)
    const showCourses = () => {
        const text = document.getElementById("courseSearch").value.trim().toLowerCase();
        const level = document.getElementById("levelFilter").value;
        const instrument = document.getElementById("instrumentFilter").value;

        let rows = "";
        let shown = 0;

        courses.forEach((c, i) => {
            if (text && !c.name.toLowerCase().includes(text)) return;
            if (level && c.level !== level) return;
            if (instrument && c.instrument !== instrument) return;

            shown++;
            rows += `
                <tr class="${shown % 2 === 0 ? "row2" : ""}">
                    <td>${shown}</td>
                    <td>${esc(c.name)}</td>
                    <td>${esc(c.instrument)}</td>
                    <td>${esc(c.level)}</td>
                    <td>${esc(c.teacher)}</td>
                    <td>Rs. ${c.fee}</td>
                    <td>${c.seats}</td>
                    <td>
                        <button type="button" class="edit-btn" data-index="${i}">Edit</button>
                        <button type="button" class="delete-btn" data-index="${i}">Delete</button>
                    </td>
                </tr>`;
        });

        body.innerHTML = rows || `<tr><td colspan="8">No course found. Try another search.</td></tr>`;
    };

    showCourses();

    // Search and filters
    document.getElementById("searchBtn").addEventListener("click", showCourses);
    document.getElementById("courseSearch").addEventListener("input", showCourses);
    document.getElementById("levelFilter").addEventListener("change", showCourses);
    document.getElementById("instrumentFilter").addEventListener("change", showCourses);

    // Edit and Delete buttons (one listener for the whole table)
    body.addEventListener("click", (event) => {
        const btn = event.target.closest("button");
        if (!btn) return;
        const index = Number(btn.dataset.index);
        const course = courses[index];

        if (btn.classList.contains("delete-btn")) {
            if (confirm(`Delete the course "${course.name}"?`)) {
                courses.splice(index, 1);
                saveData("courses", courses);
                showCourses();
                showMsg("courseMessage", "Course deleted.", "#4b2e83");
            }
        }

        if (btn.classList.contains("edit-btn")) {
            const name = prompt("Course name:", course.name);
            if (name === null) return; // Cancel pressed
            const fee = prompt("Fee (Rs.):", course.fee);
            if (fee === null) return;
            const seats = prompt("Seats:", course.seats);
            if (seats === null) return;

            if (name.trim().length < 3 || !(Number(fee) > 0) || !(Number(seats) >= 1)) {
                return showMsg("courseMessage", "Edit failed: enter a valid name, fee and seats.", "red");
            }

            course.name = name.trim();
            course.fee = Number(fee);
            course.seats = Math.floor(Number(seats));
            saveData("courses", courses);
            showCourses();
            showMsg("courseMessage", "Course updated.", "green");
        }
    });

    // Add a new course
    document.getElementById("addCourseBtn").addEventListener("click", () => {
        const name = document.getElementById("courseName").value.trim();
        const instrument = document.getElementById("courseInstrument").value;
        const level = document.getElementById("courseLevel").value;
        const teacher = document.getElementById("courseTeacher").value;
        const fee = Number(document.getElementById("courseFee").value);
        const seats = Number(document.getElementById("courseSeats").value);

        if (name.length < 3) {
            return showMsg("courseMessage", "Course name needs at least 3 characters.", "red");
        }
        if (courses.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
            return showMsg("courseMessage", "This course already exists.", "red");
        }
        if (!(fee > 0)) {
            return showMsg("courseMessage", "Enter a fee greater than 0.", "red");
        }
        if (!Number.isInteger(seats) || seats < 1) {
            return showMsg("courseMessage", "Seats must be a whole number, 1 or more.", "red");
        }

        courses.push({ name, instrument, level, teacher, fee, seats });
        saveData("courses", courses);

        // Clear the form and the search so the new course is visible
        document.getElementById("courseName").value = "";
        document.getElementById("courseFee").value = "";
        document.getElementById("courseSeats").value = "";
        document.getElementById("courseSearch").value = "";
        document.getElementById("levelFilter").value = "";
        document.getElementById("instrumentFilter").value = "";

        showCourses();
        showMsg("courseMessage", `"${name}" was added.`, "green");
    });
}

// ===================================================================
// TEACHERS PAGE
// ===================================================================

if (document.getElementById("teacherBody")) {
    const teachers = loadData("teachers", DEFAULT_TEACHERS);
    const body = document.getElementById("teacherBody");

    const showTeachers = () => {
        const text = document.getElementById("teacherSearch").value.trim().toLowerCase();
        const instrument = document.getElementById("instrumentFilter").value;
        const status = document.getElementById("status").value;

        let rows = "";
        let shown = 0;

        teachers.forEach((t) => {
            if (text && !t.name.toLowerCase().includes(text)) return;
            if (instrument && t.instrument !== instrument) return;
            if (status && t.status !== status) return;

            shown++;
            rows += `
                <tr class="${shown % 2 === 0 ? "row2" : ""}">
                    <td>${shown}</td>
                    <td>${esc(t.name)}</td>
                    <td>${esc(t.instrument)}</td>
                    <td>${t.exp} years</td>
                    <td>${esc(t.phone)}</td>
                    <td>${esc(t.status)}</td>
                </tr>`;
        });

        body.innerHTML = rows || `<tr><td colspan="6">No teacher found. Try another search.</td></tr>`;
    };

    showTeachers();

    document.getElementById("searchBtn").addEventListener("click", showTeachers);
    document.getElementById("teacherSearch").addEventListener("input", showTeachers);
    document.getElementById("instrumentFilter").addEventListener("change", showTeachers);
    document.getElementById("status").addEventListener("change", showTeachers);

    // Add a new teacher
    document.getElementById("addTeacherForm").addEventListener("submit", () => {
        const name = document.getElementById("teacherName").value.trim();
        const instrument = document.getElementById("teacherInstrument").value;
        const expText = document.getElementById("teacherExp").value;
        const phone = document.getElementById("teacherPhone").value.trim();
        const status = document.getElementById("teacherStatus").value;

        if (!/^[A-Za-z ]{3,}$/.test(name)) {
            return showMsg("teacherMessage", "Name needs at least 3 letters (letters and spaces only).", "red");
        }
        if (teachers.some((t) => t.name.toLowerCase() === name.toLowerCase())) {
            return showMsg("teacherMessage", "This teacher already exists.", "red");
        }
        const exp = expText === "" ? 0 : Number(expText);
        if (!Number.isInteger(exp) || exp < 0) {
            return showMsg("teacherMessage", "Experience must be a whole number, 0 or more.", "red");
        }
        if (!/^\d{10}$/.test(phone)) {
            return showMsg("teacherMessage", "Phone number must be exactly 10 digits.", "red");
        }

        teachers.push({ name, instrument, exp, phone, status });
        saveData("teachers", teachers);

        document.getElementById("addTeacherForm").reset();
        document.getElementById("teacherSearch").value = "";
        document.getElementById("instrumentFilter").value = "";
        document.getElementById("status").value = "";

        showTeachers();
        showMsg("teacherMessage", `${name} was added.`, "green");
    });
}

// ===================================================================
// STUDENTS PAGE
// ===================================================================

if (document.getElementById("studentBody")) {
    const students = loadData("students", DEFAULT_STUDENTS);
    const body = document.getElementById("studentBody");

    const showStudents = () => {
        const text = document.getElementById("studentSearch").value.trim().toLowerCase();
        const course = document.getElementById("studentCourseFilter").value;
        const status = document.getElementById("studentStatusFilter").value;

        let rows = "";
        let shown = 0;

        students.forEach((s, i) => {
            if (text && !(s.name.toLowerCase().includes(text) || s.email.toLowerCase().includes(text))) return;
            if (course && s.course !== course) return;
            if (status && s.status !== status) return;

            shown++;
            const badge = s.status === "Active" ? "student-active" : "student-inactive";
            rows += `
                <tr class="${shown % 2 === 0 ? "row2" : ""}">
                    <td>${shown}</td>
                    <td>${esc(s.name)}</td>
                    <td>${esc(s.email)}</td>
                    <td>${esc(s.course)}</td>
                    <td><span class="${badge}">${esc(s.status)}</span></td>
                    <td>
                        <button type="button" class="edit-btn" data-index="${i}">Edit</button>
                        <button type="button" class="delete-btn" data-index="${i}">Delete</button>
                    </td>
                </tr>`;
        });

        body.innerHTML = rows || `<tr><td colspan="6">No student found. Try another search.</td></tr>`;
        document.getElementById("studentCount").textContent = `Total Students: ${students.length}`;
    };

    showStudents();

    document.getElementById("searchBtn").addEventListener("click", showStudents);
    document.getElementById("studentSearch").addEventListener("input", showStudents);
    document.getElementById("studentCourseFilter").addEventListener("change", showStudents);
    document.getElementById("studentStatusFilter").addEventListener("change", showStudents);

    // Edit and Delete
    body.addEventListener("click", (event) => {
        const btn = event.target.closest("button");
        if (!btn) return;
        const index = Number(btn.dataset.index);
        const student = students[index];

        if (btn.classList.contains("delete-btn")) {
            if (confirm(`Delete student "${student.name}"?`)) {
                students.splice(index, 1);
                saveData("students", students);
                showStudents();
                showMsg("studentMessage", "Student deleted.", "#4b2e83");
            }
        }

        if (btn.classList.contains("edit-btn")) {
            const name = prompt("Student name:", student.name);
            if (name === null) return;
            const email = prompt("Email:", student.email);
            if (email === null) return;
            const course = prompt("Course (Guitar, Piano, Violin, Drums, Vocals):", student.course);
            if (course === null) return;
            const status = prompt("Status (Active or Inactive):", student.status);
            if (status === null) return;

            const courseOk = ["Guitar", "Piano", "Violin", "Drums", "Vocals"].includes(course.trim());
            const statusOk = ["Active", "Inactive"].includes(status.trim());

            if (!/^[A-Za-z ]{3,}$/.test(name.trim()) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || !courseOk || !statusOk) {
                return showMsg("studentMessage", "Edit failed: check the name, email, course and status.", "red");
            }

            student.name = name.trim();
            student.email = email.trim().toLowerCase();
            student.course = course.trim();
            student.status = status.trim();
            saveData("students", students);
            showStudents();
            showMsg("studentMessage", "Student updated.", "green");
        }
    });

    // Add a new student
    document.getElementById("addStudentForm").addEventListener("submit", () => {
        const name = document.getElementById("studentName").value.trim();
        const email = document.getElementById("studentEmail").value.trim().toLowerCase();
        const course = document.getElementById("studentCourse").value;
        const status = document.getElementById("studentStatus").value;

        if (!/^[A-Za-z ]{3,}$/.test(name)) {
            return showMsg("studentMessage", "Name needs at least 3 letters (letters and spaces only).", "red");
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return showMsg("studentMessage", "Enter a valid email address.", "red");
        }
        if (students.some((s) => s.email === email)) {
            return showMsg("studentMessage", "This email is already added.", "red");
        }

        students.push({ name, email, course, status });
        saveData("students", students);

        document.getElementById("addStudentForm").reset();
        document.getElementById("studentSearch").value = "";
        document.getElementById("studentCourseFilter").value = "";
        document.getElementById("studentStatusFilter").value = "";

        showStudents();
        showMsg("studentMessage", `${name} was added.`, "green");
    });
}

// ===================================================================
// BOOKINGS PAGE
// ===================================================================

if (document.getElementById("bookingBody")) {
    const bookings = loadData("bookings", DEFAULT_BOOKINGS);
    const body = document.getElementById("bookingBody");

    // Students can only cancel. Teachers, admins (and visitors) can do everything.
    const isStudent = currentUser && currentUser.role === "student";

    // Fill the student dropdown from the Students page data
    const students = loadData("students", DEFAULT_STUDENTS);
    const studentSelect = document.getElementById("bookStudent");
    studentSelect.innerHTML = `<option value="">Select a student</option>` +
        students.map((s) => `<option value="${esc(s.name)}">${esc(s.name)}</option>`).join("");

    // Cannot book a date in the past
    document.getElementById("bookDate").min = todayISO();

    const buttonLabels = { Approved: "Approve", Rejected: "Reject", Completed: "Completed", Cancelled: "Cancel" };

    const showBookings = () => {
        const text = document.getElementById("bookSearch").value.trim().toLowerCase();
        const status = document.getElementById("statusFilter").value;

        const actions = isStudent ? ["Cancelled"] : ["Approved", "Rejected", "Completed", "Cancelled"];

        let rows = "";
        bookings.forEach((b) => {
            if (text && !b.course.toLowerCase().includes(text)) return;
            if (status !== "all" && b.status !== status) return;

            const buttons = actions
                .map((a) => `<button type="button" data-id="${b.id}" data-status="${a}">${buttonLabels[a]}</button>`)
                .join("");

            rows += `
                <tr>
                    <td>${b.id}</td>
                    <td>${esc(b.student)}</td>
                    <td>${esc(b.course)}</td>
                    <td>${esc(b.date)}</td>
                    <td>${esc(b.time)}</td>
                    <td>${esc(b.notes)}</td>
                    <td><span class="${b.status.toLowerCase()}">${b.status}</span></td>
                    <td>${buttons}</td>
                </tr>`;
        });

        body.innerHTML = rows || `<tr><td colspan="8">No bookings found.</td></tr>`;
    };

    showBookings();

    // Search / filter / reset
    document.getElementById("filterBtn").addEventListener("click", showBookings);
    document.getElementById("bookSearch").addEventListener("input", showBookings);
    document.getElementById("statusFilter").addEventListener("change", showBookings);
    document.getElementById("resetBtn").addEventListener("click", () => {
        document.getElementById("bookSearch").value = "";
        document.getElementById("statusFilter").value = "all";
        showBookings();
    });

    // Action buttons (Approve / Reject / Completed / Cancel)
    body.addEventListener("click", (event) => {
        const btn = event.target.closest("button");
        if (!btn) return;

        const id = Number(btn.dataset.id);
        const newStatus = btn.dataset.status;
        const booking = bookings.find((b) => b.id === id);

        if (isStudent && booking.student.toLowerCase() !== currentUser.name.toLowerCase()) {
            return showMsg("bookMessage", "You can only cancel your own bookings.", "red");
        }

        const error = changeStatus(bookings, id, newStatus);
        if (error) return showMsg("bookMessage", error, "red");

        showBookings();
        showMsg("bookMessage", `Booking #${id} is now ${newStatus.toLowerCase()}.`, "green");
    });

    // Book a class
    document.getElementById("bookBtn").addEventListener("click", () => {
        const student = document.getElementById("bookStudent").value;
        const course = document.getElementById("bookCourse").value;
        const dateValue = document.getElementById("bookDate").value;
        const timeValue = document.getElementById("bookTime").value;
        const notes = document.getElementById("bookNotes").value.trim();

        if (!student || !course || !dateValue || !timeValue) {
            return showMsg("bookMessage", "Please choose a student, course, date and time.", "red");
        }
        if (dateValue < todayISO()) {
            return showMsg("bookMessage", "You cannot book a date in the past.", "red");
        }

        const date = formatDate(dateValue);
        const time = formatTime(timeValue);

        // Same course, date and time already taken?
        const taken = bookings.some((b) =>
            b.course === course && b.date === date && b.time === time &&
            (b.status === "Pending" || b.status === "Approved"));
        if (taken) {
            return showMsg("bookMessage", "That slot is already booked. Please pick another time.", "red");
        }

        // Next booking number
        const id = bookings.length ? Math.max(...bookings.map((b) => b.id)) + 1 : 1;

        bookings.push({ id, student, course, date, time, notes: notes || "-", status: "Pending" });
        saveData("bookings", bookings);

        document.getElementById("bookCourse").value = "";
        document.getElementById("bookDate").value = "";
        document.getElementById("bookTime").value = "";
        document.getElementById("bookNotes").value = "";
        studentSelect.value = "";

        showBookings();
        showMsg("bookMessage", `Booking #${id} sent. Status: Pending.`, "green");
    });
}

// ===================================================================
// DASHBOARD PAGE
// ===================================================================

if (document.getElementById("dashWelcome")) {

    if (!currentUser) {
        // Dashboard is only for logged-in users
        alert("Please log in to see your dashboard.");
        location.href = "login.html";
    } else {
        const bookings = loadData("bookings", DEFAULT_BOOKINGS);
        const students = loadData("students", DEFAULT_STUDENTS);
        const teachers = loadData("teachers", DEFAULT_TEACHERS);
        const courses = loadData("courses", DEFAULT_COURSES);

        const role = currentUser.role;
        const roleName = role === "admin" ? "Administrator" : role.charAt(0).toUpperCase() + role.slice(1);

        // Top of the page
        document.getElementById("dashWelcome").textContent = `Welcome, ${currentUser.name.split(" ")[0]}`;
        document.getElementById("dashRole").textContent = `You are logged in as: ${roleName}`;
        document.getElementById("dashDate").textContent = new Date().toLocaleDateString("en-GB", {
            weekday: "long", day: "numeric", month: "long", year: "numeric"
        });

        // Show only the dashboard for this role
        document.getElementById("studentView").style.display = role === "student" ? "" : "none";
        document.getElementById("teacherView").style.display = role === "teacher" ? "" : "none";
        document.getElementById("adminView").style.display = role === "admin" ? "" : "none";

        const countStatus = (list, status) => list.filter((b) => b.status === status).length;

        // ---------- Student dashboard ----------
        const showStudentDashboard = () => {
            const mine = bookings.filter((b) => b.student.toLowerCase() === currentUser.name.toLowerCase());

            document.getElementById("totalCount").textContent = mine.length;
            document.getElementById("pendingCount").textContent = countStatus(mine, "Pending");
            document.getElementById("approveCount").textContent = countStatus(mine, "Approved");
            document.getElementById("rejectedCount").textContent = countStatus(mine, "Rejected");
            document.getElementById("completedCount").textContent = countStatus(mine, "Completed");
            document.getElementById("cancelledCount").textContent = countStatus(mine, "Cancelled");

            // Next class = earliest approved booking from today onwards
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const upcoming = mine
                .filter((b) => b.status === "Approved" && parseDate(b.date) >= today)
                .sort((a, b) => parseDate(a.date) - parseDate(b.date));

            const nextBox = document.querySelectorAll("#studentView > section")[1].querySelector("p");
            nextBox.innerHTML = upcoming.length
                ? `<strong>${esc(upcoming[0].course)}</strong> on ${upcoming[0].date} at ${upcoming[0].time} (Approved)`
                : "No upcoming approved classes.";

            // Messages
            const texts = {
                Pending: "was sent. Status: Pending",
                Approved: "was approved",
                Rejected: "was rejected",
                Completed: "was marked completed",
                Cancelled: "was cancelled"
            };
            document.getElementById("messageList").innerHTML = mine.length
                ? mine.map((b) => `<li>Booking #${b.id} ${texts[b.status]}</li>`).join("")
                : "<li>No messages yet.</li>";
        };

        // ---------- Teacher dashboard ----------
        const showTeacherDashboard = () => {
            const pending = bookings.filter((b) => b.status === "Pending");

            // Classes this week = approved bookings between Monday and Sunday
            const now = new Date();
            const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - ((now.getDay() + 6) % 7));
            const sunday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 6);
            const thisWeek = bookings.filter((b) => {
                const d = parseDate(b.date);
                return b.status === "Approved" && d >= monday && d <= sunday;
            });

            // My students = different students with approved or completed classes
            const names = new Set(
                bookings.filter((b) => b.status === "Approved" || b.status === "Completed").map((b) => b.student)
            );

            document.getElementById("teacherPending").textContent = pending.length;
            document.getElementById("teacherClasses").textContent = thisWeek.length;
            document.getElementById("teacherStudents").textContent = names.size;

            document.getElementById("requestBody").innerHTML = pending.length
                ? pending.map((b) => `
                    <tr>
                        <td>${b.id}</td>
                        <td>${esc(b.student)}</td>
                        <td>${esc(b.course)}</td>
                        <td>${esc(b.date)}</td>
                        <td>${esc(b.time)}</td>
                        <td>
                            <button type="button" data-id="${b.id}" data-status="Approved">Approve</button>
                            <button type="button" data-id="${b.id}" data-status="Rejected">Reject</button>
                        </td>
                    </tr>`).join("")
                : `<tr><td colspan="6">No pending requests.</td></tr>`;
        };

        document.getElementById("requestBody").addEventListener("click", (event) => {
            const btn = event.target.closest("button");
            if (!btn) return;

            const error = changeStatus(bookings, Number(btn.dataset.id), btn.dataset.status);
            if (error) return alert(error);
            showTeacherDashboard();
        });

        // ---------- Admin dashboard ----------
        const showAdminDashboard = () => {
            document.getElementById("adminStudents").textContent = students.length;
            document.getElementById("adminTeachers").textContent = teachers.length;
            document.getElementById("adminCourses").textContent = courses.length;
            document.getElementById("adminBookings").textContent = bookings.length;

            // Three most recent bookings (newest first)
            const latest = bookings.slice(-3).reverse();
            document.querySelector("#adminView table tbody").innerHTML = latest.length
                ? latest.map((b) => `
                    <tr>
                        <td>${b.id}</td>
                        <td>${esc(b.student)}</td>
                        <td>${esc(b.course)}</td>
                        <td>${esc(b.date)}</td>
                        <td>${b.status}</td>
                    </tr>`).join("")
                : `<tr><td colspan="5">No bookings yet.</td></tr>`;
        };

        if (role === "student") showStudentDashboard();
        if (role === "teacher") showTeacherDashboard();
        if (role === "admin") showAdminDashboard();
    }
}

// ===================================================================
// REPORTS PAGE
// ===================================================================

if (document.querySelector(".pending-bar")) {
    const bookings = loadData("bookings", DEFAULT_BOOKINGS);
    const total = bookings.length;

    const statuses = ["Pending", "Approved", "Rejected", "Completed", "Cancelled"];
    const courseNames = ["Guitar", "Piano", "Violin", "Drums", "Vocals", "Keyboard"];
    const colors = {
        Pending: "#f4b942",
        Approved: "#2e9e5b",
        Rejected: "#c0392b",
        Completed: "#4b2e83",
        Cancelled: "#888888"
    };

    const statusCount = (s) => bookings.filter((b) => b.status === s).length;
    const courseCount = (c) => bookings.filter((b) => b.course === c).length;

    // A coloured bar: widest bar is 200px
    const bar = (className, count, color) => {
        const width = total ? Math.round((count / total) * 200) : 0;
        return `<span class="${className}" style="display:inline-block;height:14px;width:${width}px;background-color:${color};border-radius:4px;"></span>`;
    };

    // Summary list
    const courseCounts = courseNames.map(courseCount);
    const most = Math.max(...courseCounts);
    const mostNames = courseNames.filter((c) => courseCount(c) === most).join(" and ");

    document.querySelector("main ul").innerHTML = `
        <li>Total bookings: <strong>${total}</strong></li>
        <li>Most booked courses: <strong>${most ? mostNames : "None yet"}</strong> (${most} each)</li>
        <li>Approved bookings: <strong>${statusCount("Approved")}</strong></li>
        <li>Completed classes: <strong>${statusCount("Completed")}</strong></li>`;

    const tables = document.querySelectorAll("main table");
    const statusTable = tables[0];
    const courseTable = tables[1];

    // Bookings by status
    statusTable.querySelector("tbody").innerHTML = statuses.map((s) => `
        <tr>
            <td>${s}</td>
            <td>${statusCount(s)}</td>
            <td>${bar(s.toLowerCase() + "-bar", statusCount(s), colors[s])}</td>
        </tr>`).join("");
    statusTable.querySelector("tfoot td").textContent = total;

    // Bookings by course
    courseTable.querySelector("tbody").innerHTML = courseNames.map((c) => `
        <tr>
            <td>${c}</td>
            <td>${courseCount(c)}</td>
            <td>${bar("course-bar", courseCount(c), "#4b2e83")}</td>
        </tr>`).join("");
    courseTable.querySelector("tfoot td").textContent = total;

    // Print button
    document.querySelector("main button").addEventListener("click", () => window.print());
}

// ===================================================================
// SCHEDULE PAGE
// ===================================================================

if (document.getElementById("timetableBody")) {
    const classes = loadData("classes", DEFAULT_CLASSES);

    const times = ["10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "04:00 PM", "06:00 PM"];
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const teacherSelect = document.getElementById("scheduleTeacher");
    const daySelect = document.getElementById("scheduleDay");
    const headerCells = document.querySelectorAll("#timetableBody")[0].closest("table").querySelectorAll("thead th");

    // If a teacher is logged in, start with their own schedule
    if (currentUser && currentUser.role === "teacher") {
        const match = [...teacherSelect.options].find((o) => o.value.toLowerCase() === currentUser.name.toLowerCase());
        if (match) teacherSelect.value = match.value;
    }

    const showSchedule = () => {
        const teacher = teacherSelect.value;
        const day = daySelect.value;
        const showBooked = document.getElementById("booked").checked;
        const showFree = document.getElementById("free-cls").checked;

        // Classes that match the teacher and day filters
        const list = classes.filter((c) =>
            (teacher === "all" || c.teacher === teacher) &&
            (day === "all" || c.day === day));

        // Show or hide each day column
        days.forEach((d, i) => {
            const visible = day === "all" || day === d;
            headerCells[i + 1].style.display = visible ? "" : "none";
        });

        // Weekly timetable
        let rows = "";
        times.forEach((time) => {
            rows += `<tr><th scope="row">${time}</th>`;

            days.forEach((d) => {
                const hide = day !== "all" && day !== d ? ' style="display:none"' : "";
                const found = list.find((c) => c.day === d && c.time === time);

                if (found) {
                    rows += showBooked
                        ? `<td class="booked"${hide}><strong>${esc(found.course)}</strong><br><small>${esc(found.student)}</small></td>`
                        : `<td${hide}></td>`;
                } else {
                    rows += showFree ? `<td class="free"${hide}>Free</td>` : `<td${hide}></td>`;
                }
            });

            rows += "</tr>";
        });
        document.getElementById("timetableBody").innerHTML = rows;

        // Numbers and labels
        document.getElementById("classCount").textContent = list.length;
        document.getElementById("scheduleTeacherName").textContent = teacher === "all" ? "All teachers" : teacher;
        showMsg("scheduleMessage", list.length ? "" : "No classes found for this choice.", "#4b2e83");

        // Upcoming classes table
        const sorted = [...list].sort((a, b) => parseDate(a.date) - parseDate(b.date));
        document.getElementById("upcomingBody").innerHTML = sorted.length
            ? sorted.map((c, i) => `
                <tr class="${(i + 1) % 2 === 0 ? "row2" : ""}">
                    <td>${i + 1}</td>
                    <td>${c.date}</td>
                    <td>${c.day.slice(0, 3)}</td>
                    <td>${c.time}</td>
                    <td>${esc(c.course)}</td>
                    <td>${esc(c.student)}</td>
                    <td><span class="approved">Approved</span></td>
                </tr>`).join("")
            : `<tr><td colspan="7">No upcoming classes.</td></tr>`;
    };

    showSchedule();

    document.getElementById("scheduleBtn").addEventListener("click", showSchedule);
    teacherSelect.addEventListener("change", showSchedule);
    daySelect.addEventListener("change", showSchedule);
    document.getElementById("booked").addEventListener("change", showSchedule);
    document.getElementById("free-cls").addEventListener("change", showSchedule);
}
