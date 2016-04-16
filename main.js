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
    colors: ["red","blue","chartreuse","orange","fuchsia"],
    init: function(){
      this.cacheDom();
      this.bindEvents();
      this.centerElement(this.$game);
      this.startFalling();
    },
    cacheDom: function(){
      this.$game = $('.game');
      this.$window = $(window);
      this.$block = $('.block');
      this.$doc = $(document);
    },
    bindEvents: function(){
      this.$doc.on('click','div',function(){
        falling.removeBlock(this.id);
      });
    },
    centerElement: function($el){
      var desiredx = this.$window.width()/2-$el.width()/2;
      var desiredy = this.$window.height()/2-$el.height()/2;
      $el.css({left:desiredx,top:desiredy});
    },
    randomColor: function(){
      return this.colors[Math.floor(Math.random()*this.colors.length)];
    },
    createBlockObj: function(idStr,colNum,rowNum,bgColor){
      return {
        init: false,
        id: idStr,
        col: colNum,
        row: rowNum,
        color: bgColor
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
          var id = "block"+this.currentBlocks; //build block id
          var bgColor = this.randomColor(); //get color
          this.blockObjs.push(this.createBlockObj(id,i,this.blockCounts[i],bgColor)); //add block obj to array
          var endIndex = falling.blockObjs.length-1; //only needs calc'd once
          this.$game.append("<div class='block' id='"+id+"'></div>");
          id="#"+id; //update id for jQ shenanigans
          $(id).css({top:-1*this.blockHeight,left:this.blockWidth*i,backgroundColor:bgColor}); //set position and color
          this.fall(falling.blockObjs[endIndex]);
          falling.blockObjs[endIndex].init = true; //boolean for later
          this.blockCounts[i]++; //increments blocks in the specified column
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
    removeAdjacent: function(){
      /*
      Needs to check for color iterating through each block to the
      left, then each block to the right, and up each time recursively.
      To-be-removed blocks all added to an array avoiding duplicates

      Iteration might be wonky because block objs are stored in an
      array. Would need to iterate via col and row values. May be
      easy and I just don't know exactly how
      */
    },
    removeBlock: function(id){
      var colNum, rowNum, saveIndex;
      for (var i = 0; i < falling.blockObjs.length; i++) {
        if (falling.blockObjs[i].id==id) {
          colNum = falling.blockObjs[i].col;
          rowNum = falling.blockObjs[i].row;
          falling.blockObjs.splice(i,1);
          saveIndex = i-1;//save for later, decrement because splice
        }
      }
      $("#"+id).remove();
      falling.blockCounts[colNum]--;
      falling.dropAboveBlocks(saveIndex,rowNum,colNum);
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
