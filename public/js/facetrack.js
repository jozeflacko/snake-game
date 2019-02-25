var app  = app || {};

app.cam  = {};
app.cam.video;
app.cam.start = () => {      
    app.cam.video = document.getElementById('realtime-video');
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {       
        navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
            app.cam.video.srcObject = stream;
            app.cam.video.play();
        });
    }
    return 'realtime-video';
};

app.face = {};
app.face.video;
app.face.tracker;
app.face.dimention = {
    width:300,
    height:150
};
app.face.start = (videoId, callback) => {
  
    window.onload = (function() {

        var video = document.getElementById(videoId);
        var canvas = document.getElementById('face-canvas');
        var tracker = new tracking.ObjectTracker('face');
        
        tracker.setInitialScale(2);
        tracker.setStepSize(2);
        tracker.setEdgesDensity(0.1);    
        tracking.track(video, tracker);
       
        tracker.on('track', function(event) {
          
          reprintCanvas(canvas);
          const data = event.data; 
             
          data.forEach(function(rect) {
              var x = canvas.width - rect.x - rect.width/2 + 20; // 20 calibration
              var y = rect.y + rect.height/2 + 3 ; // 3 calibration
              printFacePosition(canvas, x, y);             
              
              callback(generateRelativePosition(x, y, app.face.dimention));
            });
        });
    });  
};

function printFacePosition(canvas, x,y) {
    var context = canvas.getContext("2d");
    context.strokeStyle = 'red';
    context.beginPath();
    context.arc(x, y, 10, 0, 2 * Math.PI);
    context.stroke();
}

function reprintCanvas(canvas) {
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);   
}

function generateRelativePosition(x,y, dimention) {
    return {
        x: parseInt((x*100/dimention.width),10),
        y: parseInt((y*100/dimention.height),10),
    };
}