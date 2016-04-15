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
    moveDist: 20,
    blockWidth: 100,
    blockHeight: 100,
    blockInterval: 5000,
    gameHeight: 400,
    rowBlockCounts: [0,0,0,0,0],
    interval: null,
    colors: ["white","red","pink","brown","darkblue","chartreuse","darkorange","fuchsia"],
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
      var color = this.colors[Math.floor(Math.random()*this.colors.length)];
      return color;
    },
    addRow: function(){
      for (var i = 0; i < this.maxRowSize; i++) {
        if (this.rowBlockCounts[i]<4) {
          this.currentBlocks++;
          var id = "block"+this.currentBlocks;
          this.$game.append("<div class='block' id='"+id+"'></div>");
          id="#"+id;
          var bgColor = this.randomColor();
          $(id).css({top:-1*this.blockHeight,left:this.blockWidth*i,backgroundColor:bgColor});
          //fall animation needs to account for existing blocks
          $(id).animate({top: "+="+(this.gameHeight-(this.numRows*this.blockHeight))+"px"},this.speed);
          this.rowBlockCounts[i]++;
        }

      }
      this.numRows++;
      //need to add row of randomized color blocks
      //row needs to "fall" so that it fills in any gaps
      //blocks need to have values for determining location
      //and other shiz
    },
    removeBlock: function(id){
      var removeId = "#"+id;
      $(removeId).remove();
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

  //falling.$block.closest()
  $(document).on('click','div',function(){
    //falling.stopFalling();
    falling.removeBlock(this.id);
    //falling.startFalling();
  });

}); //end
