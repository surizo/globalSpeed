
// set badge text.
export async function setBadgeText(text: string, tabId: number, color = "#a64646"): Promise<void> {
  await Promise.all([
    new Promise(res => {
      chrome.browserAction.setBadgeText({
        text,
        tabId
      }, () => res())
    }),
    new Promise(res => {
      chrome.browserAction.setBadgeBackgroundColor({
        color,
        tabId
      }, () => res())
    })
  ])
}

export function setBadgeIcon(path: chrome.browserAction.TabIconDetails["path"], tabId?: number): Promise<void> {
  return new Promise(res => {
    chrome.browserAction.setIcon({
      path,
      tabId
    }, () => {
      res()
    })
  })
}

export function getActiveTabIds(): Promise<number[]> {
  return new Promise((res, rej) => {
    chrome.tabs.query({active: true, currentWindow: undefined, windowType: "normal"}, tabs => {
      res(tabs.map(v => v.id)) 
    })
  })
}

export function getActiveTabId(): Promise<number> {
  return new Promise((res, rej) => {
    chrome.tabs.query({active: true, currentWindow: true, windowType: "normal"}, tabs => {
      res(tabs[0]?.id)
    })
  })
}

export type TabFrameInfo = {tabId: number, frameId: number}

export function requestSenderInfo(): Promise<TabFrameInfo> {
  return new Promise((res, rej) => {
    chrome.runtime.sendMessage({
      type: "REQUEST_SENDER_INFO"
    }, info => {
      res(info)
    })
  })
}

export function requestCreateTab(url: string): Promise<number> {
  return new Promise((res, rej) => {
    chrome.runtime.sendMessage({
      type: "REQUEST_CREATE_TAB",
      url
    }, id => {
      res(id)
    })
  })
}

export const ALL_URLS_PERMISSIONS = {origins: ["http://*/*", "https://*/*", "file://*/*"]}

export function hasPermissions(permission: chrome.permissions.Permissions): Promise<boolean> {
  return new Promise((res, rej) => {
    chrome.permissions.contains(permission, has => res(has))
  })
}

export function removePermissions(permission: chrome.permissions.Permissions): Promise<boolean>  {
  return new Promise((res, rej) => {
    chrome.permissions.remove(permission, has => res(has))
  })
}

export function requestPermissions(permission: chrome.permissions.Permissions): Promise<boolean> {
  return new Promise((res, rej) => {
    chrome.permissions.request(permission, has => res(has))
  })
}

export type StorageItems = {[key: string]: any}

export type StorageChanges =  {[key: string]: chrome.storage.StorageChange}

export function getStorage(): Promise<StorageItems> {
  return new Promise((res, rej) => {
    chrome.storage.local.get(items => {
      if (chrome.runtime.lastError) {
        rej(chrome.runtime.lastError)
      } else {
        res(items)
      }
      return 
    })
  })
}

export function setStorage(items: StorageItems): Promise<StorageItems> {
  return new Promise((res, rej) => {
    chrome.storage.local.set(items, () => {
      if (chrome.runtime.lastError) {
        rej(chrome.runtime.lastError)
      } else {
        res()
      }
      return 
    })
  })
}

