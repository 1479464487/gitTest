/*2048套路
1、游戏初始化
  （1）棋盘 4*4
  （2）随机棋子
  （3）数据初始化 data[3][3]
2、玩游戏
  （1）触摸或者按键（up,right,down,left）
  （2）合并相同棋子，数据叠加
  （3）判断是否结束游戏
  （4）随机棋子 
3、游戏结束 
*/
/*
1、引入该文件
2、创建一个js文件，_game2048.init(className)  className代码标签
*/   
//面向对象  
(function(window,undefined){
	function Game() {                 //棋盘数据初始化  Game obj start
		this.data = new Array();
		this.isMoveChese = false;     //每次按键时，棋子是否移动，flase表示未移动
		this.isCombine = false;       //是否合并，flase表示未合并
		this.isLastChese = false;     //判断是否为最后一个棋子的标志量，flase表示不是最后一个棋子
		this.gamescore = 0;
		this.flagCombineArr = new Array();//发生合并的位置记录

		this.dataInit = function(){   //棋盘初始化 出现16个小旗盘
			for(var i = 0 ; i < 4; i++) {
				this.data[i] = new Array();
				for(var j = 0; j < 4 ; j++) {
					this.data[i][j] = 0;
				}
			}
		}
		//合并标志数组初始化
		this.flagCombineArrInit = function() {
			for(var i = 0; i < 16; i++) {
				this.flagCombineArr[i] = false;
			}
		}

		this.init = function(className){
			this.dataInit();
			this.cheseInit(className);
			for(var i= 0; i < 2; i++){ //游戏开始时，随机出现俩个棋子
				this.randomChese();
			}
			this.play();
			this.Score();	
		}
		
	}//Game obj end

	//随机棋子
	Game.prototype.randomChese = function() {
		var arrRowAndCol = this.randomCheseRowAndCol();
		if(arrRowAndCol !=0){
			var num =this.randomValue();
			this.drawChese(arrRowAndCol[0],arrRowAndCol[1],num);
		}
	}
	//棋盘初始化  棋子(100px*100px,棋子之间的间隔为2px,棋盘为430px*430px)
	//@param className 游戏棋桌的class   game2048是棋盘的className
	Game.prototype.cheseInit = function(className){
		var game = document.querySelector("." + className);//获取class的name 类选择器
		var chese = document.createElement("div");
		chese.className = "game2048";
		chese.setAttribute("style","width:430px; height:430px; background-color:#B8A99A;"+
			"margin:90px auto;  position: relative;");
		game.appendChild(chese);

		for(var i = 0; i < 4; i++) {		//棋子的位置
			for(var j = 0; j < 4; j++) {
				var c = document.createElement("div");
				c.className = "child";
				c.setAttribute("style","top:" + (i*106+6) + "px;"+
				"left:" + (j*106+6) + "px; width: 100px; height: 100px; "+
				"background-color:#CCC0B2;position: absolute;"+
				"border-radius:8px;");
				chese.appendChild(c);
			}
		}
	}//chese  Init end
		//画棋子  选择随机背景颜色  @param num 棋子上的值
		Game.prototype.SelectBgColor = function(num) {
			switch(num) {
				case 2:
				case 4:
					return "#EBE1D7";
				case 8:
					return "#Efb171";
				case 16:
					return "#F88E63";
				case 32:
					return "#F57D57";
				case 64:
					return "#FA5C3a";
				case 128:
					return "#ECCC73";
				case 256:
					return "#ECCD58";
			}
		}
		//随机棋子  随机初始值  random随机
		Game.prototype.randomValue = function() {
			return (Math.floor(Math.random()*2)+1)*2;
		}

		//棋子右上角的Y的坐标  @param cheseRow 行
		//棋子右上角的X的坐标  @param cheseCol 列
		//棋子的值 @param cheseValue
		Game.prototype.drawChese = function(cheseRow,cheseCol,cheseValue) {
			this.data[cheseRow][cheseCol] = cheseValue;//刷新棋盘
			var chese = document.querySelector(".game2048");
			var child = document.createElement("div");
			child.innerHTML = cheseValue;
			child.className = "children_"+cheseRow+"_"+cheseCol;
			child.setAttribute("style","width: 100px; height: 100px; "+
				"background-color:"+this.SelectBgColor(cheseValue)+
				";color:#fff; text-align:center;"+
				"font-size:2em;  line-height: 100px; border-radius:8px;"+
				"position: absolute; top:"+(106*cheseRow+6)+"px; left:"+(106*cheseCol+6)+"px;"+
				"transition:left .1s, top .4s");
			chese.appendChild(child);

			setTimeout
			//当没有空位的时候，进行游戏胜负判断
			if(this.isLastChese){
				this.isGameOver();
			}

		}

		//随机坐标
		Game.prototype.randomCheseRowAndCol = function() {
			//找到能放棋子的位置，筛选未落子位置
			var arrRowAndCol = new Array();
			var k = 0;
			for(var i = 0; i < 4; i++) {
				for(var j = 0; j < 4; j++) {
					if (this.data[i][j] == 0) {
						arrRowAndCol[k] = [i,j];
						k++;   //k就是未落子数组长度
					}
				}
			}
			//当没有空位的时候，判断胜负
			if(1 == k){
				this.isLastChese = true;
			}
			//棋子占满后，不在随机
			if(k == 0) {
				return 0;
			}else{
		    	var randomNum = Math.floor(Math.random()*k);  //randomNum未落子的所有数组
		    	return arrRowAndCol[randomNum];
		    }
		}
		//玩游戏 
		Game.prototype.play = function() {

			var obj = this;//给游戏对象起别名，防止和js中的this冲突
			document.onkeydown = function(event) {  //1、按键绑定事件
				switch(event.keyCode) {
					case 37:
						obj.gameProcess(37);
						break;
					case 38:
						obj.gameProcess(38);
						break;
					case 39:
						obj.gameProcess(39);
						break;
					case 40:
						obj.gameProcess(40);
						break;
				}
			}
		}//end play
		Game.prototype.gameProcess = function(key) {
			var obj = this;
			this.moveChese(key);  //移动

			//是否随机棋子
			if(obj.isMoveChese){
				setTimeout(function(){
					obj.randomChese();
				}, 405);
			}
		}	

		//移动   GPS[i]//有棋子的位置  index向左移动的距离
		Game.prototype.moveChese = function(key) {

			this.flagCombineArrInit();
			var GPS = this.searchChese(key);
			var len = GPS.length;
			for(var i = 0; i < len; i++) {
				var classNameMove = "children_"+GPS[i][0]+"_"+GPS[i][1];  //？
				var moveObj = document.querySelector("."+classNameMove); //找到偏移对象
				this.isCombine = false;//是否合并
				this.ismoveChese = false;//重新开始
				var index = 0;
				switch(key){
					case 37:
					for(var j = GPS[i][1]-1; j >= 0; j--) {
						if(this.data[GPS[i][0]][j]== 0) {
							index++;
							this.isMoveChese = true;
						}else if (this.data[GPS[i][0]][j] == 
							this.data[GPS[i][0]][GPS[i][1]] && 
						    this.flagCombineArr[GPS[i][0]*4+j] == false) {
							index++;
							this.isMoveChese = true;
							this.isCombine = true;
							break;
						}else{
							break;
						}
					}
					break;
				
					case 38:
					for(var j = GPS[i][0]-1; j >= 0; j--) {
						if(this.data[j][GPS[i][1]] == 0) {
							index++;
							this.isMoveChese = true;
						} else if (this.data[j][GPS[i][1]] == 
							this.data[GPS[i][0]][GPS[i][1]] && 
						    this.flagCombineArr[j*4+GPS[i][1]] == false) {
							index++;
							this.isMoveChese = true;
							this.isCombine = true;
							break;
						}else{
							break;
						}
					}
					break;
					case 39:
					for(var j = GPS[i][1]+1; j <= 3; j++) {
						if(this.data[GPS[i][0]][j] == 0) {
							index--;
							this.isMoveChese = true;
						}else if (this.data[GPS[i][0]][j] == 
							this.data[GPS[i][0]][GPS[i][1]] && 
						    this.flagCombineArr[GPS[i][0]*4+j] == false){
							index--;
							this.isMoveChese = true;
							this.isCombine = true;
							break;
						}else{
							break;
						}
					}
					break;
					case 40:
					for(var j = GPS[i][0]+1; j <= 3; j++) {
						if(this.data[j][GPS[i][1]]== 0) {
							index--;
							this.isMoveChese = true;
						}else if (this.data[j][GPS[i][1]] == 
							this.data[GPS[i][0]][GPS[i][1]] && 
						    this.flagCombineArr[j*4+GPS[i][1]] == false) {
							index--;
							this.isMoveChese = true;
							this.isCombine = true;
							break;
						}else{
							break;
						}
					}
					break;
				}
				
				if(index != 0){
					switch(key) {
						case 37:
						case 39:
							moveObj.style.left = moveObj.style.left.replace("px","")
							-0-index*106+"px";
							//更新data
							this.data[GPS[i][0]][GPS[i][1]-index] = 
							this.data[GPS[i][0]][GPS[i][1]];
							this.data[GPS[i][0]][GPS[i][1]] = 0;
							moveObj.className = "children_"+GPS[i][0]+"_"+(GPS[i][1]-index);
							break;
						case 38:
						case 40:
							moveObj.style.top = moveObj.style.top.replace("px","")
							-0-index*106+"px";
							//更新data
							this.data[GPS[i][0]-index][GPS[i][1]] = 
							this.data[GPS[i][0]][GPS[i][1]];
							this.data[GPS[i][0]][GPS[i][1]] = 0;
							moveObj.className = "children_"+(GPS[i][0]-index)+"_"+GPS[i][1];
							break;
					}
					
					if(this.isCombine) {
						var parent = document.querySelector(".game2048");
						var childs = document.querySelectorAll("."+ moveObj.className);
						var lenChilds = childs.length;
						for(var d = 0; d < lenChilds; d++) {
							parent.removeChild(childs[d]);
						}
						switch(key) {
							case 37:
							case 39:
								this.data[GPS[i][0]][GPS[i][1]-index] *= 2;
								this.drawChese(GPS[i][0],GPS[i][1]-index,
								this.data[GPS[i][0]][GPS[i][1]-index]);
								this.flagCombineArr[GPS[i][0]*4+GPS[i][1]-index] = true;
								this.gamescore += this.data[GPS[i][0]][GPS[i][1]-index];
								this.Score();
								break;
							case 38:
							case 40:
								this.data[GPS[i][0]-index][GPS[i][1]] *= 2;
								this.drawChese(GPS[i][0]-index,GPS[i][1],
								this.data[GPS[i][0]-index][GPS[i][1]]);
								this.flagCombineArr[(GPS[i][0]-index)*4+GPS[i][1]]= true;
								this.gamescore += this.data[GPS[i][0]-index][GPS[i][1]];
								this.Score();
								break;

						}
					}
				}
			}
		}
		//判断有棋子的位置
		//@param key 反转棋子数组的标志，37，38不反转，39，40反转
		Game.prototype.searchChese = function(key) {
			var GPS = new Array();
			var k = 0;
			for(var i = 0; i < 4; i++) {
				for(var j = 0; j < 4; j++) {
					if(this.data[i][j] != 0) {
						GPS[k] = [i,j];
						k++;
					}
				}
			}
			switch (key) {
				case 37:
				case 38:
					return GPS;
				case 39:
				case 40:
					return GPS.reverse();//反转方法
			}
		}
		//判断棋子胜负
		Game.prototype.isGameOver = function() {
			var flag = false;

			for(var i = 0; i < 4; i++){
				for(var j = 0; j < 4; j++) {
					if( i!=0 && this.data[i][j] == this.data[i-1][j]) {
						flag = true;
						break; 
					}else if(j!=3 && this.data[i][j] == this.data[i][j+1]) {
						flag = true;
						break; 
					}else if(i!=3 && this.data[i][j] == this.data[i+1][j]) {
						flag = true;
						break;
					}else if(j!=0 && this.data[i][j] == this.data[i][j-1]) {
						flag = true;
						break;}
				}
				if(flag) {
					break;
				}
			} 
			if(!flag) {
				this.isLastChese = false;
				this.gamescore = 0 ;
				setTimeout(function(){

					alert("游戏结束");
					var game2048 = document.querySelector(".game2048");
					game2048.parentNode.removeChild(game2048);
					game.init("game");
				},555)
			}else  {
				this.isLastChese = false;
			}
		}


		Game.prototype.Score = function() {
			var parent = document.querySelector(".game");
			var score = document.createElement("div");
			score.setAttribute("style","width:150px; height: 80px; background-color: white;"+
				"position: absolute; top: 0px; left: 0px; right: 0px;margin: 0px auto;"+
				" font-size: 1.8em; text-align: center; line-height: 80px");
			score.innerHTML = this.gamescore;
			parent.appendChild(score);
		}

	// w._game2048 = Game;
	window._game2048 = new Game();
})(window)

// var game = new _game2048;
_game2048.init("game");

