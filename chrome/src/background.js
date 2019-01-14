/*

	background.js is part of Ponify (Chrome Extension)

	Copyright 2011 Ben Ashton <ben_ashton@gmx.co.uk>

	Ponify is free software; you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation; either version 2 of the License, or
	(at your option) any later version.

	Ponify is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with Ponify; if not, write to the Free Software
	Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
	MA 02110-1301, USA.

*/

chrome.extension.onRequest.addListener(function(request, sender, sendResponse){
				if(request.method == "update"){
					chrome.tabs.getSelected(null, function(tab) {
						updateIcon(tab);
					});
					sendResponse({});
				} else{
					sendResponse({
						url: sender.tab.url,
						replace: JSON.parse(localStorage["replaceList"]),
						websites: JSON.parse(localStorage["websiteList"]),
						wlist_type: JSON.parse(localStorage["wlist_type"]),
						ponify_enabled: JSON.parse(localStorage["ponify_enabled"]),
						pseudo_threading: JSON.parse(localStorage["pseudo_threading"]),
						highlight: JSON.parse(localStorage["highlight"])
					});
				}
			});


			function updateIcon(tab){
				var websites = JSON.parse(localStorage["websiteList"]);
				var wlist_type = JSON.parse(localStorage["wlist_type"]);
				var ponify_enabled = JSON.parse(localStorage["ponify_enabled"]);

				var ponify = 0;

				if(ponify_enabled){
					ponify = 1;

					if(!websites.length && wlist_type){
						ponify = 0;
					}

					var r = /([^\/]+:\/\/)?(www\.)?(([^\/]*)[^\?#]*)/;
					var a = r.exec(tab.url);

					for(var i = 0; i < websites.length; i++){

						var b = r.exec(websites[i][0])[3];

						if((a[3].substr(0, b.length) == b) != wlist_type){
							ponify = 0;
						}
					}

					if(a[1] != "http://" && a[1] != "https://"){
						ponify = 0;
					}
				}

				if (ponify) {
					chrome.browserAction.setIcon({path:"img/rh16.png", tabId: tab.id});
				} else {
					chrome.browserAction.setIcon({path:"img/rh16gray.png", tabId: tab.id});
				}
			}

			chrome.tabs.onUpdated.addListener(function(tabid, changeInfo, tab) {
				if (tab.selected){
					chrome.tabs.get(tabid, updateIcon);
				}
			});
			chrome.tabs.onSelectionChanged.addListener(function(tabid, selectInfo) {
				chrome.tabs.get(tabid, updateIcon);
			});
