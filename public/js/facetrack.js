var app  = app || {};
app.face = {};
app.face.video;
app.face.tracker;

app.face.dimention = {
    width:400,
    height:400
};

app.face.start = (videoId, callback) => {
  
    window.onload = (function() {

        var video = document.getElementById(videoId);
        var canvas = document.getElementById('facetrack-canvas');
        var context = canvas.getContext('2d');
        var tracker = new tracking.ObjectTracker('face');
        
        tracker.setInitialScale(2);
        tracker.setStepSize(2);
        tracker.setEdgesDensity(0.1);
    
        tracking.track(video, tracker);
       
        tracker.on('track', function(event) {
          context.clearRect(0, 0, canvas.width, canvas.height);
          const data = event.data; 
             
          data.forEach(function(rect) {
              context.strokeStyle = '#a64ceb';

              let x = canvas.width - rect.x;
              let y = rect.y;

              context.strokeRect(x, rect.y, rect.width - rect.x, rect.height);
              context.font = '11px Helvetica';
              context.fillStyle = "#fff";

              var command = "up"; 
              
              var com_x = x - rect.width/2;
              var com_y = y + rect.height/2;

                     if(isAboveLinePurple(com_x,com_y) === true && isAboveLineOrange2(com_x,com_y) === true) {
                command = "up";
              } else if(isAboveLinePurple(com_x,com_y) === true && isAboveLineOrange2(com_x,com_y) === false){
                command = "right";
              } else if(isAboveLinePurple(com_x,com_y) === false && isAboveLineOrange2(com_x,com_y) === true)
                command = "left";
              else {
                command = "down";
              }

              strokeLine(canvas, 0, 0, canvas.width, 3/4 * canvas.width, 'purple');
              strokeLine(canvas, 0, 3/4 * canvas.width, canvas.width, 0, 'orange');

              callback(command);
            });
        });
    });  
}  

function strokeLine(canvas, x1,y1,x2,y2, color) {   
    var ctx = canvas.getContext("2d");
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function isAboveLinePurple(x1,y1) {
    var yy = 3/4 * x1;
    return (yy > y1);
}

function isAboveLineOrange2(x1,y1) {
    var yy = -3/4 * x1 + 240;
    return (yy > y1);
}