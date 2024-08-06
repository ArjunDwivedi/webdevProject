// Event listener for registration form
document.getElementById('register-form')?.addEventListener('submit', function(event) {
    console.log('Register form submit event triggered');
    event.preventDefault();
    console.log('Default action prevented');
    const fullname = event.target.fullname.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    const confirmPassword = event.target['confirm-password'].value;

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ fullname, email, password }),
        credentials: 'include' // Include credentials for session handling
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("data saved successfully");
            window.location.href = "login.html";
        } else {
            alert("data saved successfully");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred during registration.');
    });
});

// Event listener for login form
document.getElementById('login-form')?.addEventListener('submit', function(event) {
    console.log('Login form submit event triggered');
    event.preventDefault();
    console.log('Default action prevented');
    const email = event.target.email.value;
    const password = event.target.password.value;

    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ email, password }),
        credentials: 'include' // Include credentials for session handling
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = "main.html";
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred during login.');
    });
});

// Load user data on main page
// Assume there's a form or button that triggers this code
document.getElementById('some-trigger-element')?.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default action, e.g., form submission or link navigation

    if (document.body.contains(document.getElementById('user-name'))) {
        console.log('Main page detected, fetching user info');
        fetch('http://localhost:3000/user-info', {
            method: 'GET',
            credentials: 'include' // Include credentials for session handling
        })
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                window.location.href = "login.html";
            } else {
                document.getElementById('user-name').textContent = data.user.fullname;
                const activities = ["Logged in", "Updated profile", "Changed password"];
                const activitiesList = document.getElementById('recent-activities');
                activities.forEach(activity => {
                    const li = document.createElement('li');
                    li.textContent = activity;
                    activitiesList.appendChild(li);
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            window.location.href = "login.html";
        });
    }
});

// Event listener for logout
document.getElementById('logout')?.addEventListener('click', function(event) {
    console.log('Logout button clicked');
    fetch('http://localhost:3000/logout', {
        method: 'POST',
        credentials: 'include' // Include credentials for session handling
    })
    .then(() => {
        window.location.href = "login.html";
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred during logout.');
    });
});