console.log("This is the class for doing the work....")
let currentSong = new Audio()
let songs;
let currFolder;
async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`/${folder}/`);
    let finalresult = await a.text(); // the songs folder can be fetched and converted into the text only.
    let div = document.createElement("div")
    div.innerHTML = finalresult
    let songslist = div.getElementsByTagName("a")
    let songs = []
    for (let i = 0; i < songslist.length; i++) {
        const element = songslist[i]
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

    let songsUL = document.querySelector(".songslist").getElementsByTagName("ul")[0]
    songsUL.innerHTML = ""
    for (const song of songs) {
        songsUL.innerHTML = songsUL.innerHTML + ` <li>
                            <img class="invert" src="img/music.svg" alt="">
                            <div class="info">
                                <div>${decodeURI(song)}</div>
                                <div>Manan</div>
                            </div>
                            <div class="playNow">
                                <span>Play Now</span>
                                <img class="invert" src="img/play.svg" alt="">
                            </div>
                        </li>`
    }

    // Attach an event Listener to each song
    Array.from(document.querySelector(".songslist").getElementsByTagName("li")).forEach((element, index) => {
        element.addEventListener("click", (result) => {
            playMusic(element.querySelector(".info").firstElementChild.innerHTML, index)
        })
    })
    return songs
}

function formatSecondsToMinutes(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60); // Get the number of full minutes
    const remainingSeconds = Math.floor(seconds % 60); // Get the remaining seconds
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

const playMusic = (track, index, pause = false) => {
    currentSong.src = `/${currFolder}/` + track
    if (!pause) {
        currentSong.play()
        play.src = "/img/pause.svg"
    }
    // this code is for highlighting the box with the different color when that song is in the playing stage.
    Array.from(document.querySelector(".songslist").getElementsByTagName("li")).forEach((element) => {
        let value = element.querySelector(".playNow").lastElementChild
        console.log(value)
        if (decodeURI(currentSong.src.split(`/${currFolder}/`)[1]) !== element.querySelector(".info").firstElementChild.innerHTML) {
            element.style.borderColor = "white"
            element.firstElementChild.classList.remove("imagewidth")
            element.firstElementChild.src = "/img/music.svg"
            value.src="/img/play.svg"
        } else {
            element.style.borderColor = "green"
            element.firstElementChild.src = "/gifs/spotify.gif"
            element.firstElementChild.classList.add("imagewidth")
            value.src = "/img/pause.svg"
        }
    })
    document.querySelector(".songtitle").innerHTML = decodeURI(track.split("320")[0]);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}
