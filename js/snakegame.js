/** Jozef Lacko 2017 Snake game */

$( document ).ready(function() {
    console.log( "snake is ready!" );
	
	FastClick.attach(document.body);
	
	/** every object is composed from dots */
	function Dot(x, y, color){
		
		var size = 10;			
		
		this.x = x;
		this.y = y;	
		this.color = color;	
		
		this.getSize = function(){
			return size;
		}
		this.getDotSize = function(){
			// circle 
			// return size / 2.8;
			
			// rectangle
			return size / 1.5;
			
		}
	}		
	/** My pen it ctx */
	Dot.prototype.draw = function( pen ){
		pen.fillStyle = this.color;
		pen.beginPath();
		
		// circle
		//pen.arc(this.x, this.y, this.getDotSize(), 0, 2*Math.PI , false); 
		
		// rectangle
		pen.fillRect( this.x, this.y, this.getDotSize() , this.getDotSize() );
		
		pen.fill();	
		pen.closePath();
	
	};
	
	/** same as draw but dot is bigger */
	Dot.prototype.clearDot = function( pen, color ){		
		pen.fillStyle = color;		
		pen.beginPath();
		
		// circle
		pen.arc(this.x, this.y, this.getSize(), 0, 2*Math.PI , false);
		
		// rectangle
		pen.fillRect( this.x, this.y, this.getSize() , this.getDotSize() ); // i could use clear rect
		
		pen.fill();	
		pen.closePath();
	}
	
	function Kitchen( gameArea , pen ){
		
		var food;
		var pen;
		
		this.cookFood = function(){			
			var border = 20;
			var x = _getRandom( (gameArea.minWidth  + border), (gameArea.maxWidth  - border) );
			var y = _getRandom( (gameArea.minHeight + border), (gameArea.maxHeight - border) );

			food = new Dot(x, y, 'red');
			food.draw( pen );
		}
		
		this.eatFood = function( myPosition ){
			if( myPosition.x == food.x && myPosition.y === food.y ){
				food = undefined;
				return true;
			}
			
			food.draw( pen );
			return false;			
		}
		
		// private ------------------------------
		function _getRandom(min, max) {
		 
				var number = 0;
				 
				min = Math.ceil(min);
				max = Math.floor(max);
				number = ( Math.floor(Math.random() * (max - min) ) + min ); //get random number
				number = ( Math.round(number/10) )*10; //round it to 10
				  
				return number;
		}
	}
	function Snake(){		
		
		var snake = this;
		var speed = 450;
		var length = 3;
		
		snake.getDirections = function(){
			return {
				left:  		{ name:'left'  		, values:[ 100, 37 ], opposite:'right'  }, 
				right: 		{ name:'right' 		, values:[ 102, 39 ], opposite:'left'   },
				up:    		{ name:'up'    		, values:[ 104, 38 ], opposite:'down'   },
				down:  		{ name:'down'  		, values:[  98, 40 ], opposite:'up'     },
				turnLeft:   { name:'turnRight'  , values:[  32     ] 			  },
				turnRight:  { name:'turnRight'  , values:[  80     ] 			  },
			} 
		};
		
		snake.body = _createBody( 50, 50, 'green', length );
		snake.direction = this.getDirections().right;

		snake.getSpeed = function(){
			return speed;
		};
		snake.goFaster = function() {
			speed = speed - (speed / 15);
		};
		snake.grow = function() {
			length++;	
			var head = snake.body[0];
			snake.body.unshift(head);  
		};
		
		/** return snake body. on posiiton[0] is head */
		function _createBody( x, y, color, length ){
			
			var body = [];			
			for(var i=0; i<length; i++)	{
				var dot = new Dot(x,y, color );
				body.push( dot );
				x -= ( dot.getSize() ); // set how far dots will be
			}	
			return body;
		}
	}
	Snake.prototype.draw = function( pen ){
		
		var body = this.body;
		for( var i=0; i<body.length; i++ ){
			var dot = body[i];
			if( i === 0)
				dot.color = 'black';			
			
			dot.draw( pen ); // prototype function of dot
			
			if( i === 0)
				dot.color = 'green';	
		}
	};
	Snake.prototype.move = function( pen, gameArea ){
		
		// snake current information
		var snake = this;		
		var direction = snake.direction;
		var directions = this.getDirections();
		var snakeHead = snake.body[ 0 ];	
		var snakeEnd  = snake.body[ snake.body.length - 1 ]; // will be overpainted with black and removed 
		
		// this will be new on snake
		var newHead = new Dot( snakeHead.x , snakeHead.y, snakeHead.color ); 
		var step = ( newHead.getSize() ); 
		
		// read new position
		if( equals( direction, directions.down  ) ){ 
			newHead.y += step; 
		}
		if( equals( direction, directions.up    ) ){ 
			newHead.y -= step; 
		}
		if( equals( direction, directions.left  ) ){ 
			newHead.x -= step; 
		}
		if( equals( direction, directions.right ) ){ 
			newHead.x += step; 
		}		

		// resolve if snake will go to the wall
		if ( newHead.x >= gameArea.maxWidth  && equals( direction, directions.right )) 
			newHead.x = gameArea.minWidth;
		if ( newHead.x <  gameArea.minWidth  && equals( direction, directions.left  ))
			newHead.x = gameArea.maxWidth - step;
		if ( newHead.y <  gameArea.minHeight && equals( direction, directions.up    )) 
			newHead.y = gameArea.maxHeight;
		if ( newHead.y >= gameArea.maxHeight && equals( direction, directions.down  )) 
			newHead.y = gameArea.minHeight;	
			
		if ( _willICrash() ){
			
			return true;
		} else {
			// draw new position
			snakeEnd.color = gameArea.color;
			snakeEnd.clearDot( pen, gameArea.color );
			snake.body.pop(); // pop() -> remove last element of an array
			snake.body.unshift( newHead ); // unshift() -> add element on beginning of an array
			snake.draw( pen );	
			
			return false;
		}
		
		// private -----------------------------
		function _willICrash(){
			var result = false;
			for(var i=0; i< snake.body.length; i++){
				if( snake.body[i].x === newHead.x && snake.body[i].y === newHead.y){					
					result = true;
					break;
				}				
			}
			return result;
		}	
	};	

		
	function Game( autostart ){		
		this.canvas = document.getElementById("snake-canvas");
		this.ctx = this.canvas.getContext("2d");		
		this.buttonsBinding();			
		
		this.ripImg = new Image();
		this.ripImg.src = './img/rip.png';
			
		if( autostart === true )
			this.start();
	};
	Game.prototype.start = function(){	
		
		var game = this;
		
		// new game			
		game.keepPlaying = true;
		
		// new playground
		game.gameArea = { maxWidth : game.canvas.width, maxHeight : game.canvas.height, minWidth : 0, minHeight : 0, color : 'white' };				
		
		this.ctx.fillStyle = this.gameArea.color;
		this.ctx.fillRect( 0, 0, this.gameArea.maxWidth , this.gameArea.maxHeight );
		
		// new food
		game.kitchen = new Kitchen( game.gameArea , game.ctx );
		game.kitchen.cookFood();
		
		// new snake
		game.snake = new Snake();	
		
		// lets have fun !
		game.keyBindings();	
		game.move();
		
	};
	Game.prototype.move = function(){
		
		if ( this.keepPlaying === false )
			alertify.alert('restart game!');
		
		var game = this;
		
		// animate 
		game.intervalId = setInterval( _moving, game.snake.getSpeed() );
		
		
		// private ---------------------------
		function _moving(){
			
			if( game.keepPlaying === false ){
				game.pause();
				return;
			}				
			
			// move return true when his move is allowed and false when something happened
			var _didICrash = game.snake.move( game.ctx, game.gameArea );	
			
			if ( _didICrash === true ){	
				alertify.alert('Ups, you just r killed yourself! Your life energy was '+game.score.get());
				game.stop();				
				_ripImg();				
				return;
			}	
			
			var allEaten = game.kitchen.eatFood( game.snake.body[0] );
			
			if ( allEaten === true ) {
				game.kitchen.cookFood( game.ctx );
				game.snake.goFaster();
				game.snake.grow();
				game.resume(); // clear interval and read speed once again
				
				game.score.add();				
			}			
			game.score.minusPoint();	

			if ( game.score.get() < 0 ){
				alertify.alert('Sorry, you starved your snake to death!');
				game.stop();
				_ripImg();
				return;
			}
			
			function _ripImg(){
				var img = game.ripImg;
				var cns = game.canvas;	
				game.ctx.drawImage( img, 0, 0, img.width, img.height, 0, 0, cns.width, cns.height);
			}	
		}	
	}
	Game.prototype.pause = function(){
		this.keepPlaying = false;
		clearInterval( this.intervalId );		
	}
	Game.prototype.resume = function(){
		this.pause();		
		this.keepPlaying = true; // to be able to continue	
		this.move();
	};
	Game.prototype.stop = function(){		
		
		if ( this.ctx !== undefined && this.gameArea !== undefined) {
			this.ctx.fillStyle = this.gameArea.color;
			this.ctx.fillRect( 0, 0, this.gameArea.maxWidth , this.gameArea.maxHeight );
		}		
		
		var unbind = true;
		this.keyBindings( unbind );		
		
		this.pause();		
		this.score.reset();
		this.snake = this.kitchen = this.gameArea = undefined;	

		// TODO THIS IS DUPLICATION, MOVE OUT!
		var $play = btn('snake-play-game');
		var $pause = btn('snake-pause-game');		
		var $stop = btn('snake-stop-game');
		
		var c = {
			disabled : 'btn-disabled',	
			paused : 'game-paused',
		};
		
		$play.removeClass(c.disabled);		
		$stop.addClass(c.disabled);				
		$pause.addClass(c.disabled).removeClass(c.paused);
		// TODO THIS IS DUPLICATION, MOVE OUT!
	};
	Game.prototype.score = (function(){
		
		var _startWithMinusPoints = false;
		var _times = 1;
		var _table = $('#status');
		var _score = 0;			
		var _print = function(){	
			var sentence = 'Your life energy '+_score;
			_table.html(sentence);
		}		
		
		return {			
			minusPoint : function(){
				if ( _startWithMinusPoints ){
					--_score;
					_print();	
				}				
			},
			add : function(){	
				_times = 1.1 * _times;
				_score = 70 + parseInt( _score * ( _times / 5 ) , 10);		
				
				if ( _startWithMinusPoints === false )
					_startWithMinusPoints = true;
				
				_print();
			},
			get : function(){
				return _score;
			},
			reset : function(){
				_score = 0;
				_startWithMinusPoints = false;
				_table.html('');
			}
		}		
	})();
	Game.prototype.keyBindings = function ( unbind ) {
		
		var game = this;
		
		if ( unbind === true ){
			$(document).off('keydown');
			return;
		}		

		var directions = game.snake.getDirections();		
		
		$(document).on('keydown', function ( e ) {			 
			var pressedKey = ( e.which || e.keyCode ) | 0;
			var current = game.snake.direction;
			 _setDirection();
			 
			 // private methods
			function _setDirection(){		
				var keys = Object.keys(directions);
				for(var i=0; i<keys.length; i++){
					var key = keys[i];
					var direction = directions[key];				
					var didIpressOpossite = direction.name === current.opposite;
					if( _containsKey( direction ) &&  ! didIpressOpossite ){						
						
						if ( equals( direction, directions.turnRight ) ) 
							game.snake.direction = _turnRight();
						else if (  equals( direction, directions.turnLeft ) ) {
							game.snake.direction = _turnLeft();
						} else {
							game.snake.direction = direction;
						}						
					}	
				}
			}			
			function _containsKey( who ){
				return who.values.indexOf( pressedKey ) > -1;
			}
		});
		
		function _turnRight(){
			
			var curr = game.snake.direction;
			var d;
			
			 if ( equals( curr, directions.left )) 
				d = directions.up;
			else if ( equals( curr, directions.up )) 
				d = directions.right;
			else if ( equals( curr, directions.right )) 
				d = directions.down;
			else if ( equals( curr, directions.down )) 
				d = directions.left;		
			
			return game.snake.direction = d;
		}
		
		function _turnLeft(){
			
			var curr = game.snake.direction;
			var d;
			
			 if ( equals( curr, directions.left )) 
				d = directions.down;
			else if ( equals( curr, directions.down )) 
				d = directions.right;
			else if ( equals( curr, directions.right )) 
				d = directions.up;
			else if ( equals( curr, directions.up )) 
				d = directions.left;		
			
			return game.snake.direction = d;
		}
	};
	Game.prototype.buttonsBinding = function ( unbind ) {
		
		var $play = btn('snake-play-game');
		var $pause = btn('snake-pause-game');		
		var $stop = btn('snake-stop-game');
		var $turnRight = btn('snake-turn-right');
		var $turnLeft = btn('snake-turn-left');
		var $up = btn('go-up');
		var $down = btn('go-down');
		var $left = btn('go-left');
		var $right = btn('go-right');
		
		var c = {
			disabled : 'btn-disabled',	
			paused : 'game-paused',
		};		
		
		if ( unbind === true ){
			$play.unbind();
			$pause.unbind();		
			$stop.unbind();
			$turnLeft.unbind();	
			$turnRight.unbind();
			$up.unbind();		
			$down.unbind();
			$left.unbind();	
			$right.unbind();

			return;			
		}			
		
		var game = this;
		
		$play.unbind().click( function(e){ 
			
			if ( ! $stop.hasClass(c.disabled) )
				return;			
			
			game.start();			
			
			$(this).addClass(c.disabled);			
			$pause.removeClass(c.disabled);	
			$stop.removeClass(c.disabled);
		});
		$stop.unbind().click( function(){ 			
			
			if ( ! $play.hasClass(c.disabled) )
				return;
			
			game.stop();
			
			$play.removeClass(c.disabled);		
			$stop.addClass(c.disabled);				
			$pause.addClass(c.disabled).removeClass(c.paused);
		});
		$pause.unbind().click( function(){ 
			
			if ( ! $play.hasClass(c.disabled) )
				return;
			
			if ( $pause.hasClass(c.paused) ){				
				game.resume();				
				$pause.removeClass(c.paused);
				$play.addClass(c.disabled);			
				$stop.removeClass(c.disabled);				
			} else {				
				game.pause(); 
				$pause.addClass(c.paused);
				$play.addClass(c.disabled);			
				$stop.removeClass(c.disabled);
			}
		});				
				
		$up.unbind().click( function(){ snakeEvent( game.snake.getDirections().up) });
		$down.unbind().click( function(){ snakeEvent( game.snake.getDirections().down) });
		$left.unbind().click( function(){ snakeEvent( game.snake.getDirections().left) });
		$right.unbind().click( function(){ snakeEvent( game.snake.getDirections().right) });	
		$turnLeft.unbind().click( function(){ snakeEvent( game.snake.getDirections().turnLeft) });
		$turnRight.unbind().click( function(){ snakeEvent( game.snake.getDirections().turnRight) });
	
		// direction: game.snake.getDirections().right
		function snakeEvent( direction ){
			if ( game.snake !== undefined ){
				e = $.Event('keydown');
				e.keyCode= direction.values[0];
				$(document).trigger(e);
			}	
		};
	};	
	
	function equals(obj1, obj2) {
		function _equals(obj1, obj2) {
			return JSON.stringify(obj1)
				=== JSON.stringify($.extend(true, {}, obj1, obj2));
		}
		return _equals(obj1, obj2) && _equals(obj2, obj1);
	}
	function btn( id ){		
			return $( document.getElementById( id ) );
	}	
	
	var game = new Game();	
});