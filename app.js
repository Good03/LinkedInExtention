function attachApplyListener() {
    const applyBtn = document.getElementById("jobs-apply-button-id");
    console.log("Apply button found:", !!applyBtn);

    if (!applyBtn) return;

    // Remove previous listener to avoid duplicates
    applyBtn.replaceWith(applyBtn.cloneNode(true));
    const newApplyBtn = document.getElementById("jobs-apply-button-id");

    newApplyBtn.addEventListener("click", () => {
        const jobTitle = document.querySelector('h1.t-24.t-bold.inline a')?.innerText.trim() || "Unknown Job";
        const company = document.querySelector(".job-details-jobs-unified-top-card__company-name a")?.innerText.trim() || "Unknown Company";

        const application = {
            id: Date.now().toString(),
            jobTitle,
            company,
            jobUrl: window.location.href,
            timestamp: new Date().toISOString()
        };

        browser.runtime.sendMessage({ type: "saveApplication", application });
    });
}

function watchUrlChanges() {
    let lastUrl = location.href;

    const observer = new MutationObserver(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            if (currentUrl.includes("/jobs/")) {
                setTimeout(attachApplyListener, 1000);
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

if (window.location.href.includes("/jobs/")) {
    setTimeout(attachApplyListener, 1000);
}

watchUrlChanges();

