console.log("background.js loaded")
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "saveApplication") {
        browser.storage.local.get("applications").then(result => {
            const applications = result.applications || [];
            const exists = applications.some(app => app.jobUrl === message.application.jobUrl);

            if (!exists) {
                applications.push(message.application);
                browser.storage.local.set({ applications });
            }
        });
    }
});

