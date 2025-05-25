const signupForm = document.getElementById("signupForm");
const signupError = document.getElementById("signupError");

signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = signupForm.email.value.trim();
  const password = signupForm.password.value;
  const role = signupForm.role.value;

  signupError.textContent = "";

  auth.createUserWithEmailAndPassword(email, password)
    .then(({ user }) => {
      // Save user role in Firestore
      return db.collection('users').doc(user.uid).set({
        email,
        role
      });
    })
    .then(() => {
      // Redirect to respective dashboard
      if (role === "developer") {
        window.location.href = "developer-dashboard.html";
      } else {
        window.location.href = "tester-dashboard.html";
      }
    })
    .catch(error => {
      signupError.textContent = error.message;
    });
});
