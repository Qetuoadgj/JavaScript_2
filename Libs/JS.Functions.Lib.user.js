// ==UserScript==
// @name         JS.Functions.Lib
// @version      1.0.6
// @description  Pure JavaScript version.
// @author       Ægir
// @match        http://tampermonkey.net/*
// @exclude      http://*
// @grant        none
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Libs/JS.Functions.Lib.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Libs
// ==/UserScript==

// GLOBAL FUNCTIONS
// ====================================================================================================================
function forEach(array, callback, scope) {for (var i = 0; i < array.length; i++) {callback.call(scope, i, array[i]);}}
function asArray(list) {return Array.prototype.slice.call(list);}
function commentElement(element) {var code = element.outerHTML; element.outerHTML = ('<!-- '+code+' -->');}

function addGlobalStyle(css, cssClass) {
	var head = document.getElementsByTagName('head')[0]; if (!head) {return;}
	var style = document.createElement('style'); style.type = 'text/css'; style.innerHTML = css;
	if (cssClass) style.setAttribute('class', cssClass);
	head.appendChild(style);
}

function waitForElement(elementSelector, attrName, funcToRun, delay, tries, iframeSelector, timerGroup) {
	if (funcToRun && (typeof funcToRun).toLowerCase() == "function") {
		delay = delay || 1000; //tries = tries || 5; // defaults
		var timerGroupIndex = timerGroup ? (timerGroup.length > 0 ? timerGroup.length : 0) : null; // get Index for current function timer
		var ID = Math.floor((Math.random() * 9999) + 1000); // random ID for debug
		var startIteration = function(iteration, delay, count, timerGroup, timerGroupIndex) {
			var timer = setTimeout(iteration, delay, ++count); // setTimeout() iteration repeater variable
			if (timerGroup) {timerGroup[timerGroupIndex] = timer;} // add timer to timerGroup
		};
		var clearTimers = function(timerGroup) {
			if (timerGroup) for (var i = 0; i < timerGroup.length; ++i) {clearTimeout(timerGroup[i]);}
		};
		var iteration = function(count) {
			var keepRun = tries ? (count < tries) : true;
			if (keepRun) {
				// alert('count: '+(count+1)+'\ntries: '+tries);
				var iframeElement = iframeSelector ? document.querySelector(iframeSelector) : null,
					parentDocument = iframeElement ? (iframeElement.contentDocument || iframeElement.contentWindow.document) : null,
					targetElementsArray = parentDocument ? parentDocument.querySelectorAll(elementSelector) : document.querySelectorAll(elementSelector),
					targetElement, attrValue, result
				;
				for (var i = 0; i < targetElementsArray.length; ++i) {
					targetElement = targetElementsArray[i];
					attrValue = targetElement ? targetElement.getAttribute(attrName) : null;
					result = attrName ? attrValue : targetElement;
					if (result && result !== '') break;
				}
				// alert(attrName ? (iframeSelector ? ('iframeElement: '+iframeElement+'\nparentDocument: '+parentDocument) : '' + '\ntargetElement: '+targetElement+'\nattrValue: '+attrValue) : 'iframeElement: '+iframeElement+'\nparentDocument: '+parentDocument+'\ntargetElement: '+targetElement);
				if (result) {
					clearTimers(timerGroup);
					return funcToRun();
				} else startIteration(iteration, delay, count, timerGroup, timerGroupIndex);
				// console.log('ID: '+ID+', try: '+(count+1));
			}
		};
		iteration(0); // 1st iteration
	}
}

function waitForCondition(funcToTest, funcToRun, delay, tries, timerGroup) {
	if ((funcToTest && (typeof funcToTest).toLowerCase() == "function") && (funcToRun && (typeof funcToRun).toLowerCase() == "function")) {
		delay = delay || 1000; //tries = tries || 5; // defaults
		var timerGroupIndex = timerGroup ? (timerGroup.length > 0 ? timerGroup.length : 0) : null; // get Index for current function timer
		var ID = Math.floor((Math.random() * 9999) + 1000); // random ID for debug
		var startIteration = function(iteration, delay, count, timerGroup, timerGroupIndex) {
			var timer = setTimeout(iteration, delay, ++count); // setTimeout() iteration repeater variable
			if (timerGroup) {timerGroup[timerGroupIndex] = timer;} // add timer to timerGroup
		};
		var clearTimers = function(timerGroup) {
			if (timerGroup) for (var i = 0; i < timerGroup.length; ++i) {clearTimeout(timerGroup[i]);}
		};
		var iteration = function(count) {
			var keepRun = tries ? (count < tries) : true;
			if (keepRun) {
				// alert('count: '+(count+1)+'\ntries: '+tries);
				var result = funcToTest();
				if (result) {clearTimers(timerGroup); return funcToRun();} else startIteration(iteration, delay, count, timerGroup, timerGroupIndex);
				// console.log('ID: '+ID+', try: '+(count+1));
			}
		};
		iteration(0); // 1st iteration
	}
}

