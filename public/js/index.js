
var app = app || {};

var old_command = "";
var ERROR = 1;

function installStart() {
    document.getElementById('start-button').addEventListener('click', () => {    
        
        app.dimentions = {
            width: $('video').width(),
            height: $('video').height()
        };
        
        document.getElementById('start-button').style.display = 'none';
        setSizedForCanvasesToMatchVideoSize();
        app.snake.start(onSnakeStart, snakeCallback);
    });
}
    
$(window).load(function() {    
    app.camId = app.cam.start();  
    installStart();  
});

function videoCallback(data) {
    setSnakeDirection(data);
}

function onSnakeStart() { 
    app.face.start(app.camId, videoCallback);
}

function snakeCallback() {
    //setSizedForCanvasesToMatchVideoSize();
}

function setSnakeDirection(myHeadPosition) {
    var go = '';
    if(app.snake.snake !== undefined) { 
        var snakeHeadPosition = app.snake.getHeadRelativePosition();
        var snakeDirection = app.snake.getSnakeDirection();      
        if(snakeDirection === 'left') {
            go = whenSnakeGoesLeft(myHeadPosition, snakeHeadPosition);
        } else if(snakeDirection === 'up') {
            go = whenSnakeGoesUp(myHeadPosition, snakeHeadPosition);
        } else if(snakeDirection === 'right') {
            go = whenSnakeGoesRight(myHeadPosition, snakeHeadPosition);
        } else if(snakeDirection === 'down') {
            go = whenSnakeGoesDown(myHeadPosition, snakeHeadPosition);
        }        
        changeDirectionOfASnake(go);       
    }
}

function whenSnakeGoesDown(face, snake) {
    var delta = face.x - snake.x;
    return (delta > ERROR) ? 'right' : (delta < -1*ERROR) ? 'left' : '';   
}
function whenSnakeGoesUp(face, snake) {
    var delta = face.x - snake.x;
    return (delta > ERROR) ? 'right' : (delta < -1*ERROR) ? 'left' : '';
}
function whenSnakeGoesLeft(face, snake) {
    var delta = face.y - snake.y;
    return (delta > ERROR) ? 'down' : (delta < -1*ERROR) ? 'up' : '';
}
function whenSnakeGoesRight(face, snake) {
    var delta = face.y - snake.y;
    return (delta > ERROR) ? 'down' : (delta < -1*ERROR) ? 'up' : '';
}

function changeDirectionOfASnake(command) {
    if(old_command !== command && command !== '' && command!== undefined) {
        old_command = command;
        app.snake.changeSnakeDirection(command);
    }
}

function setSizedForCanvasesToMatchVideoSize() { 
    var el = $('canvas');
    
    el.attr('width', app.dimentions.width);
    el.attr('height', app.dimentions.height);
    el.css({
        width: app.dimentions.width+'px', 
        height: app.dimentions.height+'px', 
        border:'1px solid red'
    });
}