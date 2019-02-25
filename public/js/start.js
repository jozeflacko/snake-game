var old_command = "";
const ERROR = 1;

$(document).ready(function() {
    var videoId = app.cam.start();
    app.face.start(videoId, callback);
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
    var command="";

    //if(face.x < snake.x) {
        var delta = face.y - snake.y;
        if(delta > ERROR) {
            command='down'
        } else if(delta < -1*ERROR) {
            command='up'
        }
    //}
    return command;
}
function whenSnakeGoesRight(face, snake) {
    var command="";

    //if(face.x > snake.x) {
        var delta = face.y - snake.y;
        if(delta > ERROR) {
            command='down'
        } else if(delta < -1*ERROR) {
            command='up'
        }
    //}
    return command;
}

function callback(myHeadPosition) {
    var command = '';

    if(app.snake.snake !== undefined) { 
        var snakeHeadPosition = app.snake.getHeadRelativePosition();
        var snakeDirection = app.snake.getSnakeDirection();
      
        if(snakeDirection === 'left') {
            whenSnakeGoesLeft(myHeadPosition, snakeHeadPosition);
        } else if(snakeDirection === 'up') {
            command = whenSnakeGoesUp(myHeadPosition, snakeHeadPosition);
        } else if(snakeDirection === 'right') {
            command = whenSnakeGoesRight(myHeadPosition, snakeHeadPosition);
        } else if(snakeDirection === 'down') {
            command = whenSnakeGoesDown(myHeadPosition, snakeHeadPosition);
        }
        
        changeDirectionOfASnake(command);       
    }
}

function changeDirectionOfASnake(command) {
    if(old_command !== command && command !== '' && command!== undefined) {
        console.log(command);
        old_command = command;
        $(document.getElementById('go-'+command)).click();  
    }
}