String.prototype.capitalize = function() {
	function capFirst(str) {return str.length === 0 ? str : str[0].toUpperCase() + str.substr(1);}
	return this.split(' ').map(capFirst).join(' ');
};

String.prototype.format = function() {
	var args = arguments;
	return this.replace(/{(\d+)}/g, function(match, number) {
		return typeof args[number] != 'undefined' ? args[number]: match;
	});
};

String.prototype.matchLink = function(link, flags) {
	link = link.replace(/[.\/]/g, "\\$&");
	link = link.replace(/\*/g, ".*");
	var re = new RegExp(link, flags);
	return this.match(re);
};

Element.prototype.isVisible = function() {return this.offsetWidth > 0 || this.offsetHeight > 0 || this.getClientRects().length > 0;};

Element.prototype.autoHeight = function(fixedHeight) {
	this.style.height = 0;
	var h = (this.scrollHeight > this.clientHeight) ? (this.scrollHeight) + "px" : "60px";
	this.style.height = h;
	if (fixedHeight) this.style.maxHeight = h;
};

Element.prototype.addClass = function(cssClass) {
	var re = new RegExp("(^|\\s)" + cssClass + "(\\s|$)", "g");
	if (re.test(this.className)) return;
	this.className = (this.className + " " + cssClass).replace(/\s+/g, " ").replace(/(^ | $)/g, "");
};

Element.prototype.removeClass = function(cssClass) {
	var re = new RegExp("(^|\\s)" + cssClass + "(\\s|$)", "g");
	this.className = this.className.replace(re, "$1").replace(/\s+/g, " ").replace(/(^ | $)/g, "");
};

Element.prototype.getComputedProperty = function(propertyName) {return window.getComputedStyle(this, null).getPropertyValue(propertyName);};

Element.prototype.appendElement = function(targetFrame, appendPosition) {
	if (appendPosition == 'after') targetFrame.parentNode.insertBefore(this, targetFrame.nextSibling);
	else if (appendPosition == 'before') targetFrame.parentNode.insertBefore(this, targetFrame);
	else if (!appendPosition || appendPosition == 'append') targetFrame.appendChild(this);
};

Element.prototype.nthParentNode = function(num) {
	var parent = this;
	for (var i = 0; i < num; ++i) {parent = parent.parentNode;}
	return parent;
};

HTMLDocument.prototype.querySelectorAttribute = function(elementSelector, attributeName) {
	var targetElement, attributeValue;
	var targetElementsArray = this.querySelectorAll(elementSelector);
	for (var i = 0; i < targetElementsArray.length; ++i) {
		targetElement = targetElementsArray[i];
		attributeValue = targetElement.getAttribute(attributeName);
		if (attributeValue) break;
	}
	return attributeValue;
};

var getCleanVideo = function(videoSrc, posterSrc) {
	var video = document.createElement('video');
	video.setAttribute('src', videoSrc);
	if (posterSrc) video.setAttribute('poster', posterSrc);
	video.setAttribute('controls', '');
	video.setAttribute('webkitallowfullscreen', '');
	video.setAttribute('mozallowfullscreen', '');
	video.setAttribute('allowfullscreen', '');
	document.documentElement.innerHTML = '';
	document.body.appendChild(video);
	addGlobalStyle('video {position: absolute; width: 100%; height: 100%; max-height: 100%; max-width: 100%; background: black;}');
	addGlobalStyle('body {margin: 0; background: black;}');
	return video;
};

function addMouseWheelAudioControl(media, step) {
	step = (step === 0) ? 0 : (step || 1);
	var fontSize = 72;

	var volumeText = document.createElement('div');
	volumeText.style.setProperty('color', 'yellow', 'important');
	volumeText.style['font-size'] = fontSize + 'px';
	volumeText.style.position = 'absolute';
	volumeText.style['z-index'] = 2147483647; // Always on TOP
	volumeText.style.top = '0px';
	volumeText.style.left = (fontSize/4) + 'px';
	media.parentNode.insertBefore(volumeText, media.nextSibling);

	var mouseWheelAudioHandler = function(e) {
		if (step !== 0) {
			// cross-browser wheel delta
			e = window.event || e; // old IE support
			var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
			var vol =  Math.max(0, Math.min(100, media.volume*100 + delta*step));
			vol = Math.floor(vol/step)*step;
			vol = vol/100;
			media.volume = vol;
		}
		var volumeTextFade = function(fadeDelay) {
			fadeDelay = fadeDelay || 2000;
			var fadeDelaySeconds = Math.floor(fadeDelay/1000);
			function textFadeStart(show) {
				var transition = show ? '' : ('opacity '+fadeDelaySeconds+'s');
				volumeText.style.opacity = show ? 1 : 0;
				volumeText.style.transition = transition;
				volumeText.style['-webkit-transition'] = transition; // Safari
			}
			textFadeStart(true);
			setTimeout(textFadeStart, fadeDelaySeconds*1000);
		};

		volumeTextFade(2000);
		volumeText.textContent = Math.round(media.volume * 100) > 0 ? Math.round(media.volume * 100) : 'Выкл.';

		e.preventDefault();
	};

	if (media.addEventListener) {
		media.addEventListener("mousewheel", mouseWheelAudioHandler, false); // IE9, Chrome, Safari, Opera
		media.addEventListener("DOMMouseScroll", mouseWheelAudioHandler, false); // Firefox
	} else {
		media.attachEvent("onmousewheel", mouseWheelAudioHandler); // IE 6/7/8
	}
}

