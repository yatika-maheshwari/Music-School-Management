// Serenova: one script for the Home, Register and Login pages

// ===== COMMON (all pages) =====

// Who is logged in? (null if nobody)
const currentUser = JSON.parse(localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser"));

// These are null if the page does not have that form
const registerForm = document.querySelector("#registerForm");
const loginForm = document.querySelector("#loginForm");
const searchForm = document.querySelector("#searchForm");

// Show a message below a form
function showMessage(text, color) {
    const message = document.querySelector("#message");
    message.textContent = text;
    message.style.color = color;
}

// Account button in the nav bar
if (currentUser) {
    const nav = document.querySelector("nav");
    nav.querySelector('a[href="login.html"]').style.display = "none"; // hide Login

    // Button showing the name and role
    const button = document.createElement("button");
    button.className = "account-btn";
    button.textContent = `👤 ${currentUser.name} (${currentUser.role})`;

    // Details box, hidden at first
    const box = document.createElement("div");
    box.className = "account-box";
    box.hidden = true;

    const details = document.createElement("p");
    details.textContent = currentUser.email || "";

    const logout = document.createElement("button");
    logout.textContent = "Logout";

    box.append(details, logout);
    nav.append(button, box);

    // Click the name to open or close the box
    button.addEventListener("click", () => {
        box.hidden = !box.hidden;
    });

    // Logout: forget the user and reload
    logout.addEventListener("click", () => {
        localStorage.removeItem("currentUser");
        sessionStorage.removeItem("currentUser");
        location.reload();
    });
}

// ===== HOME PAGE =====
if (searchForm) {
    // If logged in, greet the user
    if (currentUser) {
        const hour = new Date().getHours();
        const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

        const message = document.createElement("h3");
        message.textContent = `${greeting}, ${currentUser.name}`;
        message.style.color = "#f0eafb";
        document.querySelector(".hero").prepend(message);

        // Hide the Login and Register buttons
        document.querySelectorAll(".hero .btn").forEach((btn) => (btn.style.display = "none"));
    }

    // Course search
    const searchInput = document.querySelector("#search");
    const cards = document.querySelectorAll(".card");
    const noResults = document.querySelector("#noResults");

    function filterCourses() {
        const text = searchInput.value.trim().toLowerCase();
        let found = 0;

        cards.forEach((card) => {
            const match = card.textContent.toLowerCase().includes(text);
            card.style.display = match ? "" : "none";
            if (match) found++;
        });

        noResults.textContent = found ? "" : "No course found. Try another word.";
    }

    searchInput.addEventListener("input", filterCourses); // runs while typing

    document.querySelector("#searchForm").addEventListener("submit", (event) => {
        event.preventDefault(); // stay on this page
        filterCourses();
    });
}

// ===== REGISTER PAGE =====
if (registerForm) {
    registerForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Stop default GET form submission

        const name = registerForm.elements["name"].value.trim();
        const email = registerForm.elements["email"].value.trim().toLowerCase();
        const password = registerForm.elements["password"].value;
        const confirmPassword = registerForm.elements["confirm_password"].value;
        const role = registerForm.elements["role"].value;

        // Validation using regular expressions
        if (!/^[A-Za-z ]{3,}$/.test(name)) {
            return showMessage("Name needs at least 3 letters (letters and spaces only).", "red");
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return showMessage("Enter a valid email address.", "red");
        }
        if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password)) {
            return showMessage("Password needs 8+ characters with a letter and a number.", "red");
        }
        if (password !== confirmPassword) {
            return showMessage("Passwords do not match.", "red");
        }
        if (!role) {
            return showMessage("Please select a role.", "red");
        }

        // Get saved users (empty array the first time)
        const users = JSON.parse(localStorage.getItem("users")) || [];

        // Is this email already used?
        if (users.some((u) => u.email === email)) {
            return showMessage("This email is already registered.", "red");
        }

        // Save the new user
        users.push({ name, email, password, role });
        localStorage.setItem("users", JSON.stringify(users));

        showMessage("Account created! Taking you to login...", "green");
        registerForm.reset();
        setTimeout(() => (location.href = "login.html"), 1500);
    });
}

// ===== LOGIN PAGE =====
if (loginForm) {
    // Demo admin account (admins cannot register)
    const admin = {
        name: "Admin",
        email: "admin@serenova.com",
        password: "Admin@123",
        role: "admin",
    };

    loginForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Stop page refresh

        const email = loginForm.elements["email"].value.trim().toLowerCase();
        const password = loginForm.elements["password"].value;
        const role = loginForm.elements["role"].value;

        // Admin + registered users
        const users = [admin, ...(JSON.parse(localStorage.getItem("users")) || [])];

        // find() returns the matching user, or undefined
        const user = users.find(
            (u) => u.email === email && u.password === password && u.role === role
        );

        if (!user) {
            return showMessage("Wrong email, password or role.", "red");
        }

        // Remember me: localStorage stays, sessionStorage ends with the tab
        localStorage.removeItem("currentUser");
        sessionStorage.removeItem("currentUser");

        const storage = loginForm.elements["remember"]?.checked ? localStorage : sessionStorage;
        storage.setItem(
            "currentUser",
            JSON.stringify({ name: user.name, email: user.email, role: user.role })
        );

        showMessage("Login successful!", "green");
        setTimeout(() => (location.href = "index.html"), 1000);
    });

    // Google / Apple buttons and "Forgot password?" are not real yet
    document.querySelectorAll(".social button, .remember a").forEach((item) => {
        item.addEventListener("click", (event) => {
            event.preventDefault();
            showMessage("This feature is not available in this demo.", "#4b2e83");
        });
    });
}
