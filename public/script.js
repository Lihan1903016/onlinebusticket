// Helper function to open popups
function openPopup(popupId) {
    console.log(`Opening popup: ${popupId}`);  // Debugging line
    const popup = document.getElementById(popupId);
    if (popup) {
        popup.style.display = 'block';
    } else {
        console.log(`Popup with ID ${popupId} not found.`);
    }
}

// Helper function to close popups
function closePopup(popupId) {
    console.log(`Closing popup: ${popupId}`);  // Debugging line
    const popup = document.getElementById(popupId);
    if (popup) {
        popup.style.display = 'none';
    } else {
        console.log(`Popup with ID ${popupId} not found.`);
    }
}

// Helper function to switch between popups
function switchPopup(fromPopupId, toPopupId) {
    console.log(`Switching popups: ${fromPopupId} -> ${toPopupId}`); // Debugging line
    closePopup(fromPopupId);  // Close the first popup
    openPopup(toPopupId);     // Open the second popup
}

// Sign In function (AJAX)
function signIn(event) {
    event.preventDefault();  // Prevent page reload

    const email = document.getElementById('signinEmail').value;
    const password = document.getElementById('signinPassword').value;

    // Send the sign-in request via Fetch API
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = data.redirect;  // Redirect based on the response
        } else {
            document.getElementById('signinError').textContent = data.message;
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Sign Up function (AJAX)
function signUp(event) {
    event.preventDefault();  // Prevent page reload
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const role = document.getElementById('signupRole').value;

    // Clear previous errors
    document.getElementById('signupError').textContent = '';

    // Send signup data to server
    fetch('/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
    })
    .then(response => response.json()) // Parse JSON response from the server
    .then(data => {
        console.log('Response Data:', data);  // Check the data from the server
        
        if (data.success) {
            // On success, switch to the sign-in popup
            switchPopup('signupPopup', 'signinPopup');
        } else {
            // Display the error message returned from the server
            document.getElementById('signupError').textContent = data.message;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        // Handle any errors that occur during the request
        document.getElementById('signupError').textContent = 'An error occurred. Please try again later.';
    });
}