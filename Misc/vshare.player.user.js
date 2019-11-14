// ==UserScript==
// @name         vshare.player
// @icon         https://www.google.com/s2/favicons?domain=vshare.io
// @version      0.0.15
// @description  Pure JavaScript version.
// @author       Ægir
// @namespace    complete.misc
/// @grant       none
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @run-at       document-end
// @downloadURL  https://github.com/Qetuoadgj/JavaScript/raw/master/Misc/vshare.player.user.js
// @homepageURL  https://github.com/Qetuoadgj/JavaScript/tree/master/Misc
// @match        *://vshare.io/v/404/*
/// @match        *://*/v/404/*
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var G_USE_AS_EXTENSION = typeof GM == 'undefined';
    console.log('G_USE_AS_EXTENSION:', G_USE_AS_EXTENSION);

    // https://vshare.io/v/404/https://s902.vshare.io:440/s,128-1000-22-1-2191707-bkxdtksrwj/186745/351673/185658/ff-8840c3e48fc8f80f67eeacc4b3fc3cdbb94c86b4,5c584cc5,2f23e49_480.mp4
    window.stop();
    // ---------------------------------------------------
    function removeEventListeners(elementSelector) {
        var elementsArray = document.querySelectorAll(elementSelector);
        for (var i = 0; i < elementsArray.length; i++) {
            var element = elementsArray[i];
            element.outerHTML = element.outerHTML;
        };
    }
    removeEventListeners('head');
    removeEventListeners('body');
    // ---------------------------------------------------
    function removeElement(elementSelector) {
        var elementsArray = document.querySelectorAll(elementSelector);
        for (var i = 0; i < elementsArray.length; i++) {
            var element = elementsArray[i];
            element.remove();
        };
    }
    removeElement('head'); // document.querySelector('head').remove();
    removeElement('body'); // document.querySelector('body').remove();
    var head = document.createElement('head'); document.documentElement.appendChild(head);
    var body = document.createElement('body'); document.documentElement.appendChild(body);
    // ---------------------------------------------------
    function addGlobalStyle(css, cssClass) {
        var head = document.getElementsByTagName('head')[0]; if (!head) { return; }
        var style = document.createElement('style'); style.type = 'text/css'; style.innerHTML = css;
        if (cssClass) style.setAttribute('class', cssClass);
        head.appendChild(style);
    }
    function prettyPrint(string) {
        return string.replace(/\{/g, '{\n\t').replace(/;\s+/g, ';\n\t').replace(/\}/g, '\n}').replace(/}([^\s]+)/g, '}\n$1');
    }
    // /*
    addGlobalStyle(
        prettyPrint(
            'body {position: absolute; width: 100%; height: 100%; overflow: hidden; padding: 0px; margin: 0px; top: 0px; left: 0px;}' +
            'video {position: absolute; width: 100%; height: 100%; max-height: 100%; max-width: 100%; background: black; padding: 0px; margin: 0px; top: 0px; left: 0px; background: black;}'
        ),
        'pageStyle'
    )
    // */
    // ---------------------------------------------------
    function failed(e) {
        // video playback failed - show a message saying why
        switch (e.target.error.code) {
            case e.target.error.MEDIA_ERR_ABORTED:
                console.log('You aborted the video playback.');
                break;
            case e.target.error.MEDIA_ERR_NETWORK:
                console.log('A network error caused the video download to fail part-way.');
                break;
            case e.target.error.MEDIA_ERR_DECODE:
                console.log('The video playback was aborted due to a corruption problem or because the video used features your browser did not support.');
                break;
            case e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                console.log('The video could not be loaded, either because the server or network failed or because the format is not supported.');
                break;
            default:
                console.log('An unknown error occurred.');
                break;
        };
    };
    // ---------------------------------------------------
    var html = [
        // `<!DOCTYPE html>`,
        `<html>`,
        `    <head>`,
        `        <meta charset="UTF-8">`,
        `        <meta name="viewport" content="width=device-width, initial-scale=1">`,
        // `        <link rel="stylesheet" href="player.css">`,
        `        <title>HTML5 Custom Video Player</title>`,
        `    </head>`,
        `    <body>`,
        `        <div class="player">`,
        `            <!-- <video class="player-video" src="https://hunzaboy.github.io/Ckin-Video-Player/ckin.mp4"></video> -->`,
        `            <!-- <video class="player-video" src="https://s14-n5-nl-cdn.eporner.com/f52e6d9176f8487ece155009451283fa/5dccc140010600/1101004-480p.mp4"></video> -->`,
        `            <video class="player-video"></video>`,
        `            <div class="player-controls">`,
        `                <div class="progress">`,
        `                    <div class="progress-background">`,
        `                        <span class="current-time">00:00</span>`,
        `                        <video class="progress-thumbnail"></video>`,
        `                    </div>`,
        `                    <div class="filled-buffer"></div>`,
        `                    <div class="filled-progress"></div>`,
        `                </div>`,
        `                <div class="ply-btn">`,
        `                    <button class="player-btn toggle-play" title="Toggle Play">`,
        `                        <!-- <svg class="" width="16" height="16" viewBox="0 0 16 16"><title>play</title><path d="M3 2l10 6-10 6z"></path></svg> -->`,
        `                        <svg class="" width="16" height="16" viewBox="0 0 16 16"><title>play</title><polygon points="0 0 0 16 16 8"></polygon></svg>`,
        `                    </button>`,
        `                </div>`,
        `                <span class="current-time-display">00:00</span>`,
        `                <div class="audio">`,
        `                    <div class="speaker"><span></span></div>`,
        `                    <input type="range" name="volume" class="player-slider" min="0" max="1" step="0.05" value="1">`,
        `                </div>`,
        `                <div class="sliders">`,
        `                    <!-- <input type="range" name="volume" class="player-slider" min="0" max="1" step="0.05" value="1"> -->`,
        `                    <input type="range" name="playbackRate" class="player-slider" min="0.5" max="2" step="0.1" value="1">`,
        `                </div>`,
        `                <button data-skip="-10" class="player-btn skip">- 10s</button>`,
        `                <button data-skip="10" class="player-btn skip">+ 10s</button>`,
        `            </div>`,
        `        </div>`,
        // `        <script src="player.js"></script>`,
        `    </body>`,
        `</html>`,
    ].join('\n');
    document.documentElement.innerHTML = html;
    // ---------------------------------------------------
    var css = [
        `body {`,
        `    align-items: center;`,
        `    background: #000046;`,
        `    background: linear-gradient(to right, #1CB5E0, #000046);`,
        `    display: flex;`,
        `    height: 100vh;`,
        `    justify-content: center;`,
        `    margin: 0;`,
        `    padding: 0;`,
        `}`,
        ``,
        `.player {`,
        `    max-width: 800px;`,
        `    border: 6px solid rgba(255, 255, 255, 0.2);`,
        `    box-shadow: 0 0 25px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.1);`,
        `    position: relative;`,
        `    overflow: hidden;`,
        `}`,
        `.player:hover .progress {`,
        `    height: 10px;`,
        `}`,
        `.player:hover .player-controls {`,
        `    -webkit-transform: translateY(0);`,
        `    transform: translateY(0);`,
        `}`,
        ``,
        `.player:-webkit-full-screen,`,
        `.player:-webkit-full-screen {`,
        `    max-width: none;`,
        `    width: 100%;`,
        `}`,
        ``,
        `.player:-webkit-full-screen,`,
        `.player:fullscreen {`,
        `    max-width: none;`,
        `    width: 100%;`,
        `}`,
        ``,
        `.play-btn {`,
        `    flex: 1;`,
        `}`,
        ``,
        `.player-video {`,
        `    width: 100%;`,
        `    display: block;`,
        `}`,
        ``,
        `.player-btn {`,
        `    background: none;`,
        `    border: 0;`,
        `    color: white;`,
        `    text-align: center;`,
        `    max-width: 60px;`,
        `    padding: 5px 8px;`,
        `}`,
        `.player-btn svg {`,
        `    fill: #FFFFFF;`,
        `}`,
        `.player-btn:hover, .player-btn:focus {`,
        `    border-color: #FFEC41;`,
        `    background: rgba(255, 255, 255, 0.2);`,
        `}`,
        ``,
        `.player-slider {`,
        `    width: 10px;`,
        `    height: 30px;`,
        `}`,
        ``,
        `.player-controls {`,
        `    align-items: center;`,
        `    display: flex;`,
        `    position: absolute;`,
        `    bottom: 0;`,
        `    width: 100%;`,
        `    -webkit-transform: translateY(100%) /*translateY(-5px)*/;`,
        `    transform: translateY(100%) /*translateY(-5px)*/;`,
        `    transition: all 0.3s;`,
        `    flex-wrap: wrap;`,
        `    background: rgba(0, 0, 0, 0.3);`,
        `    height: 60px;`,
        `}`,
        ``,
        `.player-controls > * {`,
        `    flex: 1;`,
        `}`,
        ``,
        `.progress {`,
        `    position: relative;`,
        `    display: flex;`,
        `    flex: 10;`,
        `    flex-basis: 100%;`,
        `    height: 4px;`,
        `    transition: height 0.3s;`,
        `    background: rgba(0, 0, 0, 0.5);`,
        `    top: -6px;`,
        `}`,
        ``,
        `.filled-progress {`,
        `    width: 50%;`,
        `    background: #FFEC41;`,
        `    flex: 0;`,
        `    flex-basis: 50%;`,
        `}`,
        ``,
        `.sliders {`,
        `    max-width: 200px;`,
        `    display: flex;`,
        `}`,
        ``,
        `input[type=range] {`,
        `    -webkit-appearance: none;`,
        `    background: transparent;`,
        `    width: 100%;`,
        `    margin: 0 5px;`,
        `}`,
        ``,
        `input[type=range]:focus {`,
        `    outline: none;`,
        `}`,
        ``,
        `input[type=range]::-webkit-slider-runnable-track {`,
        `    width: 100%;`,
        `    height: 8px;`,
        `    cursor: pointer;`,
        `    box-shadow: 1px 1px 1px rgba(0, 0, 0, 0), 0 0 1px rgba(13, 13, 13, 0);`,
        `    background: rgba(255, 255, 255, 0.5);`,
        `    border-radius: 10px;`,
        `    border: 0.2px solid rgba(1, 1, 1, 0);`,
        `}`,
        ``,
        `input[type=range]::-webkit-slider-thumb {`,
        `    height: 15px;`,
        `    width: 15px;`,
        `    border-radius: 50px;`,
        `    background: white;`,
        `    cursor: pointer;`,
        `    -webkit-appearance: none;`,
        `    margin-top: -3.5px;`,
        `    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);`,
        `}`,
        ``,
        `input[type=range]:focus::-webkit-slider-runnable-track {`,
        `    background: rgba(255, 255, 255, 0.8);`,
        `}`,
        ``,
        `input[type=range]::-moz-range-track {`,
        `    width: 100%;`,
        `    height: 8px;`,
        `    cursor: pointer;`,
        `    box-shadow: 1px 1px 1px rgba(0, 0, 0, 0), 0 0 1px rgba(13, 13, 13, 0);`,
        `    background: #ffffff;`,
        `    border-radius: 10px;`,
        `    border: 0.2px solid rgba(1, 1, 1, 0);`,
        `}`,
        ``,
        `input[type=range]::-moz-range-thumb {`,
        `    box-shadow: 0 0 3px rgba(0, 0, 0, 0), 0 0 1px rgba(13, 13, 13, 0);`,
        `    height: 15px;`,
        `    width: 15px;`,
        `    border-radius: 50px;`,
        `    background: white;`,
        `    cursor: pointer;`,
        `}`,
        ``,
        `/* ----------------------------------- */`,
        ``,
        `.player, .player-video {`,
        `    max-width: 100%;`,
        `    max-height: 100%;`,
        `    height: 100%;`,
        `    width: 100%;`,
        `    box-shadow: none;`,
        `    border: none;`,
        `}`,
        `body {`,
        `    margin: 0;`,
        `    padding: 0;`,
        `    background: #000;`,
        `}`,
        `.progress {`,
        `    height: 4px;`,
        `    cursor: pointer;`,
        `}`,
        `.player:hover .progress {`,
        `    height: 8px;`,
        `}`,
        `.filled-progress {`,
        `    width: 0%;`,
        `    flex-basis: 0%;`,
        `    background: #FF0000;`,
        `}`,
        ``,
        `/*`,
        `    .player .player-controls {`,
        `    -webkit-transform: translateY(0);`,
        `    transform: translateY(0);`,
        `    }`,
        `*/`,
        ``,
        `input[type=range]::-webkit-slider-runnable-track {`,
        `    height: 2px;`,
        `    border-radius: 1px;`,
        `}`,
        `input[type=range]::-webkit-slider-thumb {`,
        `    height: 16px;`,
        `    width: 16px;`,
        `    margin-top: -7px;`,
        `}`,
        `.progress .progress-background {`,
        `    visibility: hidden;`,
        `    height: 60px;`,
        `    width: 100%;`,
        `    background: none;`,
        `    display: block;`,
        `    position: fixed;`,
        `    top: -60px;`,
        `    `,
        `    font-family: 'Arial', Arial, Sans-serif;`,
        `    font-size: 14px;`,
        `    color: #FFFFFF;`,
        `    `,
        `    min-width: 10%;`,
        `    max-width: 90%;`,
        `}`,
        `.progress:hover .progress-background {`,
        `    visibility: visible;`,
        `}`,
        `.progress-background .current-time {`,
        `    heigh: 30px;`,
        `    width: auto;`,
        `    background: rgba(0, 0, 0, 0.5);`,
        `    display: block;`,
        `    position: absolute;`,
        `    bottom: 1px;`,
        `    right: 0;`,
        `    transform: translateX(50%);`,
        `    padding: 2px 4px;`,
        `    border-radius: 4px;`,
        `    z-index: 0;`,
        `}`,
        ``,
        `.progress-background .progress-thumbnail {`,
        `    display: block;`,
        `    position: absolute;`,
        `    height: 90px;`,
        `    width: 150px;`,
        `    background: #000;`,
        `    bottom: 22px;`,
        `    right: 0;`,
        `    transform: translateX(50%);`,
        `    padding: 0px;`,
        `    z-index: -1;`,
        `    border: 1px solid rgba(32, 32, 32, 0.5);`,
        `}`,
        ``,
        `.player .progress {`,
        `    background: rgba(255, 255, 255, 0.1);`,
        `}`,
        ``,
        `.player-slider[name='playbackRate'] {`,
        `    display: none;`,
        `}`,
        `.sliders {`,
        `    max-width: 120px;`,
        `}`,
        ``,
        `.ply-btn {`,
        `    width: 40px;`,
        `    max-width: 40px;`,
        `}`,
        ``,
        `.current-time-display {`,
        `    color: white;`,
        `}`,
        ``,
        `/* ----------------------------------- */`,
        ``,
        `.audio {`,
        `    display: flex;`,
        `}`,
        `.speaker {`,
        `    height: 30px;`,
        `    width: 30px;`,
        `    max-width: 30px;`,
        `    position: relative;`,
        `    overflow: hidden;`,
        `    display: inline-block;`,
        `    /* background: red; */`,
        `    margin: 0px 5px;`,
        `    left: 0px;`,
        `    /* top: 2px; */`,
        `}`,
        `.speaker span {`,
        `    display: inherit;`,
        `    width: 8px;`,
        `    height: 8px;`,
        `    background: #fff;`,
        `    margin: 11px 0 0 2px;`,
        `}`,
        `.speaker span:after {`,
        `    content: '';`,
        `    position: absolute;`,
        `    width: 0;`,
        `    height: 0;`,
        `    border-style: solid;`,
        `    border-color: transparent #fff transparent transparent;`,
        `    border-width: 10px 14px 10px 15px;`,
        `    left: -13px;`,
        `    top: 5px;`,
        `}`,
        `.speaker span:before {`,
        `    transform: rotate(45deg);`,
        `    border-radius: 0 50px 0 0;`,
        `    content: '';`,
        `    position: absolute;`,
        `    width: 5px;`,
        `    height: 5px;`,
        `    border-style: double;`,
        `    border-color: #fff;`,
        `    border-width: 7px 7px 0 0;`,
        `    left: 18px;`,
        `    top: 9px;`,
        `    transition: all 0.2s ease-out;`,
        `}`,
        `.speaker:hover span:before {`,
        `    transform: scale(0.8) translate(-3px, 0) rotate(42deg);`,
        `}`,
        `.speaker.mute span:before {`,
        `    transform: scale(0.5) translate(-15px, 0) rotate(36deg);`,
        `    opacity: 0;`,
        `}`,
        ``,
        `input[type=range] {`,
        `    -webkit-appearance: none;`,
        `    background: transparent;`,
        `    width: 100px;`,
        `    /* width: 0; */`,
        `    /* margin: 0 5px; */`,
        `    /* display: flex; */`,
        `    /* left: 40px; */`,
        `    position: relative;`,
        `    /* top: 2px; */`,
        `}`,
        ``,
        `.audio input {`,
        `    display: none;`,
        `}`,
        `.audio:hover input {`,
        `    display: inline-block;`,
        `    width: 100px;`,
        `}`,
        ``,
        `/* ----------------------------------- */`,
        ``,
        `.ply-btn {`,
        `    width: 40px;`,
        `    max-width: 40px;`,
        `    display: contents;`,
        `}`,
        ``,
        `.current-time-display {`,
        `    color: white;`,
        `    /* max-width: 118px; */`,
        `    display: contents;`,
        `}`,
        ``,
        `/* ----------------------------------- */`,
        ``,
        `.progress {`,
        `    height: 6px;`,
        `    top: 0px;`,
        `    position: absolute;`,
        `    width: 100%;`,
        `}`,
        `.player:hover .progress {`,
        `    height: 6px;`,
        `}`,
        `/* ----------------------------------- */`,
        ``,
        `.filled-progress, .filled-buffer {`,
        `    flex: 0;`,
        `    position: absolute;`,
        `    background: #FFEC41;`,
        `    height: 100%;`,
        `    width: 50%;`,
        `    flex-basis: 50%;`,
        `}`,
        ``,
        `.filled-buffer {`,
        `    background: #FFFF00;`,
        `    flex-basis: 75%;`,
        `    width: 75%;`,
        `    opacity: 0.2;`,
        `}`,
        `/**/`,
        `.filled-progress, .filled-buffer {`,
        `    width: 0%;`,
        `    flex-basis: 0%;`,
        `}`,
        `/**/`,
        `.filled-progress {`,
        `    background: #FF0000;`,
        `}`,
        ``,
        `/* ----------------------------------- */`,
        ``,
        `.player-btn {`,
        `    margin: 5px;`,
        `}`,
        ``,
        `/* ----------------------------------- */`,
        ``,
        `.progress-background *, .filled-progress, .filled-buffer {`,
        `    pointer-events: none;`,
        `}`,
    ].join('\n');
    addGlobalStyle(css, 'playerStyle_1');
    // ---------------------------------------------------
    /*
	Let's Build: With JavaScript - Web-Crunch.com
	Subscribe on YouTube - https://youtube.com/c/webcrunch
	Let's Build: HTML5 Video Player
	Overall Concept Credit: Wes Bos https://wesbos.com
    */
    const player = document.querySelector('.player');
    const video = player.querySelector('.player-video');
    const progress = player.querySelector('.progress');
    const progressFilled = player.querySelector('.filled-progress');
    const toggle = player.querySelector('.toggle-play');
    const skippers = player.querySelectorAll('[data-skip]');
    const ranges = player.querySelectorAll('.player-slider');

    // Logic
    function togglePlay() {
        const playState = video.paused ? 'play' : 'pause';
        let promise = video[playState](); // Call play or paused method
        if (promise !== undefined) {
            promise.then(_ => {
                // Autoplay started!
            }).catch(error => {
                // Autoplay was prevented.
            });
        };
    }

    function updateButton() {
        const togglePlayBtn = document.querySelector('.toggle-play');
        if(this.paused) {
            // togglePlayBtn.innerHTML = `<svg class="" width="16" height="16" viewBox="0 0 16 16"><title>play</title><path d="M3 2l10 6-10 6z"></path></svg>`;
            togglePlayBtn.innerHTML = `<svg class="" width="16" height="16" viewBox="0 0 16 16"><title>play</title><polygon points="0 0 0 16 16 8"></polygon></svg>`;
            // togglePlayBtn.classList.remove('pause-btn');
            // togglePlayBtn.classList.add('play-btn');
        }
        else {
            // togglePlayBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16"><title>pause</title><path d="M2 2h5v12H2zm7 0h5v12H9z"></path></svg>`;
            togglePlayBtn.innerHTML = `<svg class="" width="16" height="16" viewBox="0 0 16 16"><title>pause</title><polygon points="0 0 0 16 5 16 5 0"></polygon><polygon points="16 0 16 16 11 16 11 0"></polygon></svg>`;
            // togglePlayBtn.classList.remove('play-btn');
            // togglePlayBtn.classList.add('pause-btn');
        }
    }

    function skip() {
        video.currentTime += parseFloat(this.dataset.skip);
    }

    function rangeUpdate() {
        video[this.name] = this.value;
    }

    const toggleMuteBtn = document.querySelector('.speaker');
    function updateMuteButton() {
        if(video.muted) {
            toggleMuteBtn.classList.add('mute');
        }
        else {
            toggleMuteBtn.classList.remove('mute');
        }
    }

    video.addEventListener("volumechange", function(e) {
        const slider = document.querySelector('input[name="volume"]');
        slider.value = video.volume;
        updateMuteButton();
    }, false);

    const currentTimeDisplay = document.querySelector('.current-time-display');
    video.addEventListener('loadedmetadata', () => {currentTimeDisplay.innerText = toHHMMSS(0) + "/" + toHHMMSS(video.duration);});

    const bufferFilled = player.querySelector('.filled-buffer');

    function bufferUpdate() {
        const timeRanges = video.buffered;
        const currentTime = video.currentTime;
        var curTimeRange = 0;
        for (var i = 0; i < timeRanges.length; i++) {
            let end = timeRanges.end(i);
            let start = timeRanges.start(i);
            if (currentTime >= start && currentTime <= end) {
                curTimeRange = end;
                break;
            }
        }
        // console.log(currentTime, curTimeRange, timeRanges.length);
        const percent = (curTimeRange / video.duration) * 100;
        bufferFilled.style.flexBasis = `${percent}%`;
        bufferFilled.style.width = `${percent}%`;
    }

    function progressUpdate() {
        const percent = (video.currentTime / video.duration) * 100;
        progressFilled.style.flexBasis = `${percent}%`;
        progressFilled.style.width = `${percent}%`;
        currentTimeDisplay.innerText = toHHMMSS(video.currentTime) + "/" + toHHMMSS(video.duration);
        bufferUpdate();
    }

    video.addEventListener('loadedmetadata', progressUpdate);

    function scrub(e) {
        const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
        video.currentTime = Math.round(scrubTime || 0); // scrubTime;
    }

    function toggleMute(e) {
        e.preventDefault();
        video.muted = !video.muted;
    }

    toggleMuteBtn.addEventListener('click', toggleMute);

    // Event listeners

    video.addEventListener('click', togglePlay);
    video.addEventListener('play', updateButton);
    video.addEventListener('pause', updateButton);
    video.addEventListener('timeupdate', progressUpdate);

    video.addEventListener('load', rangeUpdate);

    toggle.addEventListener('click', togglePlay);
    skippers.forEach(button => button.addEventListener('click', skip));
    ranges.forEach(range => range.addEventListener('change', rangeUpdate));
    ranges.forEach(range => range.addEventListener('mousemove', rangeUpdate));

    let mousedown = false;
    progress.addEventListener('click', scrub);
    progress.addEventListener('mousemove', (e) => {mousedown && scrub(e)});
    progress.addEventListener('mousedown', () => {mousedown = true});
    progress.addEventListener('mouseup', () => {mousedown = false});

    function toHHMMSS(secs = 0) {
        const sec_num = parseInt(secs, 10);
        const hours = Math.floor(sec_num / 3600) % 24;
        const minutes = Math.floor(sec_num / 60) % 60;
        const seconds = sec_num % 60;
        return [hours,minutes,seconds].map(v => v < 10 ? "0" + v : v).filter((v, i) => v !== "00" || i > 0).join(":");
    };

    function scrub2(e, el) {
        const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
        const percent = (e.offsetX / progress.offsetWidth) * 100;
        el.style.width = `${percent}%`;
        return {
            percent: percent,
            currentTime: Math.round(scrubTime)
        };
    }

    const progressBackground = player.querySelector('.progress-background');
    const currentTime = player.querySelector('.current-time');
    progress.addEventListener('mousemove', function (e) {
        let ret = scrub2(e, progressBackground);
        currentTime.innerText = toHHMMSS(ret.currentTime);
        displayThumb(ret.currentTime);
    });

    var timeLast = 0;
    const progressThumbnail = player.querySelector('.progress-thumbnail');
    function displayThumb(time) {
        // console.log(time, timeLast, Math.abs(time - timeLast));
        if ((Math.abs(time - timeLast)) < 2) return;
        timeLast = time;
        let url = video.currentSrc.replace(/#t=\d+\b/ig, '') + "#t=" + time;
        progressThumbnail.src = url;
    }
    // ---------------------------------------------------
    /*
    // ---------------------------------------------------
    var video = document.createElement('video');
    video.addEventListener('error', failed);
    video.setAttribute('id', 'cleaned_video');
    video.setAttribute('preload', 'metadata'); // none
    video.setAttribute('controls', '');
    video.setAttribute('webkitallowfullscreen', '');
    video.setAttribute('mozallowfullscreen', '');
    video.setAttribute('allowfullscreen', '');
    // video.setAttribute('onerror', 'failed(event);');
    // video.setAttribute('src', '');
    document.body.appendChild(video);
    // video.src = 'https://s902.vshare.io:440/s,128-1000-22-1-2191707-bkxdtksrwj/186745/351673/185658/ff-8840c3e48fc8f80f67eeacc4b3fc3cdbb94c86b4,5c584cc5,2f23e49_480.mp4';
    // ---------------------------------------------------
    */
    function initPlayer() {
        // console.clear();

        var paramStart, pageDomain;
        if (G_USE_AS_EXTENSION) {
            paramStart = /^.*?player\.html#/;
        }
        else {
            pageDomain = location.host.replace(/.*\.(.*\..*)/, '$1');
            paramStart = location.protocol + '//' + pageDomain + '/v/404/';
        };

        console.log('location.href: ' + location.href);
        console.log('paramStart: ' + paramStart);

        function shiftKeyIsDown() {return !!window.event.shiftKey;}
        function ctrlKeyIsDown() {return !!(window.event.ctrlKey || window.event.metaKey);}
        function altKeyIsDown() {return !!window.event.altKey;}

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

        /*
        var toHHMMSS = function(secs) {
            var sec_num = parseInt(secs, 10);
            var hours = Math.floor(sec_num / 3600) % 24;
            var minutes = Math.floor(sec_num / 60) % 60;
            var seconds = sec_num % 60;
            return [hours,minutes,seconds].map(v => v < 10 ? "0" + v : v).filter((v,i) => v !== "00" || i > 0).join(":");
        };
        */

        function addMediaTextIndicator(media, fontSize) {
            fontSize = fontSize || 72;
            var mediaTextIndicator = document.createElement('div');
            mediaTextIndicator.style.setProperty('color', 'yellow', 'important');
            mediaTextIndicator.style['font-size'] = fontSize + 'px';
            mediaTextIndicator.style.position = 'absolute';
            mediaTextIndicator.style['z-index'] = 2147483647; // Always on TOP
            mediaTextIndicator.style.top = '0px';
            mediaTextIndicator.style.left = (fontSize/4) + 'px';
            media.parentNode.insertBefore(mediaTextIndicator, media.nextSibling);
            var volumeTextFade = function(fadeDelay) {
                fadeDelay = fadeDelay || 2000;
                var fadeDelaySeconds = Math.floor(fadeDelay/1000);
                function textFadeStart(show) {
                    var transition = show ? '' : ('opacity '+fadeDelaySeconds+'s');
                    mediaTextIndicator.style.opacity = show ? 1 : 0;
                    mediaTextIndicator.style.transition = transition;
                    mediaTextIndicator.style['-webkit-transition'] = transition; // Safari
                }
                textFadeStart(true);
                setTimeout(textFadeStart, fadeDelaySeconds*1000);
            };
            var setVolumeText = function() {
                volumeTextFade(2000);
                mediaTextIndicator.textContent = Math.round(media.volume * 100) > 0 ? Math.round(media.volume * 100) : 'Выкл.';
            };
            var setTimeText = function() {
                volumeTextFade(2000);
                var duration = media.duration;
                var currentTime = media.currentTime;
                mediaTextIndicator.textContent = (toHHMMSS(currentTime) + "/" + toHHMMSS(duration));
            };
            var addEventHandlers = function() {
                if (media.addEventListener) {
                    media.addEventListener("volumechange", setVolumeText, false); // IE9, Chrome, Safari, Opera
                    media.addEventListener("seeking", setTimeText, false); // IE9, Chrome, Safari, Opera
                }
                else {
                    media.attachEvent("onvolumechange", setVolumeText); // IE 6/7/8
                    media.attachEvent("onseeking", setTimeText); // IE 6/7/8
                }
            };
            setTimeout(addEventHandlers, 10);
            return mediaTextIndicator;
        }

        var mediaKeyboardControls = function(media) {
            var onKeyDown = function(e) {
                e = e || window.event;
                var lArrow = 37, rArrow = 39, kSpace = 32;
                var ctrlDown = e.ctrlKey || e.metaKey; // Mac support
                var mediaState = media.paused ? 0 : 1;
                setTimeout(function() {
                    if (e.keyCode == lArrow) {
                        media.pause(); media.currentTime = parseInt(media.currentTime) - 5; if (mediaState == 1) media.play();
                    }
                    else if (e.keyCode == rArrow) {
                        media.pause(); media.currentTime = parseInt(media.currentTime) + 5; if (mediaState == 1) media.play();
                    }
                    else if (e.keyCode == kSpace) {
                        if (mediaState == 1) media.pause(); else media.play();
                    }
                }, 10);
                e.preventDefault();
            };
            window.addEventListener("keydown", function(e){onKeyDown(e);}, false);
        };

        function mediaMouseControls(media, step) {
            step = (step === 0) ? 0 : (step || 1);
            var mouseWheelAudioHandler = function(e) {
                if (step !== 0) {
                    // cross-browser wheel delta
                    e = window.event || e; // old IE support
                    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
                    var amount = parseInt(delta*step), volume = parseInt(media.volume*100);
                    var value = amount > 0 ? Math.floor((volume+amount)/step)*step : Math.ceil((volume+amount)/step)*step;
                    media.volume = Math.max(0, Math.min(100, value)) / 100;
                }
                e.preventDefault();
            };
            var mouseWheelTimeHandler = function(e) {
                if (step !== 0) {
                    // cross-browser wheel delta
                    e = window.event || e; // old IE support
                    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
                    var amount = parseInt(delta*step);
                    var mediaState = media.paused ? 0 : 1;
                    setTimeout(function() {
                        if (delta < 0) {
                            media.pause(); media.currentTime = parseInt(media.currentTime) - 5; if (mediaState == 1) media.play();
                        }
                        else if (delta > 0) {
                            media.pause(); media.currentTime = parseInt(media.currentTime) + 5; if (mediaState == 1) media.play();
                        }
                    }, 10);
                }
                e.preventDefault();
            };
            var mouseWheelHandler = function(e) {
                if (shiftKeyIsDown()) {
                    mouseWheelAudioHandler(e);
                }
                else {
                    mouseWheelTimeHandler(e);
                }
            };
            if (media.addEventListener) {
                media.addEventListener("mousewheel", mouseWheelHandler, false); // IE9, Chrome, Safari, Opera
                media.addEventListener("DOMMouseScroll", mouseWheelHandler, false); // Firefox
            }
            else {
                media.attachEvent("onmousewheel", mouseWheelAudioHandler); // IE 6/7/8
            }
            var mediaTextIndicator = addMediaTextIndicator(media, 56);
        }

        // Convert search param string into an object or array
        // '?startIndex=1&pageSize=10' -> {startIndex: 1, pageSize: 10}
        function processSearchParams(search, preserveDuplicates) {
            //  option to preserve duplicate keys (e.g. 'sort=name&sort=age')
            preserveDuplicates = preserveDuplicates || false; // disabled by default

            var outputNoDupes = {};
            var outputWithDupes = []; // optional output array to preserve duplicate keys

            //  sanity check
            if(!search) throw new Error('processSearchParams: expecting "search" input parameter');

            //  remove ? separator (?foo=1&bar=2 -> 'foo=1&bar=2')
            search = search.split('?')[1];

            //  split apart keys into an array ('foo=1&bar=2' -> ['foo=1', 'bar=2'])
            search = search.split('&');

            //  separate keys from values (['foo=1', 'bar=2'] -> [{foo:1}, {bar:2}])
            //  also construct simplified outputObj
            outputWithDupes = search.map(function(keyval){
                var out = {};
                keyval = keyval.split('=');
                out[keyval[0]] = keyval[1];
                outputNoDupes[keyval[0]] = keyval[1]; //  might as well do the no-dupe work too while we're in the loop
                return out;
            });

            return (preserveDuplicates) ? outputWithDupes : outputNoDupes;
        }

        // Break apart any path into parts
        // 'http://example.com:12345/blog/foo/bar?startIndex=1&pageSize=10' ->
        //     {
        //     "host": "example.com",
        //     "port": "12345",
        //     "search": {
        //         "startIndex": "1",
        //         "pageSize": "10"
        //     },
        //     "path": "/blog/foo/bar",
        //     "protocol": "http:"
        // }
        function getPathInfo(path) {
            //  create a link in the DOM and set its href
            var link = document.createElement('a');
            link.setAttribute('href', path);

            //  return an easy-to-use object that breaks apart the path
            return {
                host:     link.hostname, // 'example.com'
                port:     link.port, // 12345
                search:   processSearchParams(link.search || '?'), // {startIndex: 1, pageSize: 10}
                path:     link.pathname, // '/blog/foo/bar'
                protocol: link.protocol // 'http:'
            };
        }

        function getDomain(url, subdomain) {
            subdomain = subdomain || false;
            url = url.replace(/(https?:\/\/)?(www.)?/i, '');
            url = url.replace(/(.*?)\/.*/i, '$1');
            if (!subdomain) {
                url = url.split('.');
                url = url.slice(url.length - 2).join('.');
            }
            if (url.indexOf('/') !== -1) {
                return url.split('/')[0];
            }
            return url;
        }

        var mediaShowInfoBox = function(media) {
            var hosts = {
                "oloadcdn.net" : "openload.co",
                "phncdn.com" : "pornhub.com",
                "t8cdn.com" : "tube8.com",
                "playercdn.net" : "bitporno.com",
                "ahcdn.com" : "txxx.com | porndig.com",
                "userscontent.net" : "playvids.com",
                "trafficdeposit.com" : "yourporn.sexy",
                "cdnity.net" : "yourporn.sexy",
            };
            var showMsgBox = function(media) {
                var width = media.videoWidth, height = media.videoHeight;
                // console.log('media: '+media.src+' ['+width+'x'+height+']');
                var host = getPathInfo(media.src).host.replace(/^www\./, ''); // getDomain(media.src);
                host = hosts[host] ? host + '\n['+hosts[host]+']' : host;
                var msg = msgbox('Video', (width+' x '+height)+'\n'+host, 2000, 250, 120);
                msg.style.right = 0 + 'px';
                msg.style.bottom = 32 + 'px';
            };
            var onKeyDown = function(e) {
                e = e || window.event;
                var xKey = 88;
                var ctrlDown = e.ctrlKey||e.metaKey; // Mac support
                if (e.keyCode == xKey) {
                    media.focus();
                    showMsgBox(media);
                }
            };
            window.addEventListener("keydown", function(e){onKeyDown(e);}, false);
            media.addEventListener("loadedmetadata",function(e){
                showMsgBox(media);
                if (media.videoWidth) console.log('media: '+media.src+' ['+media.videoWidth+'x'+media.videoHeight+']');
            },false);
        };

        var useLocalVolumeCookie = function(mediaElementSelector, cookieName) {
            cookieName = cookieName || "media";
            var mediaVolume = localStorage.getItem(cookieName+"_volume");
            var mediaMuted = localStorage.getItem(cookieName+"_muted");
            if (mediaMuted == "false") mediaMuted = false; // normalize
            var mediaElementsArray = document.querySelectorAll(mediaElementSelector);
            for (let mediaElement of mediaElementsArray) {
                let saveSettings = function() {
                    localStorage.setItem(cookieName+"_volume", mediaElement.volume || 0);
                    localStorage.setItem(cookieName+"_muted", mediaElement.muted);
                };
                if (mediaVolume) mediaElement.volume = mediaVolume;
                mediaElement.muted = mediaMuted;
                mediaElement.addEventListener("volumechange", saveSettings, false);
                // console.log("mediaElement: ", mediaElement);
                // console.log("localStorage."+cookieName+"_volume: ", localStorage.getItem(cookieName+"_volume"));
                // console.log("localStorage."+cookieName+"_muted: ", localStorage.getItem(cookieName+"_muted"));
            }
        };

        var useGMVolumeCookie = function(mediaElementSelector, cookieName) {
            cookieName = cookieName || "media";
            var mediaVolume = GM_getValue(cookieName+"_volume");
            var mediaMuted = GM_getValue(cookieName+"_muted");
            if (mediaMuted == "false") mediaMuted = false; // normalize
            var mediaElementsArray = document.querySelectorAll(mediaElementSelector);
            for (let mediaElement of mediaElementsArray) {
                let saveSettings = function() {
                    GM_setValue(cookieName+"_volume", mediaElement.volume || 0);
                    GM_setValue(cookieName+"_muted", mediaElement.muted);
                };
                if (mediaVolume) mediaElement.volume = mediaVolume;
                mediaElement.muted = mediaMuted;
                mediaElement.addEventListener("volumechange", saveSettings, false);
                // console.log("mediaElement: ", mediaElement);
                // console.log("GM_getValue("+cookieName+"_volume): ", GM_getValue(cookieName+"_volume"));
                // console.log("GM_getValue("+cookieName+"_muted): ", GM_getValue(cookieName+"_muted"));
            }
        };

        function GetFirstCustomKey(searchArray, customKeysArray) {
            for(var i in searchArray){
                if (customKeysArray.indexOf(searchArray[i]) > -1) {
                    return i;
                }
            }
            return;
        }

        function getParamsFromURL(searchString) {
            var customKeysArray = ['autoplay', '#t'];
            var parse = function(params, pairs) {
                var pair = pairs[0];
                var parts = pair.split('=');
                var key = decodeURIComponent(parts[0]).replace(/.*?\?/, '');
                var value = decodeURIComponent(parts.slice(1).join('='));
                // Handle multiple parameters of the same name
                if (typeof params[key] === "undefined") params[key] = value;
                else params[key] = [].concat(params[key], value);
                params = pairs.length == 1 ? params : parse(params, pairs.slice(1));
                params.main_url = searchString;
                var firstCustomKeyIndex = GetFirstCustomKey(Object.keys(params), customKeysArray);
                // console.log('firstCustomKeyIndex = ' + firstCustomKeyIndex);
                if (firstCustomKeyIndex) {
                    var firstCustomKey = Object.keys(params)[firstCustomKeyIndex];
                    var startSymbol = (firstCustomKeyIndex == 0) ? '\\?' : '&';
                    var re = new RegExp(startSymbol + firstCustomKey + '.*');
                    params.main_url = searchString.replace(re, '');
                    params.first_key = firstCustomKey;
                }
                return params;
            };
            // Get rid of leading ?
            return searchString.length === 0 ? {} : parse({}, searchString.split('&')); // .substr(1)
        }

        // var url = location.href.split("#")[1].replace(/[?#&]\bREFINE_VIDEO\b/, '');

        // var url = location.href.split(paramStart)[1];
        var url = location.href.replace(paramStart, '');
        if (url && typeof url !== 'undefined') {url = url.replace(/[?#&]\bREFINE_VIDEO\b/, '');}

        function listParams(obj) {for(var i in obj){console.log(i + "=" + obj[i]);}}

        if (url) {
            console.log('url: ', url);
            var video = document.querySelector("body video");
            console.log('video: ', video);
            if (video) {
                let event = new Event('click');
                video.dispatchEvent(event);
                //
                var href = location.href.replace(paramStart, ''); // location.href.split(paramStart)[1];
                console.log('href: ', href);
                var params = getParamsFromURL(href); // getParamsFromURL(location.search)
                console.log('params: ', params);
                listParams(params);
                if (params.autoplay && params.autoplay == 'true') {
                    video.setAttribute('autoplay', '');
                };
                var videoSrc = params.main_url;
                if (params.t) videoSrc = videoSrc + '#t=' + params.t;
                video.setAttribute('src', videoSrc);
                console.log('src: ', videoSrc);
                mediaKeyboardControls(video);
                mediaMouseControls(video, 5);
                mediaShowInfoBox(video);
                if (G_USE_AS_EXTENSION) {
                    useLocalVolumeCookie("body video", "video");
                }
                else {
                    useGMVolumeCookie("body video", "video");
                };
                window.addEventListener('message', function(e) {
                    if(e.data.sender === 'QUESTION') {
                        setTimeout(function() {
                            window.top.postMessage({
                                sender: 'ANSWER',
                                // data: {
                                duration: video.duration,
                                currentTime: video.currentTime,
                                videoWidth: video.videoWidth,
                                videoHeight: video.videoHeight,
                                // }
                            }, '*');
                        }, 50);
                    }
                });
            }
        }
    };
    initPlayer();
    // ---------------------------------------------------
    // video.src = 'https://vshare.io/err105.mp4?error=expired&#t=5';
})();
