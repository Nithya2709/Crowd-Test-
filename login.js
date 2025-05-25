const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = loginForm.email.value.trim();
  const password = loginForm.password.value;
  const role = loginForm.role.value;

  loginError.textContent = "";

  auth.signInWithEmailAndPassword(email, password)
    .then(({ user }) => {
      return db.collection('users').doc(user.uid).get();
    })
    .then(doc => {
      if (!doc.exists) throw new Error("User data not found");
      if (doc.data().role !== role) {
        throw new Error("Role mismatch. Please select the correct role.");
      }
      // Redirect based on role
      if (role === "developer") {
        window.location.href = "developer-dashboard.html";
      } else {
        window.location.href = "tester-dashboard.html";
      }
    })
    .catch(error => {
      loginError.textContent = error.message;
    });
});
