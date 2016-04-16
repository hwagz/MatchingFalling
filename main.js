$(document).ready(function(){
  /* Goal: A sort of tetris/bejeweled hybrid.
    Every ~3 seconds, a row of 5 blocks is dropped from the top of the gamespace and falls in to fill gaps. Clicked blocks are removed if there is more than one of the same color touching it, and all blocks of that color are removed.
    Each row will need a current block count. Maybe separate thing/object constructor for the blocks?
    Loop with recursive function for adjacent block determination
  */

  var falling = {
    currentBlocks: 0,
    numRows: 0,
    maxRowSize: 5,
    speed: 750,
    blockObjs: [],
    blockWidth: 100,
    blockHeight: 100,
    blockInterval: 5000,
    gameHeight: 400,
    blockCounts: [0,0,0,0,0],
    interval: null,
    colors: ["red","darkblue","chartreuse","darkorange","fuchsia"],
    init: function(){
      this.cacheDom();
      this.centerElement(this.$game);
      this.startFalling();
    },
    cacheDom: function(){
      this.$game = $('.game');
      this.$window = $(window);
      this.$block = $('.block');
    },
    centerElement: function($el){
      var desiredx = this.$window.width()/2-$el.width()/2;
      var desiredy = this.$window.height()/2-$el.height()/2;
      $el.css({left:desiredx,top:desiredy});
    },
    randomColor: function(){
      return this.colors[Math.floor(Math.random()*this.colors.length)];
    },
    createBlockObj: function(idStr,colNum,rowNum){
      return {
        init: false,
        id: idStr,
        col: colNum,
        row: rowNum
      };
    },
    fall: function(aBlockObj){
      var fallDist = (falling.gameHeight-(aBlockObj.row*falling.blockHeight));
      if (aBlockObj.init) {
        fallDist = falling.blockHeight;
        aBlockObj.row--;
      }
      console.log(fallDist);
      $("#"+aBlockObj.id).animate({top: "+="+fallDist+"px"},falling.speed);
    },
    addRow: function(){
      for (var i = 0; i < this.maxRowSize; i++) {
        if (this.blockCounts[i]<4) {
          this.currentBlocks++;
          var id = "block"+this.currentBlocks;
          this.blockObjs.push(this.createBlockObj(id,i,this.blockCounts[i]));
          var endIndex = falling.blockObjs.length-1;
          this.$game.append("<div class='block' id='"+id+"'></div>");
          id="#"+id;
          var bgColor = this.randomColor();
          $(id).css({top:-1*this.blockHeight,left:this.blockWidth*i,backgroundColor:bgColor});
          this.fall(falling.blockObjs[endIndex]);
          falling.blockObjs[endIndex].init = true;
          this.blockCounts[i]++;
        }
      }
    },
    removeBlock: function(id){
      var colNum;
      var rowNum;
      var saveIndex;
      for (var i = 0; i < falling.blockObjs.length; i++) {
        if (falling.blockObjs[i].id==id) {
          colNum = falling.blockObjs[i].col;
          rowNum = falling.blockObjs[i].row;
          falling.blockObjs.splice(i,1);
          saveIndex = i;
        }
      }
      falling.blockCounts[colNum]--;
      $("#"+id).remove();
      for (var i = saveIndex+1; i < falling.blockObjs.length; i++) {
        if (falling.blockObjs[i].col===colNum && falling.blockObjs[i].row>rowNum) {
          //falling.blockObjs[i].row;
          falling.fall(falling.blockObjs[i]);
        }
      }
    },
    startFalling: function(){
      this.interval = setInterval(function () {
        falling.addRow();
      }, falling.blockInterval);
    },
    stopFalling: function(){
      clearInterval(this.interval);
    }
  };
  falling.init();


  $(document).on('click','div',function(){
    falling.removeBlock(this.id);
  });

}); //end
