console.log("JS");
let currnSong = new Audio();
let songs;
let currFolder;

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }
  // Ensure seconds is a positive number
  seconds = Math.max(0, seconds);

  // Calculate minutes and remaining seconds
  var minutes = Math.floor(seconds / 60);
  var remainingSeconds = Math.floor(seconds % 60);

  // Add leading zeros if necessary
  var formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  var formattedSeconds =
    remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;

  // Return the formatted time as a string
  return formattedMinutes + ":" + formattedSeconds;
}

async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
  // console.log(a);
  let response = await a.text();
  // console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];

  // console.log("hey boi",songs);

  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`http://127.0.0.1:5500/${folder}/`)[1]);
      //   console.log(songs);
    }
  }

  let songUL = document
    .querySelector(".songsList")
    .getElementsByTagName("ul")[0];
  songUL.innerHTML = "";
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `        <li><img class="invert" width="23px" src="image/music.svg" alt="">
                      <div class="info">
                      <div>${song.replaceAll("%20", " ")}</div>
                      </div>
                      <div class="playSong">
                          <span>Play Now</span>
                      </div>
                      <img class="invert" src="image/play.svg" alt="">
                  </li>`;
  }

  Array.from(
    document.querySelector(".songsList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playMusic(e.querySelector(".info").firstElementChild.innerHTML);
    });
  });
}

const playMusic = (track, pause = false) => {
  // let audio = new Audio("/songs/"+track+"mp3");
  currnSong.src = `/${currFolder}/` + track;
  if (!pause) {
    currnSong.play();
    play.src = "image/pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = track.replaceAll("%20", " ");
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};




// async function displayAlbums(){
//   let a = await fetch(`http://127.0.0.1:5500/songs/`);
//   let response = await a.text();
//   let div = document.createElement("div");
//   div.innerHTML = response;
//   let anchors = div.getElementsByTagName("a");
//   let cardContainer = document.querySelector(".cardContainer");

//   let array = Array.from(anchors)
//   for (let i = 0; i < array.length; i++) {
//     const e = array[i];
    
//     if(e.href.includes("/songs/")){
//       let folder = e.href.split("/").slice(-1)[0];
//       // console.log(folder);
//       let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
//       console.log(a);
//       let response = await a.json();
//       console.log(response);
//       cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
//       <div class="play">
//           <img src="image/play.svg" alt="">
//       </div>
//       <img src="/songs/${folder}/cover.jpg" alt="">
//       <h3>${response.title}</h3>
//       <p>${response.description}</p>
//       </div>`
//     }
//   }

//   Array.from(document.getElementsByClassName("card")).forEach(e=>{
//     // console.log(e);
//     e.addEventListener("click", async item=>{
//         songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
//     })
// })

// }










async function displayAlbums() {
  console.log("displaying albums")
  let a = await fetch(`http://127.0.0.1:5500/songs/`)
  console.log(a);
  let response = await a.text();
  let div = document.createElement("div")
  div.innerHTML = response;
  console.log(div);
  // let list = div.getElementsByTagName("li")[1]
  // console.log("list", list);
  let anchors = div.getElementsByTagName("a")

  console.log("Anchorrr", anchors);
  let cardContainer = document.querySelector(".cardContainer")
  let array = Array.from(anchors)
  for (let index = 2; index < array.length; index++) {
      const e = array[index]; 
      console.log(e.href);
      if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
          let folder = e.href.split("/").slice(4)[0]
          console.log(folder);
          // Get the metadata of the folder
          let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`)
          console.log(a);
          let response = await a.json(); 
          cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
                 <div class="play">
                     <img src="image/play.svg" alt="">
                 </div>
                 <img src="/songs/${folder}/cover.jpg" alt="">
                 <h3>${response.title}</h3>
                 <p>${response.description}</p>
                 </div>`
      }
  }

  // Load the playlist whenever card is clicked
  Array.from(document.getElementsByClassName("card")).forEach(e => { 
      e.addEventListener("click", async item => {
          console.log("Fetching Songs")
          songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)  
          // playMusic(songs[0])

      })
  })
}


















async function main() {
  await getSongs("songs/Shree%20Ram%20Songs");
  playMusic(songs[0], true);
  console.log(songs);

  await displayAlbums();

  play.addEventListener("click", () => {
    if (currnSong.paused) {
      currnSong.play();
      play.src = "image/pause.svg";
    } else {
      currnSong.pause();
      play.src = "image/play.svg";
    }
  });

  currnSong.addEventListener("timeupdate", () => {
    // console.log(currnSong.currentTime,currnSong.duration);
    document.querySelector(".songtime").innerHTML = `${formatTime(
      currnSong.currentTime
    )}/${formatTime(currnSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currnSong.currentTime / currnSong.duration) * 100 + "%";
  });

  //   seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currnSong.currentTime = (currnSong.duration * percent) / 100;
  });

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  document.querySelector(".cross").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });

  previous.addEventListener("click", () => {
    currnSong.pause();
    console.log("previous click");
    // console.log(currnSong);
    let index = songs.indexOf(currnSong.src.split("/").slice(-1)[0]);
    if ((index - 1) >= 0) {
      playMusic(songs[index - 1]);
    }
  });
  next.addEventListener("click", () => {
    currnSong.pause();
    console.log("next click");
    let index = songs.indexOf(currnSong.src.split("/").slice(-1)[0]);
    // console.log(index);
    if ((index + 1) < songs.length) {
      playMusic(songs[index + 1]);
    }
  });

  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      console.log("setting volume to ", e.target.value, "/100");
      currnSong.volume = parseInt(e.target.value) / 100;
      const volimg = document
        .querySelector(".volume")
        .getElementsByTagName("img")[0];
      console.log(volimg);
      if (e.target.value == 0) {
        volimg.src = "image/mute.svg";
      } else {
        volimg.src = "image/volume.svg";
      }
    });

    document.querySelector(".volume>img").addEventListener("click", (e)=>{
      currnSong.volume = 0;
    });

    document.querySelector(".cardContainer").addEventListener("click", ()=> {
      document.querySelector(".left").style.left = "0"
    });

    // Array.from(document.querySelector(".card")).forEach(element => {
    //   addEventListener("click", (e)=>{
    //     document.querySelector(".left").e.style.left = "0"
    //   });
    // });
    
}

main();