function msgbox(title, message, time, width, height) {
	width = width || 250;
	height = height || 120;

	var padding = 10;
	var w = width - padding*2,
		h = height - padding*2;

	var centerX = function(e, fix) {
		var transform = e.style.transform;
		transform = transform + (fix ? 'translateY(0.5px) translateX(-50%)' : 'translateX(-50%)');
		e.style.left = 50 + '%';
		e.style['-ms-transform'] = transform;
		e.style['-moz-transform'] = transform;
		e.style['-webkit-transform'] = transform;
		e.style.transform = transform;
	};
	var centerY = function(e, fix) {
		var transform = e.style.transform;
		transform = transform + (fix ? 'translateX(0.5px) translateY(-50%)' : 'translateY(-50%)');
		e.style.top = 50 + '%';
		e.style['-ms-transform'] = transform;
		e.style['-moz-transform'] = transform;
		e.style['-webkit-transform'] = transform;
		e.style.transform = transform;
	};

	var fade = function(element, fadeDelay) {
		fadeDelay = fadeDelay || 2000;
		var fadeDelaySeconds = Math.floor(fadeDelay/1000);
		function fadeStart(show) {
			var transition = show ? '' : ('opacity '+fadeDelaySeconds+'s');
			element.style.opacity = show ? 1 : 0;
			element.style.transition = transition;
			element.style['-webkit-transition'] = transition; // Safari
			if (!show) setTimeout(function(){element.remove();}, fadeDelay);
		}
		fadeStart(true);
		setTimeout(fadeStart, fadeDelaySeconds*1000);
	};

	var d = document.createElement('div');
	d.style.display = 'table';
	d.style.position = 'fixed';
	d.style.right = 10 + 'px';
	d.style.bottom = 10 + 'px';
	d.style.maxWidth = 90 + '%';
	d.style.maxHeight = 90 + '%';
	// d.style.padding = padding + 'px';
	d.style.width = w + 'px';
	d.style.height = 'auto';
	d.style.minHeight = h + 'px';
	d.style.setProperty('background', 'white', 'important');
	d.style.border = '2px solid black';
	d.style.zIndex = 2147483647;
	document.body.appendChild(d);

	// d.style.top = 50 + 'px';
	// centerX(d);

	if (title) {
		var titleElement = document.createElement('p');
		titleElement.style.borderBottom = '1px solid black';
		titleElement.style.margin = 0;
		titleElement.style.padding = (padding/2) + 'px';
		titleElement.style.setProperty('background', '#4CAF50', 'important');
		titleElement.style.setProperty('color', 'white', 'important');
		titleElement.innerText = title;
		d.appendChild(titleElement);
	}

	if (message) {
		var messageElement = document.createElement('p');
		messageElement.style.margin = 0;
		messageElement.style.padding = (padding/2) + 'px';
		messageElement.style.display = 'table-row';
		messageElement.style.textAlign = 'center';
		messageElement.style.verticalAlign = 'middle';
		messageElement.style.setProperty('color', 'black', 'important');
		messageElement.innerText = message;
		d.appendChild(messageElement);
	}

	if (time) fade(d, time);

	return d;
}


var addOpenInNewTabProperty = function(selector) {
	selector = selector || 'a';
	var linksArray = document.querySelectorAll(selector);
	// alert(selector+'\n'+linksArray.length);
	for (var i = 0; i < linksArray.length; ++i) {
		var link = linksArray[i], href = link.href;
		if (href) link.setAttribute('target', '_blank');
	}
};

