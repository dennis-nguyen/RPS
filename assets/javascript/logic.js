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
/////////////////////////////////////////////
var playerOne = false;
var playerTwo = false;
var playerOnesChoice = "";
var playerTwosChoice = "";
var currentPlayer = 0;
var wins = 0;
var losses = 0;
var playerOnesName = "";
var playerTwosName = "";
var playerOnesWins;
var playerTwosWins;
var playerOnesLosses;
var playerTwosLosses;
var chatMessages;


$(document).ready(function() {

    database.ref("/player1").on("value", function(snapshot) {
        if (snapshot.val()) {
            playerOne = true;
            playerOnesName = snapshot.val().name;
            playerOnesWins = snapshot.val().wins;
            playerOnesLosses = snapshot.val().losses;
            updateScreen();
        }
        if (snapshot.val() && currentPlayer == 1) {
            database.ref("/player1").onDisconnect().remove();
        }
        gameFull();
        if (snapshot.val() === null) {
            playerOne = false;
            console.log("player one is " + playerOne);
            $(".nameOne").empty();
            if (currentPlayer == 0) {
                $(".playerEnter").show();
            }
            restart()
        }
        if (snapshot.val() === null && playerTwo == true && currentPlayer == 2) {
            $(".statusBox").text("WAITING FOR A NEW PLAYER ONE");
        }
        if (snapshot.val() && playerTwo == false && currentPlayer == 1) {
            $(".statusBox").text("WAITING FOR SECOND PLAYER");
        }
    });

    database.ref("/player2").on("value", function(snapshot) {
        if (snapshot.val()) {
            playerTwo = true;
            playerTwosName = snapshot.val().name;
            playerTwosWins = snapshot.val().wins;
            playerTwosLosses = snapshot.val().losses;
            updateScreen();
        }
        if (snapshot.val() && currentPlayer == 2) {
            database.ref("/player2").onDisconnect().remove();
        }
        gameFull();
        if (snapshot.val() === null) {
            playerTwo = false;
            console.log("player two is " + playerTwo);
            $(".nameTwo").empty();
            if (currentPlayer == 0) {
                $(".playerEnter").show();
            }
            restart()
        }
        if (snapshot.val() === null && playerOne == true && currentPlayer == 1) {
            $(".statusBox").text("WAITING FOR A NEW PLAYER TWO");
        }
    });

    database.ref("/choices").on("value", function(snapshot) {
        if (snapshot.val()) {
            $(".statusBox").text("PLAYER TWOS TURN");
            if (snapshot.val().player1 && currentPlayer == 2) {
                $(".playerTwo > div").show();
                playerOnesChoice = snapshot.val().player1;
            }
            if (snapshot.val().player1 && snapshot.val().player2) {
                $(".statusBox").text("NEXT GAME");
                playerOnesChoice = snapshot.val().player1
                playerTwosChoice = snapshot.val().player2
                $(".playerOnesAnswer").html(playerOnesChoice);
                $(".playerTwosAnswer").html(playerTwosChoice);
                calcWinner(snapshot.val().player1, snapshot.val().player2);
            }
        }
    });

    // function newPlayer(){
    //     $(".statusBox").append("<input type='text' class='col-lg-3 offset-lg-4' id='playerName' placeholder='Enter Name'>");
    //     $(".statusBox").append("<input type='button' class='btn btn-primary col-lg-1 nameButton' value='Enter'>");
    // }

    $(".nameButton").on("click", function() {
        console.log("name button working");
        if (playerOne === false) {
            playerOnesName = $("#playerName").val();
            currentPlayer = 1;
            database.ref("/player1").set({
                name: playerOnesName,
                wins: 0,
                losses: 0
            })
            $(".playerEnter").hide();
        } else if (playerOne === true && playerTwo === false) {
            playerTwosName = $("#playerName").val();
            currentPlayer = 2;
            database.ref("/player2").set({
                name: playerTwosName,
                wins: 0,
                losses: 0
            })
            $(".playerEnter").hide();
        }

        $("#playerName").val("");

    });

    function updateScreen() {
        if (playerOnesName.length > 0) {
            $(".nameOne").html("<h1>" + playerOnesName + "</h1>");
            $(".nameOne").append("<p class='oneWins oneStats'> Wins: " + playerOnesWins + "</p>");
            $(".nameOne").append("<p class='oneLosses oneStats'> Losses: " + playerOnesLosses + "</p>");
        }
        if (playerTwosName.length > 0) {
            $(".nameTwo").html("<h1>" + playerTwosName + "</h1>");
            $(".nameTwo").append("<p class='twoWins'> Wins: " + playerTwosWins + "</p>");
            $(".nameTwo").append("<p class='twoLosses'> Losses: " + playerTwosLosses + "</p>");
        }
    }

    function updateScore() {
        database.ref("/player1").set({
            name: playerOnesName,
            wins: playerOnesWins,
            losses: playerOnesLosses
        })
        database.ref("/player2").set({
            name: playerTwosName,
            wins: playerTwosWins,
            losses: playerTwosLosses
        })
    }

    function gameFull() {
        if (playerOne && playerTwo) {
            $(".playerEnter").hide();
            $(".statusBox").text("PLAYER ONES TURN");
        }
        showGame();
    }

    function calcWinner(choice1, choice2) {
        if (choice1 === choice2) {
            $(".winner").text("It is a tie!");
            setTimeout(restart, 3000);
            return;
        }
        if (choice1 === "rock") {
            if (choice2 === "scissors") {
                $(".winner").text("Player One Wins!");
                playerOnesWins++;
                playerTwosLosses++;
            } else {
                $(".winner").text("Player Two Wins!");
                playerTwosWins++;
                playerOnesLosses++;
            }
        }
        if (choice1 === "scissors") {
            if (choice2 === "paper") {
                $(".winner").text("Player One Wins!");
                playerOnesWins++;
                playerTwosLosses++;
            } else {
                $(".winner").text("Player Two Wins!");
                playerTwosWins++;
                playerOnesLosses++;
            }
        }
        if (choice1 === "paper") {
            if (choice2 === "rock") {
                $(".winner").text("Player One Wins!");
                playerOnesWins++;
                playerTwosLosses++;
            } else {
                $(".winner").text("Player Two Wins!");
                playerTwosWins++;
                playerOnesLosses++;
            }
        }
        setTimeout(updateScore, 3000);
        setTimeout(restart, 3000);
    }

    function showGame() {
        if (playerOne && playerTwo) {
            if (currentPlayer == 1) {
                $(".playerOne > div").show();
            }
        }
    }

    function restart() {
        database.ref("/choices").remove();
        $(".winner").empty();
        $(".playerOnesAnswer").empty();
        $(".playerTwosAnswer").empty();
        $(".playerOne > div").hide();
        $(".playerTwo > div").hide();
        showGame();
    }

    function choseRock() {
        var chosen = $(this).attr("id");
        if (currentPlayer == 1) {
            playerOnesChoice = chosen;
            database.ref("choices").set({
                player1: chosen
            })
            $(".playerOnesAnswer").html(chosen);
            $(".playerOne > div").hide();
        } else if (currentPlayer == 2) {
            $(".playerTwosAnswer").html(chosen);
            database.ref("choices").set({
                player1: playerOnesChoice,
                player2: chosen
            })
            $(".playerTwo > div").hide();

        }
    }

    $(document).on("click", ".choices", choseRock)
    $(".playerOne > div").hide();
    $(".playerTwo > div").hide();


    //////////////////////// CHAT

    $(".chatBtn").on("click", function() {
        var enteredText = $(".chatText").val();
        console.log(enteredText);

        if (currentPlayer == 1) {
            database.ref("/chat").push({
                name: playerOnesName,
                chat: enteredText
            })

        }
        if (currentPlayer == 2) {
            database.ref("/chat").push({
                name: playerTwosName,
                chat: enteredText
            })

        }
        if (currentPlayer == 0) {
            database.ref("/chat").push({
                name: "Spectator",
                chat: enteredText
            })

        }
        $(".chatText").val("");
    })
    database.ref("/chat").on("child_added", function(snapshot) {
        var chatMessage = snapshot.val().chat;
        var chatName = snapshot.val().name;
        var chatLine = $("<div>");
        chatLine.append(chatName + ": " + chatMessage);
        $(".chatRoom").append(chatLine);
        scrollDown();

    });

    function scrollDown() {
        var chatRoom = $(".chatRoom");
        var height = chatRoom[0].scrollHeight;
        chatRoom.scrollTop(height);
    }

});
