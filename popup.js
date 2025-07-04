let currentSortOrder = "desc";
let allApplications = [];
console.log("popup.js loaded");
function sortAndRender(applications) {
    const sortedApps = [...applications].sort((a, b) => {
        const dateA = new Date(a.timestamp);
        const dateB = new Date(b.timestamp);
        return currentSortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
    renderApplications(sortedApps);
}

function renderApplications(applications) {
    const tbody = document.getElementById("app-table-body");
    tbody.innerHTML = "";

    if (applications.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No applications saved.</td></tr>';
        return;
    }

    applications.forEach(app => {
        const tr = document.createElement("tr");

        const jobTitleTd = document.createElement("td");
        jobTitleTd.textContent = app.jobTitle || "Unknown job";
        tr.appendChild(jobTitleTd);

        const companyTd = document.createElement("td");
        companyTd.textContent = app.company || "Unknown company";
        tr.appendChild(companyTd);

        const dateTd = document.createElement("td");
        const date = new Date(app.timestamp);
        dateTd.textContent = date.toLocaleDateString();
        tr.appendChild(dateTd);

        const linkTd = document.createElement("td");
        const link = document.createElement("a");
        link.href = app.jobUrl;
        link.target = "_blank";
        link.textContent = "View Job";
        linkTd.appendChild(link);
        tr.appendChild(linkTd);

        const delTd = document.createElement("td");
        delTd.className = "delete-cell";
        const delBtn = document.createElement("button");
        delBtn.className = "delete-btn";
        delBtn.textContent = "🗑️";
        delBtn.title = "Delete application";
        delBtn.onclick = async () => {
            const result = await browser.storage.local.get("applications");
            const filtered = (result.applications || []).filter(a => a.id !== app.id);
            await browser.storage.local.set({ applications: filtered });
            allApplications = filtered;
            sortAndRender(allApplications);
        };
        delTd.appendChild(delBtn);
        tr.appendChild(delTd);

        tbody.appendChild(tr);
    });
}

document.getElementById("date-header").addEventListener("click", () => {
    currentSortOrder = currentSortOrder === "asc" ? "desc" : "asc";
    const indicator = document.getElementById("sort-indicator");
    indicator.textContent = currentSortOrder === "asc" ? "⬆️" : "⬇️";

    sortAndRender(allApplications);
});

document.getElementById("clear-all-btn").addEventListener("click", async () => {
    if (confirm("Delete all saved applications?")) {
        await browser.storage.local.set({ applications: [] });
        allApplications = [];
        sortAndRender([]);
    }
});


browser.storage.local.get("applications").then(result => {
    allApplications = result.applications || [];
    sortAndRender(allApplications);
});
