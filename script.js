console.log("This is the class for doing the work....")

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

async function main() {
    // fetch all the songs from the songs file.
    let songs = await getSongs()

    // show all the songs in the library as in the form of list.
    let songsUL = document.querySelector(".songslist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songsUL.innerHTML = songsUL.innerHTML + ` <li>
                            <img class="invert" src="img/music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ").split("320")[0]}</div>
                                <div>Manan</div>
                            </div>
                            <div class="playNow">
                                <span>Play Now</span>
                                <img class="invert" src="img/play.svg" alt="">
                            </div>
                        </li>`
    }
    // play the first songs
    let audioSong = new Audio(songs[1])
    // audioSong.play()
    audioSong.addEventListener("timeupdate", (event) => {
        console.log(event.timeStamp)
    })
}
main()