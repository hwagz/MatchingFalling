$(document).ready(function(){
  //WARNING: Still in progress. Actual game mechanic not yet implemented. Clicky-fally works though.

  /* Goal: A sort of tetris/bejeweled hybrid.
    Every ~3 seconds, a row of 5 blocks is dropped from the top of the gamespace and falls in to fill gaps. Clicked blocks are removed if there is more than one of the same color touching it, and all blocks of that color are removed.
    Each row will need a current block count. Maybe separate thing/object constructor for the blocks?
    Loop with recursive function for adjacent block determination

    THOUGHTS: Scratch the bejeweled BS. .5s timer and color matching to color panel (that DNE yet), deduct points for wrong answers, gets faster,
  */



  var falling = {
    currentBlocks: 0,
    maxRowSize: 5,
    speed: 750,
    blockObjs: [],
    blockWidth: 100,
    blockHeight: 100,
    blockInterval: 3000,
    gameHeight: 400,
    blockCounts: [0,0,0,0,0],
    interval: null,
    matchBlock: null,
    score: 0,
    colors: ["red","blue","chartreuse","orange","fuchsia"],
    init: function(){
      this.cacheDom();
      this.bindEvents();
      this.centerElement(this.$game);
      this.startFalling();
      this.createMatchBlock();
    },
    cacheDom: function(){
      this.$game = $('.game');
      this.$window = $(window);
      this.$block = $('.block');
      this.$doc = $(document);
      this.$scoring = $('.scoring');
      this.$currentScore = $('#currentScore');
    },
    bindEvents: function(){
      //double firing. Not sure why. Double calling function maybe?
      this.$doc.on('click','div',function(){
        falling.removeBlock(this.id);
        // Googling got some answers. ret false is the one that works
        return false;
      });
    },
    centerElement: function($el){
      var desiredx = this.$window.width()/2-$el.width()/2;
      var desiredy = this.$window.height()/2-$el.height()/2;
      $el.css({left:desiredx,top:desiredy});
      // Also position scoring div at the same time
      var scoringLeft = desiredx/2-falling.$scoring.width()/2;
      falling.$scoring.css({left:scoringLeft,top:desiredy});
    },
    randomColor: function(){
      return this.colors[Math.floor(Math.random()*this.colors.length)];
    },
    createBlockObj: function(idStr,colNum,rowNum){
      return {
        init: false,
        id: idStr,
        class: 'block',
        col: colNum,
        row: rowNum,
        color: this.randomColor()
      };
    },
    fall: function(aBlockObj){
      var fallDist = (falling.gameHeight-(aBlockObj.row*falling.blockHeight));
      var fallSpeed = falling.speed;
      if (aBlockObj.init) {
        fallDist = falling.blockHeight;
        fallSpeed = falling.speed/2;
        aBlockObj.row--;
      }
      $("#"+aBlockObj.id).animate({top: "+="+fallDist+"px"},fallSpeed);
    },
    addRow: function(){
      for (var i = 0; i < this.maxRowSize; i++) {
        if (this.blockCounts[i]<4) {
          this.currentBlocks++; //increments total blocks
          var id = "block"+this.currentBlocks;
          this.blockObjs.push(this.createBlockObj(id,i,this.blockCounts[i]));
          var endIndex = falling.blockObjs.length-1; //calc once
          this.$game.append("<div class='block' id='"+id+"'></div>");
          $("#"+id).css({top:-1*this.blockHeight,left:this.blockWidth*i, backgroundColor: falling.blockObjs[endIndex].color});
          this.fall(falling.blockObjs[endIndex]);
          falling.blockObjs[endIndex].init = true; //boolean for later
          this.blockCounts[i]++; //increments blocks in this column
        }
      }
    },
    dropAboveBlocks: function(index,row,col){
      for (var i = index+1; i < falling.blockObjs.length; i++) {
        if (falling.blockObjs[i].col===col && falling.blockObjs[i].row>row) {
          falling.fall(falling.blockObjs[i]);
        }
      }
    },
    removeBlock: function(id){
      var colNum, rowNum, saveIndex, color;
      for (var i = 0; i < falling.blockObjs.length; i++) {
        if (falling.blockObjs[i].id==id) {
          colNum = falling.blockObjs[i].col;
          rowNum = falling.blockObjs[i].row;
          color = falling.blockObjs[i].color;
          falling.blockObjs.splice(i,1);
          saveIndex = i-1;//save for later, decrement because splice
        }
      }
      $("#"+id).remove();
      //getting called twice?
      this.updateScore(color);
      this.changeMatchColor();
      this.blockCounts[colNum]--;
      this.dropAboveBlocks(saveIndex,rowNum,colNum);
    },
    changeMatchColor: function(){
      this.matchBlock.color = this.randomColor();
      this.$mB.css({backgroundColor: this.matchBlock.color});
      this.$scoring.css({color: this.matchBlock.color})
    },
    createMatchBlock: function(){
      this.matchBlock = this.createBlockObj("matchBlock");
      this.$scoring.append("<div class="+this.matchBlock.class+" id='"+this.matchBlock.id+"'></div>");
      this.$mB = $('#'+this.matchBlock.id);
      var desiredx = this.$scoring.width()/2-this.$mB.width()/2;
      this.$mB.css({left: desiredx, backgroundColor: this.matchBlock.color});
    },
    updateScore: function(color){
      if (color==this.matchBlock.color) {
        // Right answer reward
        this.score+=10;
      }
      else {
        // Wrong answer penalty
        this.score-=20;
      }
      this.$currentScore.html(this.score);
    },
    startFalling: function(){
      this.interval = setInterval(function () {
        falling.addRow();
      }, falling.blockInterval);
    },
    stopFalling: function(){
      // Currently unused, but pause function would be good
      clearInterval(this.interval);
    }
  };
  falling.init();

}); //end
