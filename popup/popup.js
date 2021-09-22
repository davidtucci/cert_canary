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

const backgroundPage = browser.extension.getBackgroundPage();
let validity = Object.keys(backgroundPage.validityInfo);

async function buildTable(curTab){
    let placeholderdiv = document.querySelector('.empty');
    placeholderdiv.classList.add("hidden");
    let canarytable = document.querySelector(".canary-table");
    canarytable.classList.remove("hidden");

    let tabId = curTab[0].id
    if (tabId in backgroundPage.validityInfo){
      for( const[k,v] of Object.entries(backgroundPage.validityInfo[tabId])){

        let entryTR = document.createElement("tr");
        let entryName =  document.createElement("td");
        let entryValue =  document.createElement("td");
        entryName.textContent = k;
        entryValue.textContent = v.daysToExpire;
        if(v.daysToExpire<=15){
          entryTR.classList.add("r");
        }else if(v.daysToExpire<=30){
          entryTR.classList.add("y");
        }else{
          entryTR.classList.add("g");
        }
        entryTR.appendChild(entryName);
        entryTR.appendChild(entryValue);
        canarytable.appendChild(entryTR);
      }
  }

}

function onError(error) {
  console.log(`Error: ${error}`);
}
const gettingCurrent = browser.tabs.query({currentWindow: true,active: true});
gettingCurrent.then(buildTable, onError);
