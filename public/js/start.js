var old_command = "";
const ERROR = 1;

$(document).ready(function() {
    var videoId = app.cam.start();
    app.face.start(videoId, callback);

    app.snake.start();
});

function whenSnakeGoesDown(face, snake) {
    var command="";

    //if(face.y > snake.y) {
        var delta = face.x - snake.x;
        if(delta > ERROR) {
            command='right'
        } else if(delta < -1*ERROR) {
            command='left'
        }
    //}
    return command;
}
function whenSnakeGoesUp(face, snake) {
    var command="";

    //if(face.y < snake.y) {
        var delta = face.x - snake.x;
        if(delta > ERROR) {
            command='right'
        } else if(delta < -1*ERROR) {
            command='left'
        }
    //}
    return command;
}
function whenSnakeGoesLeft(face, snake) {
    var go="";

    //if(face.x < snake.x) {
        var delta = face.y - snake.y;
        if(delta > ERROR) {
            go='down'
        } else if(delta < -1*ERROR) {
            go='up'
        }

        console.log('direction right, delta is: '+delta+' command is'+ go)
    //}
    return go;
}
function whenSnakeGoesRight(face, snake) {
    var go="";

    //if(face.x > snake.x) {
        var delta = face.y - snake.y;
        if(delta > ERROR) {
            go='down'
        } else if(delta < -1*ERROR) {
            go='up'
        }

        //console.log('direction right, delta is: '+delta+' command is'+ command)
    //}
    return go;
}

function callback(myHeadPosition) {
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

function changeDirectionOfASnake(command) {
    if(old_command !== command && command !== '' && command!== undefined) {
        old_command = command;
        
        console.log('Changing direction to '+ command)
        $(document.getElementById('go-'+command)).click();  
    }
}