const selectBox = document.querySelector(".select-box"),
selectBtnX = selectBox.querySelector(".options .playerX"),
selectBtnO = selectBox.querySelector(".options .playerO"),
playBoard = document.querySelector(".play-board"),
players = document.querySelector(".players"),
allBox = document.querySelectorAll("section span"),
resultBox = document.querySelector(".result-box"),
wonText = resultBox.querySelector(".won-text"),
replayBtn = resultBox.querySelector("button");

window.onload = () => {
    for (let i = 0; i < allBox.length; i++) {
        allBox[i].setAttribute("onclick", "clickedBox(this)");
    }
}

selectBtnX.onclick = () => {
    selectBox.classList.add("hide");
    playBoard.classList.add("show");
}

selectBtnO.onclick = () => {
    selectBox.classList.add("hide");
    playBoard.classList.add("show");
    players.setAttribute("class", "players active player");
}

let playerXIcon = "fas fa-times", // Font Awesome icon for X
    playerOIcon = "far fa-circle", // Font Awesome icon for O
    playerSign = "X",
    runBot = true;

function clickedBox(element) {
    if (players.classList.contains("player")) { // if O's turn
        playerSign = "O";
        element.innerHTML = `<i class="${playerOIcon}"></i>`; // set O icon
        players.classList.remove("active"); // switch to X's turn
        element.setAttribute("id", playerSign);
    } else { // if X's turn
        element.innerHTML = `<i class="${playerXIcon}"></i>`; // set X icon
        element.setAttribute("id", playerSign);
        players.classList.add("active"); // switch to O's turn
    }
    element.style.pointerEvents = "none"; // prevent further clicks on this box
    selectWinner(); // check if there is a winner
    playBoard.style.pointerEvents = "none"; // disable board temporarily

    // Add delay for bot's turn
    setTimeout(() => {
        bot(runBot);
    }, (Math.random() * 1000) + 200); // random delay between 200ms and 1200ms
}

function bot() {
    let array = [];
    if (runBot) {
        playerSign = "O"; // bot always plays O
        for (let i = 0; i < allBox.length; i++) {
            if (allBox[i].childElementCount == 0) { // if box is empty
                array.push(i);
            }
        }
        let randomBox = array[Math.floor(Math.random() * array.length)]; // select random empty box
        if (array.length > 0) {
            if (players.classList.contains("player")) { 
                playerSign = "X"; // bot plays X if O was initially selected by human
                allBox[randomBox].innerHTML = `<i class="${playerXIcon}"></i>`;
                allBox[randomBox].setAttribute("id", playerSign);
                players.classList.add("active");
            } else {
                allBox[randomBox].innerHTML = `<i class="${playerOIcon}"></i>`;
                allBox[randomBox].setAttribute("id", playerSign);
                players.classList.remove("active");
            }
            selectWinner(); // check if bot wins
        }
        allBox[randomBox].style.pointerEvents = "none";
        playBoard.style.pointerEvents = "auto"; // re-enable board after bot's turn
        playerSign = "X"; // switch back to human (X)
    }
}

function getIdVal(classname) {
    return document.querySelector(".box" + classname).id; // get id of box
}

function checkIdSign(val1, val2, val3, sign) {
    if (getIdVal(val1) == sign && getIdVal(val2) == sign && getIdVal(val3) == sign) {
        return true;
    }
}

function selectWinner() {
    // check all possible winning combinations
    if (checkIdSign(1, 2, 3, playerSign) || checkIdSign(4, 5, 6, playerSign) || checkIdSign(7, 8, 9, playerSign) ||
        checkIdSign(1, 4, 7, playerSign) || checkIdSign(2, 5, 8, playerSign) || checkIdSign(3, 6, 9, playerSign) ||
        checkIdSign(1, 5, 9, playerSign) || checkIdSign(3, 5, 7, playerSign)) {
        runBot = false;
        bot(runBot); // stop bot from playing
        setTimeout(() => {
            resultBox.classList.add("show");
            playBoard.classList.remove("show");
        }, 700); // show result after delay
        wonText.innerHTML = `Player <p>${playerSign}</p> won the game!`;
    } else {
        // check if it's a draw
        if (getIdVal(1) != "" && getIdVal(2) != "" && getIdVal(3) != "" &&
            getIdVal(4) != "" && getIdVal(5) != "" && getIdVal(6) != "" &&
            getIdVal(7) != "" && getIdVal(8) != "" && getIdVal(9) != "") {
            runBot = false;
            bot(runBot); // stop bot from playing
            setTimeout(() => {
                resultBox.classList.add("show");
                playBoard.classList.remove("show");
            }, 700);
            wonText.textContent = "Match has been drawn!";
        }
    }
}

replayBtn.onclick = () => {
    window.location.reload(); // reload game for replay
}
