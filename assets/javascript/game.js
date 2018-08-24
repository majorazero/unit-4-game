//list of characters with stats.
let charList = [{
    name: "Darth Vader",
    picId: "dVader",
    healthPoint: 100,
    attackPower: 12,
    counterAttackPower: 32,
    playerChar: false,
    currTarget: false
  },
  {
    name: "Jabba",
    picId: "jabba",
    healthPoint: 300,
    attackPower: 4,
    counterAttackPower: 2,
    playerChar: false,
    currTarget: false
  },
  {
    name: "Darth Jar Jar",
    picId: "jarJar",
    healthPoint: 600,
    attackPower: 1,
    counterAttackPower: 15,
    playerChar: false,
    currTarget: false
  },
  {
    name: "Some Guy.",
    picId: "derp",
    healthPoint: 50,
    attackPower: 100,
    counterAttackPower: 1,
    playerChar: false,
    currTarget: false
  }
]
//generate character plate for character select
for (let i = 0; i < charList.length; i++) {
  let plate = plateMake(i);
  plate.id = i;
  // so forth...
  plate.on("click",function(){
    charList[plate.id] = true; //sets whatever character selected as player character
    gameSet(); //triggers gameSet function
  });
  //we'll append this all to the characters div
  $("#characters").append(plate);
}
//constructs plates
function plateMake(index){
  let plate = $("<div>"); //<div></div>
  plate.addClass("charPlate id"+index);
  plate.append("<div class='plateName'>"+charList[index].name+"<div>"); //appends the name
  plate.append("<img class='img-fluid platePic' src='assets/images/"+charList[index].picId+".jpeg'>");
  plate.append("<div class='healthPoint'>"+charList[index].healthPoint+"</div>");
  return plate;
}

//will move the gameBoard to the proper place
function gameSet(){
  $(".charPlate").off("click"); //turns off all previous click events
  for(let i = 0; i< charList.length; i++) { //look for whoever is or isnt player char
    console.log(charList[i].playerChar);
    if(charList[i].playerChar === false){ //if its an enemy append to enemy board
      $(".id"+i).remove(); //removes previous non-player elements

      let plate = plateMake(i);
      //well add a choose your enemy function
      plate.on("click", function() { //if picked will set self to defender
        $("#defender").append(this);
        $(".charPlate").off("click"); //turns off all click events again
      });
      $("#enemies").append(plate);
    }
  }
}
