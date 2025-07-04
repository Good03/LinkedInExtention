console.log("app.js loaded")
function waitForElement(selector, timeout = 5000) {
    console.log("waiting for element " + selector);
    return new Promise((resolve, reject) => {
        const interval = 200;
        let elapsed = 0;
        const timer = setInterval(() => {
            const el = document.querySelector(selector);
            if (el) {
                clearInterval(timer);
                resolve(el);
            } else if (elapsed >= timeout) {
                clearInterval(timer);
                reject("Element not found: " + selector);
            }
            elapsed += interval;
        }, interval);
    });
}


async function attachApplyListener() {
    try {
        const applyBtn = await waitForElement("#jobs-apply-button-id");
        if (applyBtn.dataset.trackerHooked) return;
        applyBtn.dataset.trackerHooked = "true";

        applyBtn.addEventListener("click", () => {
            const jobTitle = document.querySelector('h1.t-24.t-bold.inline a')?.innerText.trim() || "Unknown Job";
            const company = document.querySelector(".job-details-jobs-unified-top-card__company-name a")?.innerText.trim() || "Unknown Company";

            const application = {
                id: Date.now().toString(),
                jobTitle,
                company,
                jobUrl: window.location.href,
                timestamp: new Date().toISOString()
            };

            browser.runtime.sendMessage({type: "saveApplication", application});
        });
    } catch (error) {
        console.log(error);
    }

}


function watchUrlChanges() {
    let lastUrl = location.href;
    setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            if (location.href.includes("/jobs/")) {
                attachApplyListener();
            }
        }
    }, 1000);
}

if (window.location.href.includes("/jobs/")) {
    attachApplyListener();
}
watchUrlChanges();

