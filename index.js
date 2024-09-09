
const BASE_URL = "http://ladist1.catbox.video/";
let songData;
let currentSong = null;

let debug_div;
function debug(message) {
    let timestamp = (new Date()).toLocaleTimeString();
    let div = document.createElement("div");
    div.append(`[${timestamp}] ${message}`);
    debug_div.prepend(div);
}

async function fetchSongData() {
    debug("fetching song data");
    try {
        const response = await fetch("car_dump.json");
        if (!response.ok) {
            let message = await response.text();
            throw new Error(`Response status ${response.status}: ${message}`);
        }
    
        const songs = await response.json();
        debug(`loaded ${songs.length} songs`);
        songData = songs;
        // return songs;
    } catch (error) {
        debug(error.message);
    }
}

function playSong(song) {
    debug("loading song");
    
    let sound = new Howl({ src: [BASE_URL + song.link], html5: true });
    sound.on("play", () => {
        debug("playing song");
        if (currentSong && currentSong.sound) {
            currentSong.sound.stop();
        }
        currentSong = {
            songname: song.song,
            artist: song.artist,
            sound: sound,
        };
    });

    sound.play();
}

function playNextSong() {
    let index = Math.floor(Math.random() * songData.length)
    playSong(songData[index]);
}

function handleInput(e) {
    if (e.keyCode == 13) {
        if (currentSong) {
            guess = e.target.value;
            debug(`guess: ${guess}`);

            debug(`answer:${currentSong.songname} by ${currentSong.artist}`);

            playNextSong();
        }
    }
}

window.onload = function() {
    debug_div = document.getElementById("debug-log");
    let div_start = document.getElementById("div-start");
    div_start.querySelector("input").onclick = () => {
        div_start.style.display = "none";
        document.getElementById("div-guess").style.display = "block";
        playNextSong();
    }
    document.getElementById("input-guess").onkeydown = handleInput;
    debug("loaded page");
    fetchSongData().then(() => div_start.style.display = "block");
};