var addPageControlKeys = function(prevPageSelector, nextPageSelector) {
	var previous_page_btn = document.querySelectorAll(prevPageSelector)[0];
	var next_page_btn = document.querySelectorAll(nextPageSelector)[0];
	var onKeyUp = function(e) {
		e = e || window.event;
		var lArrowKey = 37, rArrowKey = 39;
		var ctrlDown = e.ctrlKey||e.metaKey; // Mac support
		if (e.keyCode == lArrowKey) previous_page_btn.click();
		else if (e.keyCode == rArrowKey) next_page_btn.click();
	};
	window.addEventListener("keyup", function(e){onKeyUp(e);}, false);
};

function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	var expires = "expires="+d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) === 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

function checkCookie() {
	var user = getCookie("username");
	if (user !== "") {
		alert("Welcome again " + user);
	} else {
		user = prompt("Please enter your name:", "");
		if (user !== "" && user !== null) {
			setCookie("username", user, 365);
		}
	}
}

var useVolumeCookie = function(mediaElementSelector, cookieName) {
	cookieName = cookieName || 'media';
	var volumeCookie = cookieName+'Volume';
	var mediaVolume = getCookie(volumeCookie);
	var mutedCookie = cookieName+'Muted';
	var mediaMuted = getCookie(mutedCookie);
	if (mediaMuted == 'false') mediaMuted = false; // normalize
	var mediaElementsArray = document.querySelectorAll(mediaElementSelector);
	for (var i = 0; i < mediaElementsArray.length; ++i) {
		var mediaElement = mediaElementsArray[i];
		if (mediaVolume) mediaElement.volume = mediaVolume;
		mediaElement.muted = mediaMuted;
		mediaElement.addEventListener('volumechange', function() {
			setCookie(volumeCookie, mediaElement.volume || 0, 1);
			setCookie(mutedCookie, mediaElement.muted, 1);
		}, false);
		console.log('mediaElement: ' + mediaElement);
		console.log('volumeCookie: ' + volumeCookie + ' = ' + getCookie(volumeCookie));
		console.log('mutedCookie: ' + mutedCookie + ' = ' + getCookie(mutedCookie));
	}
};

function addHDtext(selector) {
	selector = selector || 'a';
	var linksArray = document.querySelectorAll(selector);
	for (var i = 0; i < linksArray.length; ++i) {
		var link = linksArray[i], thumb = link.parentNode, title = link.title;
		var quality = title ? title.match('(1080)p') || title.match('(720)p') : null;
		if (quality) {
			quality = quality[1];
			var text = document.createElement('div');
			if (quality == '1080') text.style.background = 'rgba(255, 0, 0, 0.15)';
			else if (quality == '720') text.style.background = 'rgba(0, 45, 255, 0.25)';
			text.style.zIndex = '10000';
			text.style.position = 'inherit';
			text.style.width = 'auto';
			text.style.height = '20px';
			text.style.float = 'right';
			text.style.color = 'rgba(0, 253, 255, 0)';
			text.style.padding = '0px 2px';
			text.style.border = '1px solid rgba(255,255,255,0.2)';
			text.innerText = quality+'p';
			thumb.appendChild(text);
			// thumb.appendChild(document.createTextNode("HD"));
		}
	}
}

function downloadFile(filename, text) {
	var a = document.createElement('a');
	a.setAttribute('download', filename);
	a.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));

	/* //noinspection JSDeprecatedSymbols
    var base64doc = btoa(unescape(encodeURIComponent(text)));
    a.setAttribute('href', 'data:text/html;base64,' + base64doc); */

	if (document.createEvent) {
		var event = document.createEvent('MouseEvents'); // document.createEvent("HTMLEvents");
		event.initEvent('click', true, true);
		a.dispatchEvent(event);
	} else {
		a.click();
	}
}

function recreateNode(el, withChildren) {
	if (withChildren) {
		el.parentNode.replaceChild(el.cloneNode(true), el);
	} else {
		var newEl = el.cloneNode(false);
		while (el.hasChildNodes()) newEl.appendChild(el.firstChild);
		el.parentNode.replaceChild(newEl, el);
	}
}

function inIframe() {
	var inIframe = window.self !== window.top;
	console.log('inIframe: '+inIframe);
	return inIframe;
}

/* To Title Case 2.1 – http://individed.com/code/to-title-case/
* Copyright © 2008–2013 David Gouch. Licensed under the MIT License. */

String.prototype.toTitleCase = function(lower) {
	var string = lower ? this.toLowerCase() : this;
	var smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i;

	return string.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, function(match, index, title) {
		if (index > 0 && index + match.length !== title.length &&
			match.search(smallWords) > -1 && title.charAt(index - 2) !== ":" &&
			(title.charAt(index + match.length) !== '-' || title.charAt(index - 1) === '-') &&
			title.charAt(index - 1).search(/[^\s-]/) < 0) {
			return match.toLowerCase();
		}

		if (match.substr(1).search(/[A-Z]|\../) > -1) {
			return match;
		}

		return match.charAt(0).toUpperCase() + match.substr(1);
	});
};
