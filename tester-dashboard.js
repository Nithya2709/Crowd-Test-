const logoutBtn = document.getElementById("logoutBtn");
const homeBtn = document.getElementById("homeBtn");
const availableProjectsList = document.getElementById("availableProjectsList");
const submitBugForm = document.getElementById("bugReportForm");
const myBugReportsList = document.getElementById("myBugReportsList");

let currentUserId;

auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }
  currentUserId = user.uid;
  loadAvailableProjects();
  loadMyBugReports();
});

logoutBtn.onclick = () => {
  auth.signOut().then(() => {
    window.location.href = "index.html";
  });
};

homeBtn.onclick = () => {
  window.location.href = "index.html";
};

async function loadAvailableProjects() {
  availableProjectsList.innerHTML = "Loading projects...";
  const snapshot = await db.collection('projects')
    .orderBy('timestamp', 'desc')
    .get();

  if (snapshot.empty) {
    availableProjectsList.innerHTML = "<p>No projects available.</p>";
    return;
  }

  availableProjectsList.innerHTML = "";
  snapshot.forEach(doc => {
    const proj = doc.data();
    const id = doc.id;

    const projectCard = document.createElement("div");
    projectCard.className = "project-card";

    const title = document.createElement("h3");
    title.textContent = proj.name;

    const desc = document.createElement("p");
    desc.textContent = proj.description;

    const devId = proj.developerId;

    const reportBtn = document.createElement("button");
    reportBtn.textContent = "Report Bug";
    reportBtn.onclick = () => {
      showBugReportForm(id, proj.name, devId);
    };

    projectCard.appendChild(title);
    projectCard.appendChild(desc);
    projectCard.appendChild(reportBtn);

    availableProjectsList.appendChild(projectCard);
  });
}

function showBugReportForm(projectId, projectName, developerId) {
  const formSection = document.querySelector(".submit-bug-section");
  formSection.style.display = "block";

  submitBugForm.projectId.value = projectId;
  submitBugForm.projectName.value = projectName;
  submitBugForm.developerId.value = developerId;
}

submitBugForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const projectId = submitBugForm.projectId.value;
  const projectName = submitBugForm.projectName.value;
  const developerId = submitBugForm.developerId.value;
  const description = submitBugForm.bugDescription.value.trim();

  if (!description) {
    alert("Please enter bug description.");
    return;
  }

  await db.collection('bugReports').add({
    projectId,
    projectName,
    developerId,
    testerId: currentUserId,
    description,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });

  alert("Bug reported successfully!");
  submitBugForm.reset();
  document.querySelector(".submit-bug-section").style.display = "none";

  loadMyBugReports();
});

async function loadMyBugReports() {
  myBugReportsList.innerHTML = "Loading bug reports...";
  const snapshot = await db.collection('bugReports')
    .where('testerId', '==', currentUserId)
    .orderBy('timestamp', 'desc')
    .get();

  if (snapshot.empty) {
    myBugReportsList.innerHTML = "<p>No bug reports submitted yet.</p>";
    return;
  }

  myBugReportsList.innerHTML = "";
  snapshot.forEach(doc => {
    const bug = doc.data();

    const bugCard = document.createElement("div");
    bugCard.className = "bug-card";

    const title = document.createElement("h3");
    title.textContent = bug.projectName || "Bug Report";

    const desc = document.createElement("p");
    desc.textContent = bug.description;

    bugCard.appendChild(title);
    bugCard.appendChild(desc);

    myBugReportsList.appendChild(bugCard);
  });
}
