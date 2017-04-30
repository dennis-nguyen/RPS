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
var connectionsRef = database.ref("/connections");
var connectedRef = database.ref(".info/connected");
/////////////////////////////////////////////
var playerOne = false;
var playerTwo = false;
var playerCounter = 0;
var whosTurn = 1;
var playerOnesChoice = "";
var playerTwosChoice = "";
var currentPlayer = 0;
var name;
var wins = 0;
var losses = 0;
var choice = "";


$(document).ready(function() {

    database.ref("/player1").on("value", function(snapshot) {
        if (snapshot.val()) {
            playerOne = true;
        }
        if (snapshot.val() && currentPlayer == 1) {
            database.ref("/player1").onDisconnect().remove();
        }
        gameFull();
        if (snapshot.val() === null) {
            playerOne = false;
            console.log("player one is " + playerOne);
            $(".statusBox").show();
        }
    });

    database.ref("/player2").on("value", function(snapshot) {
        if (snapshot.val()) {
            playerTwo = true;
        }
        if (snapshot.val() && currentPlayer == 2) {
            database.ref("/player2").onDisconnect().remove();
        }
        gameFull();
         if (snapshot.val() === null) {
            playerTwo = false;
            console.log("player two is " + playerTwo);
            $(".statusBox").show();
        }
    });

    database.ref("/choices").on("value", function(snapshot) {
        if (snapshot.val()) {
            if (snapshot.val().player1 && currentPlayer == 2) {
                $(".playerTwo > div").show();
                playerOnesChoice = snapshot.val().player1;
            }
            if (snapshot.val().player1 && snapshot.val().player2) {
                calcWinner(snapshot.val().player1, snapshot.val().player2);
            }
            gameFull();
        }
    });

    $(".nameButton").on("click", function() {
        console.log("name button working");
        var name = $("#playerName").val();

        if (playerOne === false) {
            currentPlayer = 1;
            database.ref("/player1").set({
                name: name,
                wins: wins,
                losses: losses
            })
        } else if (playerOne === true && playerTwo === false) {
            currentPlayer = 2;
            database.ref("/player2").set({
                name: name,
                wins: 0,
                losses: 0
            })
        }

        $("#playerName").val("");

    });

    function gameFull() {
        if (playerOne && playerTwo) {
            $(".statusBox").hide();
        }
        showGame();
    }

    function calcWinner(choice1, choice2) {
        if (choice1 === choice2) {
            console.log("its a tie");
            restart()
            return;
        }
        if (choice1 === "rock") {
            if (choice2 === "scissors") {
                console.log("player one wins");
                restart()
            } else {
                console.log("player two wins");
                restart()
            }
        }
        if (choice1 === "scissors") {
            if (choice2 === "paper") {
                console.log("player one wins");
                restart()
            } else {
                console.log("player two wins");
                restart()
            }
        }
        if (choice1 === "paper") {
            if (choice2 === "rock") {
                console.log("player one wins");
                restart()
            } else {
                console.log("player two wins");
                restart()
            }
        }
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
        showGame();
    }

    // $("#rock").on("click", function() {

    // });
    function choseRock() {
        var x = $(this).attr("id");
        console.log(x);
        if (currentPlayer == 1) {
            playerOnesChoice = x;
            database.ref("choices").set({
                player1: playerOnesChoice
            })
            $(".playerOne > div").hide();
        } else if (currentPlayer == 2) {
            database.ref("choices").set({
                player1: playerOnesChoice,
                player2: x
            })
            $(".playerTwo > div").hide();
        }
    }

    $(document).on("click", ".choices", choseRock)
    $(".playerOne > div").hide();
    $(".playerTwo > div").hide();


    // connectedRef.on("value", function(snap) {
    //   console.log(snap.val());
    //     if (snap.val() && currentPlayer == 1) {
    //         console.log(snap.val());
    //         console.log(currentPlayer);
    //         database.ref("/player1").onDisconnect().set({
    //           disconnect: "yes"
    //         });
    //     }

    // });



    // function player1left() {
    //     if (currentPlayer == 1) {
    //         currentPlayer = 0;
    //         playerOne = false;
    //         database.ref("/player1").set({
    //             name: "remove me 1",
    //             wins: 0,
    //             losses: 0
    //         })
    //     }
    // }
    // connectionsRef.on("value", function(snap) {
    //     $("connected-viewers").html(snap.numChildren());
    // });

    // database.ref().set({
    //     isthisshit: "working"
    // })




    // database.ref().child('.info/connected').on('value', function(connectedSnap) {
    //     if (connectedSnap.val() === true) {
    //         console.log("we in boys");
    //     } else if (connectedSnap.val() === null && currentPlayer == 1) {
    //         console.log("we out boys");
    //         currentPlayer = 0;
    //         playerOne = false;

    //         database.ref("/player1").set({
    //             name: "remove me",
    //             wins: 0,
    //             losses: 0
    //         })

    //     }
    // });





});
