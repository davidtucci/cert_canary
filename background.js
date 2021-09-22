/*******************************************************************************
    Cert Canary - a browser extension to warn of pending certificate expiration.
    Copyright (C) 2021-present David Tucci
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    You should have received a copy of the GNU General Public License
    along with this program.  If not, see {http://www.gnu.org/licenses/}.
    Home: https://github.com/davidtucci/cert_canary
*/
"use strict";

var validityInfo = {};

async function checkCert(details) {
  let hostname = (new URL(details.url)).hostname;
  var date = new Date();
  if (details.tabId in validityInfo) {
    //validityInfo[details.tabId][hostname] = NULL;
  } else {
    validityInfo[details.tabId] = {}
  }
  try {
    var securityInfo = await browser.webRequest.getSecurityInfo(
      details.requestId, {
        "certificateChain": false
      }
    );
    if ((securityInfo.state == "secure" || securityInfo.state == "weak") &&
      !securityInfo.isUntrusted) {
      var diff = securityInfo.certificates[0].validity.end - date.getTime();
      var days = Math.floor(diff / 86400000);
      var certdeets = {}
      certdeets.hostName = hostname;
      certdeets.endTime = securityInfo.certificates[0].validity.end;
      certdeets.daysToExpire = days;
      validityInfo[details.tabId][hostname]=certdeets;
      if( days <= 15){
        browser.browserAction.setBadgeBackgroundColor({color: "red", tabId: details.tabId});
        browser.browserAction.setBadgeText({text: '!', tabId: details.tabId});
      }else if(days <= 30){
        browser.browserAction.setBadgeBackgroundColor({color: "yellow", tabId: details.tabId});
        browser.browserAction.setBadgeText({text: '!', tabId: details.tabId});
      }
    }
  } catch (error) {
    console.error(error);
  }
}

function clearForTab(details){
  console.log('deets:',details)
  if(details.frameId == 0){
    validityInfo[details.tabId] = {};
  }
}

browser.webRequest.onHeadersReceived.addListener(checkCert, {
    urls: ["<all_urls>"]
  },
  ["blocking"]
);

browser.webNavigation.onCommitted.addListener(clearForTab)