async function displayAlbums() {
    let a = await fetch("/songs")
    let finalresult = await a.text()
    let div = document.createElement("div")
    let cardContainers = document.querySelector(".cardcontainer")
    div.innerHTML = finalresult;
    let anchors = Array.from(div.getElementsByTagName("a"))
    for (let i = 0; i < anchors.length; i++) {
        let element = anchors[i]
        if (element.href.includes("/songs")) {
            let value = element.href.split("/").slice(-2)[0]
            let finalvalue = await fetch(`/songs/${value}/info.json`)
            let finalresult = await finalvalue.json()
            cardContainers.innerHTML = cardContainers.innerHTML + `
            <div data-folder="${value}" class="card">
                        <div class="play">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                                    stroke-linejoin="round"></path>
                            </svg>
                        </div>
                        <img src="/songs/${value}/cover.jpg" alt="">
                        <h2>${finalresult.title}</h2>
                        <p>${finalresult.description}</p>
                    </div>
                    `
        }
    }
    // Load the playlist whenever the card is clicked.
    Array.from(document.getElementsByClassName("card")).forEach(element => {
        element.addEventListener("click", async () => {
            songs = await getSongs(`songs/${element.dataset.folder}`)
            playMusic(songs[0])
        })
    })
}
async function main() {
    // fetch all the songs from the songs file.
    songs = await getSongs("songs/cs")
    // this folder is moved in the getsongs folder and for doing further work.
    // let songsUL = document.querySelector(".songslist").getElementsByTagName("ul")[0]
    // for (const song of songs) {
    //     songsUL.innerHTML = songsUL.innerHTML + ` <li>
    //                         <img class="invert" src="img/music.svg" alt="">
    //                         <div class="info">
    //                             <div>${decodeURI(song)}</div>
    //                             <div>Manan</div>
    //                         </div>
    //                         <div class="playNow">
    //                             <span>Play Now</span>
    //                             <img class="invert" src="img/play.svg" alt="">
    //                         </div>
    //                     </li>`
    // }
    let value = Math.floor(Math.random() * songs.length);
    playMusic(songs[value], value, true)


    // display all the albums on the page.
    displayAlbums()

    // show all the songs in the library as in the form of list.
    // // Attach an event Listener to each song
    // Array.from(document.querySelector(".songslist").getElementsByTagName("li")).forEach((element, index) => {
    //     element.addEventListener("click", (result) => {
    //         playMusic(element.querySelector(".info").firstElementChild.innerHTML, index)
    //     })
    // })

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
        document.querySelector(".songtime").innerHTML = `${formatSecondsToMinutes(currentSong.currentTime)} / ${formatSecondsToMinutes(currentSong.duration)}`
        document.querySelector(".circle").style.left = currentSong.currentTime / currentSong.duration * 100 + "%"
        document.querySelector(".seekbarcover").style.width = currentSong.currentTime / currentSong.duration * 100 + "%";
        if (currentSong.currentTime === currentSong.duration) {
            document.querySelector(".seekbarcover").style.width = 0;
            currentSong.currentTime = 0;
            play.src = "/img/play.svg"
        }
    })

    // // Add an event listener to the seekbar for doing the work.
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100; // this for calculating the length of the seekhbar and how much seekh baar will be covered when the mouse click is done on that seekhbaar.
        document.querySelector(".circle").style.left = percent + "%"
        document.querySelector(".seekbarcover").style.width = percent + "%"
        currentSong.currentTime = (currentSong.duration * percent) / 100; // this code is for changing the current time and duration according to the user clicking on the seekbar.
    })
    // Add an event listener to the seekbar for doing the work.
    document.querySelector(".seekbar").addEventListener("mousemove", (e) => {
        if (e.buttons === 1) {
            let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100; // this for calculating the length of the seekhbar and how much seekh baar will be covered when the mouse click is done on that seekhbaar.
            document.querySelector(".circle").style.left = percent + "%"
            document.querySelector(".seekbarcover").style.width = percent + "%"
            currentSong.currentTime = (currentSong.duration * percent) / 100; // this code is for changing the current time and duration according to the user clicking on the seekbar.
        }
    })

    // add an event listener for the hamburger for visiblity of the left pane.
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = 0;
    })
    // add an event listener for close button
    let closeElement = document.querySelector(".close")
    closeElement.addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    // add an event listener to the previous and next element button.
    previous.addEventListener("click", () => {
        let currentSongvalue = currentSong.src.split("/songs/")[1]
        let index = songs.indexOf(currentSongvalue)
        if (index - 1 >= 0) {
            playMusic(songs[index - 1])
        }
    })
    next.addEventListener("click", () => {
        let currentSongvalue = currentSong.src.split("/songs/")[1]
        let index = songs.indexOf(currentSongvalue)
        if (index + 1 < songs.length) {
            playMusic(songs[index + 1])
        }
    })
    // Add an event to the volume
    let element = document.querySelector(".volume").getElementsByTagName("input")[0]
    element.addEventListener("mousemove", (event) => {
        if (event.buttons === 1) {
            currentSong.volume = parseInt(event.target.value) / 100;
            let value = document.querySelector(".volume").getElementsByTagName("img")[0]
            if (parseInt(event.target.value) === 0) {
                value.src = "img/mute.svg"
            } else {
                value.src = "img/volume.svg"
            }
        }
    })

    // toggle the volume icon button for chaging the value to mute or present value.
    let toggleVolumeImage = document.querySelector(".volume").getElementsByTagName("img")[0]
    toggleVolumeImage.addEventListener("click", () => {
        let inputRangeValue = document.querySelector(".volume").getElementsByTagName("input")[0]
        let valueImage = toggleVolumeImage.src.split("/img/")[1]
        if (valueImage === "volume.svg") {
            currentVolume = currentSong.volume;
            toggleVolumeImage.src = "img/mute.svg";
            currentSong.volume = 0;
            inputRangeValue.value = 0
        } else {
            toggleVolumeImage.src = "img/volume.svg";
            currentSong.volume = 0.5;
            inputRangeValue.value = 50;
        }
    })

}
main()