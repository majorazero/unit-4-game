let charList;
let currTargetIndex;
let playerIndex;
init();
//sets initial game state, also works as a reset
function init(){
  //list of characters with stats.
  charList = [{
      name: "Darth Vader",
      picId: "dVader",
      healthPoint: 100,
      attackPower: 12,
      baseAttack: 12,
      counterAttackPower: 32,
      playerChar: false,
      currTarget: false
    },
    {
      name: "Jabba",
      picId: "jabba",
      healthPoint: 300,
      attackPower: 4,
      baseAttack: 4,
      counterAttackPower: 2,
      playerChar: false,
      currTarget: false
    },
    {
      name: "Darth Jar Jar",
      picId: "jarJar",
      healthPoint: 600,
      attackPower: 1,
      baseAttack: 1,
      counterAttackPower: 15,
      playerChar: false,
      currTarget: false
    },
    {
      name: "Some Guy",
      picId: "derp",
      healthPoint: 80,
      attackPower: 100,
      baseAttack: 100,
      counterAttackPower: 1,
      playerChar: false,
      currTarget: false
    }
  ];
  currTargetIndex = null; //determines if there is a current target, and what the pos is.
  playerIndex = null; //determines where the player character is.
  //generate character plate for character select
  for (let i = 0; i < charList.length; i++) {
    let plate = plateMake(i);
    // so forth...
    plate.on("click",function(){
      charList[plate.id].playerChar = true; //sets whatever character selected as player character
      playerIndex = plate.id;
      gameSet(); //triggers gameSet function
    });
    //we'll append this all to the characters div
    $("#characters").append(plate);
  }
}

//deals with attack button logic
$("#attackButton").on("click",function() {
  $("#gameMessage").text(""); //resets message
  if (currTargetIndex != null && playerIndex != null){ //meaning that there is a current target. the game can start.
    let player = charList[playerIndex];
    let enemyTarget = charList[currTargetIndex];
    //target takes dmg from player, deducts health by current player attack
    enemyTarget.healthPoint -= player.attackPower;
    //player takes counter attack damage
    player.healthPoint -= enemyTarget.counterAttackPower;
    //we display what's happening
    $("#gameMessage").html(player.name +" attacks "+
                          enemyTarget.name+" for "+
                          player.attackPower+" damage!<br>"+
                          enemyTarget.name+" hits back for "+
                          enemyTarget.counterAttackPower+" damage!");
    //plates should update...
    $(".id"+playerIndex+" .healthPoint").text(player.healthPoint); //should update player health
    $(".id"+currTargetIndex+" .healthPoint").text(enemyTarget.healthPoint);//update enemy health
    //player's attack should now improved based on their baseAttack stats
    player.attackPower += player.baseAttack;
    //we check if the opponent is dead.
    if(enemyTarget.healthPoint <= 0) { //if their health is 0 or below
      if(player.healthPoint <= 0) { // if you both died at the same time.
        $("#gameMessage").text("You are both slain! How did that happen?");
        $("#tryAgain").show();
        $("#attackButton").hide();
        return;
      }
      $("#gameMessage").text("You defeated "+enemyTarget.name+"!");
      //we need to renable the onclick function for the leftover recipients.
      for(let i = 0; i < charList.length; i++) {
        //we'll only renable the onclick if it is NOT the player or enemyTarget
        if (i !== playerIndex && i !== currTargetIndex){
          $(".id"+i).on("click",function(){
            charList[i].currTarget = true; //sets this character as currender defender
            currTargetIndex = i; //also declares to world that there is a current target and the game can start
            $("#defender").append(this);
            $(".charPlate").off("click"); //turns off all click events again
          });
        }
      }
      //remove dead defender.
      $("#defender .id"+currTargetIndex).remove();
      //since enemy is dead, we need to reset currTargetIndex to null
      currTargetIndex = null;
    }
    //if only you died.
    else if (player.healthPoint <= 0) {
      $("#gameMessage").text("You got slain! Idiot! LOL.");
      //should replace attack button with try again button.
      $("#tryAgain").show();
      $("#attackButton").hide();
      return;
    }
  }
  else {
    $("#gameMessage").text("There is no target!"); //informs the player there is no target.
  }
});
//try again button resets the game.
$("#tryAgain").on("click", function(){
  console.log("hello");
  $("#gameMessage").text("");
  $("#characters").empty();
  $("#enemies").empty();
  $("#defender").empty();
  init();
  $("#tryAgain").hide();
  $("#attackButton").show();
});

//constructs plates
function plateMake(index){
  let plate = $("<div>"); //<div></div>
  plate.addClass("charPlate id"+index);
  plate.append("<div class='plateName'>"+charList[index].name+"<div>"); //appends the name
  plate.append("<img class='img-fluid platePic' src='assets/images/"+charList[index].picId+".jpeg'>");
  plate.append("<div class='healthPoint'>"+charList[index].healthPoint+"</div>");
  plate.id = index;
  return plate;
}

//will move the gameBoard to the proper place
function gameSet(){
  $(".charPlate").off("click"); //turns off all previous click events
  for(let i = 0; i< charList.length; i++) { //look for whoever is or isnt player char
    if(charList[i].playerChar === false){ //if its an enemy append to enemy board
      $(".id"+i).detach(); //removes previous non-player elements

      let plate = plateMake(i);
      //well add a choose your enemy function
      plate.on("click", function() { //if picked will set self to defender
        charList[plate.id].currTarget = true; //sets this character as currender defender
        currTargetIndex = plate.id; //also declares to world that there is a current target and the game can start
        $("#defender").append(this);
        $(".charPlate").off("click"); //turns off all click events again
      });
      $("#enemies").append(plate);
    }
  }
}
