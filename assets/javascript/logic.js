var playerOne = false;
var playerTwo = false;
var currentPlayer = 0;
var playerOnesName = "";
var playerTwosName = "";
var playerOnesWins;
var playerTwosWins;
var playerOnesLosses;
var playerTwosLosses;
var playerOnesChoice = "";
var playerTwosChoice = "";
// Initialize Firebase
var config = {
    apiKey: "AIzaSyDBwDurpMihdApzU0Tuh5EONnaRLBHPesU",
    authDomain: "rockpaperscissors-a06bc.firebaseapp.com",
    databaseURL: "https://rockpaperscissors-a06bc.firebaseio.com",
    projectId: "rockpaperscissors-a06bc",
    storageBucket: "rockpaperscissors-a06bc.appspot.com",
    messagingSenderId: "756207483303"
};
firebase.initializeApp(config);
var database = firebase.database();

$(document).ready(function() {
    //Firebase for Player 1
    database.ref("/player1").on("value", function(snapshot) {
        playerOneStatus(snapshot.val());
        updateGameStatus();
        isGameFull();
    });
    //Firebase for Player 2
    database.ref("/player2").on("value", function(snapshot) {
        playerTwoStatus(snapshot.val());
        updateGameStatus();
        isGameFull();
    });
    //Firebase for choices/turns
    database.ref("/choices").on("value", function(snapshot) {
        if (snapshot.val()) {
            $(".statusBox").text("PLAYER TWOS TURN");
            playerOnesChoice = snapshot.val().player1;
            if (snapshot.val().player1 && currentPlayer == 2) {
                $(".playerTwo > div").show();
            }
            if (snapshot.val().player1 && snapshot.val().player2) {
                playerTwosChoice = snapshot.val().player2;
                $(".statusBox").text("NEXT GAME STARTING SOON");
                $(".playerOnesAnswer").html("<h2>" + playerOnesChoice + "</h2>");
                $(".playerTwosAnswer").html("<h2>" + playerTwosChoice + "</h2>");
                calcWinner(playerOnesChoice, playerTwosChoice);
            }
        }
    });

    function playerOneStatus(info) {
        if (info) {
            //PLAYER ONE EXIST
            updatePlayerStats("player1", info);
        }
        if (info && currentPlayer == 1) {
            //PLAYER ONE DISCONNECTED
            console.log(info);
            database.ref("/player1").onDisconnect().remove();
        }
        if (info === null) {
            //PLAYER ONE DOES NOT EXIST
            console.log(info);
            playerOne = false;
            playerOnesName = "";
            $(".nameOne").empty();
            restart();
        }
    }

    function playerTwoStatus(info) {
        if (info) {
            //PLAYER TWO EXIST
            updatePlayerStats("player2", info);
        }
        if (info && currentPlayer == 2) {
            //PLAYER TWO DISCONNECTED
            database.ref("/player2").onDisconnect().remove();
        }
        if (info === null) {
            //PLAYER TWO DOES NOT EXIST
            playerTwo = false;
            playerTwosName = "";
            $(".nameTwo").empty();
            restart();
        }
    }

    function updateGameStatus() {
        if (playerOne === false && playerTwo === true && currentPlayer == 2) {
            $(".statusBox").text("WAITING FOR A NEW PLAYER ONE");
        }
        if (playerOne === true && playerTwo === false && currentPlayer == 1) {
            $(".statusBox").text("WAITING FOR A NEW PLAYER TWO");
        }
    }

    function updatePlayerStats(playerNum, info) {
        if (playerNum == "player1") {
            playerOne = true;
            playerOnesName = info.name;
            playerOnesWins = info.wins;
            playerOnesLosses = info.losses;
            updateScreen();
        }
        if (playerNum == "player2") {
            playerTwo = true;
            playerTwosName = info.name;
            playerTwosWins = info.wins;
            playerTwosLosses = info.losses;
            updateScreen();
        }
    }
    //Screen that shows Name, Wins, Losses
    function updateScreen() {
        if (playerOnesName.length > 0) {
            $(".nameOne").html("<h1 class='text-info'>" + playerOnesName + "</h1>");
            $(".nameOne").append("<p class='oneWins col-lg-2'> Wins: " + playerOnesWins + "</p>");
            $(".nameOne").append("<p class='oneLosses col-lg-2 offset-lg-8'> Losses: " + playerOnesLosses + "</p>");
        }
        if (playerTwosName.length > 0) {
            $(".nameTwo").html("<h1 class='text-success'>" + playerTwosName + "</h1>");
            $(".nameTwo").append("<p class='twoWins oneWins col-lg-2'> Wins: " + playerTwosWins + "</p>");
            $(".nameTwo").append("<p class='twoLosses col-lg-2 offset-lg-8'> Losses: " + playerTwosLosses + "</p>");
        }
    }
    //Updates Score Variables
    function updateScore() {
        database.ref("/player1").set({
            name: playerOnesName,
            wins: playerOnesWins,
            losses: playerOnesLosses
        });
        database.ref("/player2").set({
            name: playerTwosName,
            wins: playerTwosWins,
            losses: playerTwosLosses
        });
    }

    function isGameFull() {
        if (playerOne && playerTwo) {
            $(".playerEnter").hide();
            $(".statusBox").text("PLAYER ONES TURN");
        }
        if (currentPlayer == 1 || currentPlayer == 2) {
            $(".playerEnter").hide();
        }
        showGame();
    }
    //RPS LOGIC
    function calcWinner(choice1, choice2) {
        if (choice1 === choice2) {
            $(".winner").html("<p class='text-warning centerMsg'>It's a tie!</p>");
            setTimeout(isGameFull, 3000);
            setTimeout(restart, 3000);
            return;
        }
        if (choice1 === "rock") {
            if (choice2 === "scissors") {
                playerOneWins();
            } else {
                playerTwoWins();
            }
        }
        if (choice1 === "scissors") {
            if (choice2 === "paper") {
                playerOneWins();
            } else {
                playerTwoWins();
            }
        }
        if (choice1 === "paper") {
            if (choice2 === "rock") {
                playerOneWins();
            } else {
                playerTwoWins();
            }
        }
        setTimeout(updateScore, 3000);
        setTimeout(restart, 3000);
    }

    function playerOneWins() {
        $(".winner").html("<p class='text-info centerMsg'>Player One Wins!</p>");
        playerOnesWins++;
        playerTwosLosses++;
    }

    function playerTwoWins() {
        $(".winner").html("<p class='text-success centerMsg'>Player Two Wins!</p>");
        playerTwosWins++;
        playerOnesLosses++;
    }

    function showGame() {
        if (playerOne && playerTwo) {
            if (currentPlayer == 1) {
                $(".playerOne > div").show();
            }
        }
    }

    function restart() {
        console.log("restart going off");
        if (currentPlayer === 0 && playerOne === false && playerTwo === true) {
            $(".statusBox").text("PLAYER TWO READY");
            $(".playerEnter").show();
        }
        if (currentPlayer === 0 && playerTwo === false && playerOne === true) {
            $(".statusBox").text("PLAYER ONE READY");
            $(".playerEnter").show();
        }
        if (currentPlayer === 0 && playerTwo === false && playerOne === false) {
            $(".statusBox").text("WELCOME TO THE ULTIMATE EXPERIENCE OF RPS");
            $(".playerEnter").show();
        }
        database.ref("/choices").remove();
        $(".winner").empty();
        $(".playerOnesAnswer").empty();
        $(".playerTwosAnswer").empty();
        $(".playerOne > div").hide();
        $(".playerTwo > div").hide();
        showGame();
    }

    function applyEventHandlers() {
        //ENTER NAME BUTTON HANDLER
        $(".nameButton").on("click", function() {
            if ($(".playerName").val().length > 0) { //ONLY TAKES INPUT GREATER THAN 1 CHAR
                if (playerOne === false) {
                    playerOnesName = $(".playerName").val();
                    currentPlayer = 1;
                    database.ref("/player1").set({
                        name: playerOnesName,
                        wins: 0,
                        losses: 0
                    });
                } else if (playerOne === true && playerTwo === false) {
                    playerTwosName = $(".playerName").val();
                    currentPlayer = 2;
                    database.ref("/player2").set({
                        name: playerTwosName,
                        wins: 0,
                        losses: 0
                    });
                }
                $(".playerName").val("");
            }
        });
        //ROCK PAPER SCISSORS CHOICE HANDLER
        $(".choices").on("click", function() {
            var chosen = $(this).prop("class").split(" ")[0]; //Gets first class
            if (currentPlayer == 1) {
                playerOnesChoice = chosen;
                database.ref("choices").set({
                    player1: chosen
                });
                $(".playerOnesAnswer").html("<h2>" + chosen + "</h2>");
                $(".playerOne > div").hide();
            } else if (currentPlayer == 2) {
                $(".playerTwosAnswer").html("<h2>" + chosen + "</h2>");
                database.ref("choices").set({
                    player1: playerOnesChoice,
                    player2: chosen
                });
                $(".playerTwo > div").hide();
            }
        });
        //CHAT BUTTON HANDLER
        $(".chatBtn").on("click", function() {
            var enteredText = $(".chatText").val();
            if (enteredText.length > 0) { //ONLY TAKES INPUT GREATER THAN 1 CHAR
                if (currentPlayer == 1) {
                    database.ref("/chat").push({
                        name: playerOnesName,
                        chat: enteredText
                    });
                }
                if (currentPlayer == 2) {
                    database.ref("/chat").push({
                        name: playerTwosName,
                        chat: enteredText
                    });
                }
                if (currentPlayer === 0) {
                    database.ref("/chat").push({
                        name: "Spectator",
                        chat: enteredText
                    });
                }
                $(".chatText").val("");
            }
        });
        //CHAT TO WORK WITH ENTER KEY
        $(".chatText").keyup(function(event) {
            if (event.keyCode == 13) {
                $(".chatBtn").click();
            }
        });
        //NAME INPUT TO WORK WITH ENTER KEY
        $(".playerName").keyup(function(event) {
            if (event.keyCode == 13) {
                $(".nameButton").click();
            }
        });

        $(".clearChat").on("click", function() {
            database.ref("/chat").remove();
        });
        
        $(".clearPlayers").on("click", function() {
            database.ref("/player1").remove();
            database.ref("/player2").remove();
            database.ref("/choices").remove();
        });

        $(".modalBtn").on("click", function() {
            $('#myModal').modal('show');
            console.log("button working");
        });
    }
    //CHAT FIREBASE
    database.ref("/chat").on("child_added", function(snapshot) {
        var chatMessage = snapshot.val().chat;
        var chatName = snapshot.val().name;
        var chatLine = $("<div>");
        chatLine.append(chatName + ": " + chatMessage);
        $(".chatRoom").append(chatLine);
        scrollDown();
    });
    //SCROLLS MY CHAT TO BOTTOM OF DIV
    function scrollDown() {
        var chatRoom = $(".chatRoom");
        var height = chatRoom[0].scrollHeight;
        chatRoom.scrollTop(height);
    }

    applyEventHandlers();
});
