// Handles index.html logic: auth state, buttons visibility, redirects

auth.onAuthStateChanged(user => {
  const loginBtn = document.getElementById("loginBtn");
  const signupBtn = document.getElementById("signupBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const developerBtn = document.getElementById("developerBtn");
  const testerBtn = document.getElementById("testerBtn");

  if (user) {
    // Hide login/signup buttons and show logout
    loginBtn.style.display = "none";
    signupBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";

    // Fetch user role from Firestore
    db.collection('users').doc(user.uid).get()
      .then(doc => {
        if (doc.exists) {
          const role = doc.data().role;
          // On clicking developer/tester button, redirect accordingly
          developerBtn.onclick = () => {
            if (role === 'developer') {
              window.location.href = "developer-dashboard.html";
            } else {
              alert("You are not registered as a developer.");
            }
          };
          testerBtn.onclick = () => {
            if (role === 'tester') {
              window.location.href = "tester-dashboard.html";
            } else {
              alert("You are not registered as a tester.");
            }
          };
        } else {
          alert("User data not found.");
        }
      })
      .catch(console.error);

  } else {
    // Show login/signup buttons, hide logout
    loginBtn.style.display = "inline-block";
    signupBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";

    developerBtn.onclick = () => alert("Please login first.");
    testerBtn.onclick = () => alert("Please login first.");
  }
});

// Button listeners for login/signup/logout buttons
document.getElementById("loginBtn").onclick = () => {
  window.location.href = "login.html";
};
document.getElementById("signupBtn").onclick = () => {
  window.location.href = "signup.html";
};
document.getElementById("logoutBtn").onclick = () => {
  auth.signOut().then(() => {
    window.location.reload();
  });
};
