console.log("This is the class for doing the work....")
let currentSong = new Audio()
async function getSongs() {
    let a = await fetch("/songs");
    let finalresult = await a.text(); // the songs folder can be fetched and converted into the text only.
    let div = document.createElement("div")
    div.innerHTML = finalresult
    let songslist = div.getElementsByTagName("a")
    let songs = []
    for (let i = 0; i < songslist.length; i++) {
        const element = songslist[i]
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }
    }
    return songs
}

function formatSecondsToMinutes(seconds) {
    if (isNaN(seconds)) {
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60); // Get the number of full minutes
    const remainingSeconds = Math.floor(seconds % 60); // Get the remaining seconds
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

const playMusic = (track, pause = false) => {
    currentSong.src = "/songs/" + track
    if (!pause) {
        currentSong.play()
        play.src = "/img/pause.svg"
    }
    document.querySelector(".songtitle").innerHTML = decodeURI(track.split("320")[0]);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}
async function main() {
    // fetch all the songs from the songs file.
    let songs = await getSongs()
    let value = Math.floor(Math.random() * songs.length);
    playMusic(songs[value], true)

    // show all the songs in the library as in the form of list.
    let songsUL = document.querySelector(".songslist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songsUL.innerHTML = songsUL.innerHTML + ` <li>
                            <img class="invert" src="img/music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Manan</div>
                            </div>
                            <div class="playNow">
                                <span>Play Now</span>
                                <img class="invert" src="img/play.svg" alt="">
                            </div>
                        </li>`
    }
    // Attach an event Listener to each song
    Array.from(document.querySelector(".songslist").getElementsByTagName("li")).forEach(element => {
        element.addEventListener("click", (result) => {
            playMusic(element.querySelector(".info").firstElementChild.innerHTML)
        })
    })

    // Attach the event listener to the play, next and previous
    // paused is not the function it is a variable
    // we can use id's directly without targeting the element.
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "/img/pause.svg"
        } else {
            currentSong.pause()
            play.src = "/img/play.svg"
        }
    })
    // Listen for the timeupdate event and this event will be running when the song is running.
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${formatSecondsToMinutes(currentSong.currentTime)}/${formatSecondsToMinutes(currentSong.duration)}`
        document.querySelector(".circle").style.left = currentSong.currentTime / currentSong.duration * 100 + "%"
        document.querySelector(".seekbarcover").style.width = currentSong.currentTime / currentSong.duration * 100 + "%"
    })

    // Add an event listener to the seekbar for doing the work.
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%"
        document.querySelector(".seekbarcover").style.width = percent + "%"
        currentSong.currentTime = (currentSong.duration * percent) / 100; // this code is for changing the current time and duration according to the user clicking on the seekbar.
    })
}
main()