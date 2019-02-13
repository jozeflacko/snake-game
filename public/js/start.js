$(document).ready(function() {
    var videoId = app.cam.start();
    app.face.start(videoId, callback);
});

var old_command = "";

function callback(command) {
    if(old_command !== command) {
        

        try{
            $(document.getElementById('go-'+command)).click();
            old_command = command;
            document.getElementById('command').value = command;
        } catch(e) {
            // just ignore. game is not started. I fix it later
        }
    }
}