const logoutBtn = document.getElementById("logoutBtn");
const homeBtn = document.getElementById("homeBtn");
const projectForm = document.getElementById("projectForm");
const projectsList = document.getElementById("projectsList");
const bugReportsList = document.getElementById("bugReportsList");
const codeTextArea = document.getElementById("codeTextArea");
const codeFilesInput = document.getElementById("codeFilesInput");

let currentUserId;

auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  currentUserId = user.uid;
  loadProjects();
  loadBugReports();

  // Add form event listener here after auth state is set
  projectForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = projectForm.projectName.value.trim();
    const desc = projectForm.projectDesc.value.trim();
    const inputType = document.querySelector('input[name="codeInputType"]:checked').value;
    const suggestion = projectForm.testSuggestion.value.trim();

    if (!name || !desc) {
      alert("Please fill required fields.");
      return;
    }

    const projectData = {
      name,
      description: desc,
      suggestions: suggestion,
      developerId: currentUserId,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      codeText: null,
      codeFiles: []
    };

    if (inputType === "text") {
      const codeText = codeTextArea.value.trim();
      if (!codeText) {
        alert("Please paste your code.");
        return;
      }
      projectData.codeText = codeText;
    }

    try {
      const projectRef = await db.collection("projects").add(projectData);

      if (inputType === "file" && codeFilesInput.files.length > 0) {
        const uploadPromises = [];

        for (let file of codeFilesInput.files) {
  const fileRef = storage.ref(`projects/${projectRef.id}/${file.name}`);
  const uploadTask = fileRef.put(file).then(() => fileRef.getDownloadURL());
  uploadPromises.push(uploadTask);
}

        const fileURLs = await Promise.all(uploadPromises);
        await projectRef.update({ codeFiles: fileURLs });
      }

      alert("Project submitted successfully!");
      projectForm.reset();
      codeTextArea.style.display = "block";
      codeFilesInput.style.display = "none";
      loadProjects();
    } catch (error) {
      console.error("Error submitting project:", error);
      alert("Failed to submit project. Try again.");
    }
  });
});

logoutBtn.onclick = () => {
  auth.signOut().then(() => {
    window.location.href = "index.html";
  });
};

homeBtn.onclick = () => {
  window.location.href = "index.html";
};

document.querySelectorAll('input[name="codeInputType"]').forEach(radio => {
  radio.addEventListener("change", () => {
    if (radio.value === "text" && radio.checked) {
      codeTextArea.style.display = "block";
      codeFilesInput.style.display = "none";
    } else if (radio.value === "file" && radio.checked) {
      codeTextArea.style.display = "none";
      codeFilesInput.style.display = "block";
    }
  });
});

async function loadProjects() {
  projectsList.innerHTML = "Loading projects...";
  try {
    const snapshot = await db.collection("projects")
      .where("developerId", "==", currentUserId)
      .orderBy("timestamp", "desc")
      .get();

    if (snapshot.empty) {
      projectsList.innerHTML = "<p>No projects submitted yet.</p>";
      return;
    }

    projectsList.innerHTML = "";
    snapshot.forEach(doc => {
      const proj = doc.data();
      const id = doc.id;

      const projectCard = document.createElement("div");
      projectCard.className = "project-card";

      const title = document.createElement("h3");
      title.textContent = proj.name;

      const desc = document.createElement("p");
      desc.textContent = proj.description;

      const suggestions = document.createElement("p");
      suggestions.innerHTML = `<strong>Suggestions:</strong> ${proj.suggestions || "None"}`;

      const codeSection = document.createElement("div");
      if (proj.codeText) {
        const pre = document.createElement("pre");
        pre.textContent = proj.codeText;
        codeSection.appendChild(pre);
      }

      if (proj.codeFiles && proj.codeFiles.length > 0) {
        const filesList = document.createElement("ul");
        proj.codeFiles.forEach(url => {
          const li = document.createElement("li");
          const a = document.createElement("a");
          a.href = url;
          a.target = "_blank";
          a.textContent = "View file";
          li.appendChild(a);
          filesList.appendChild(li);
        });
        codeSection.appendChild(filesList);
      }

      projectCard.appendChild(title);
      projectCard.appendChild(desc);
      projectCard.appendChild(suggestions);
      projectCard.appendChild(codeSection);

      projectsList.appendChild(projectCard);
    });
  } catch (err) {
    console.error("Error loading projects:", err);
    projectsList.innerHTML = "<p>Error loading projects.</p>";
  }
}

async function loadBugReports() {
  bugReportsList.innerHTML = "Loading bug reports...";
  try {
    const snapshot = await db.collection("bugReports")
      .where("developerId", "==", currentUserId)
      .orderBy("timestamp", "desc")
      .get();

    if (snapshot.empty) {
      bugReportsList.innerHTML = "<p>No bug reports yet.</p>";
      return;
    }

    bugReportsList.innerHTML = "";
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

      bugReportsList.appendChild(bugCard);
    });
  } catch (err) {
    console.error("Error loading bug reports:", err);
    bugReportsList.innerHTML = "<p>Error loading bug reports.</p>";
  }
}
