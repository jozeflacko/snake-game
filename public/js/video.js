var app = app || {};
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
}

