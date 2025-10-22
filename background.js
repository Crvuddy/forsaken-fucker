const TARGET_HOST = "www.roblox.com";
const TARGET_PATH_PREFIX = "/games/18687417158/Forsaken";
const REDIRECT_URL = "https://www.roblox.com/home";

async function checkAndRedirect(tabId, url) {
  if (!url) return;
  try {
    const u = new URL(url);
    if (u.hostname === TARGET_HOST && u.pathname.startsWith(TARGET_PATH_PREFIX)) {
      chrome.tabs.update(tabId, { url: REDIRECT_URL }).catch(() => {});
    }
  } catch {
  }
}

chrome.tabs.onCreated.addListener((tab) => {
  if (tab?.id && tab.url) checkAndRedirect(tab.id, tab.url);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    checkAndRedirect(tabId, changeInfo.url);
  } else if (changeInfo.status === "complete" && tab?.url) {
    checkAndRedirect(tabId, tab.url);
  }
});

chrome.webNavigation.onCommitted.addListener((details) => {
  if (details.frameId === 0 && details.url) {
    checkAndRedirect(details.tabId, details.url);
  }
});
