const fs = require('fs');
const writeMidi = require('midi-file').writeMidi;

let parsed = {
    "header": {
        "format": 1,
        "numTracks": 1,
        "ticksPerBeat": 9600
    },
    "tracks": [
        [
            {
                "deltaTime": 0,
                "frame": 0,
                "frameRate": 24,
                "hour": 0,
                "meta": true,
                "min": 0,
                "sec": 0,
                "subFrame": 0,
                "type": "smpteOffset"
            },
            {
                "deltaTime": 0,
                "meta": true,
                "microsecondsPerBeat": 500000,
                "type": "setTempo"
            }
        ]
    ]
}

module.exports= workingDir => {

    let input = fs.readFileSync(workingDir, 'UTF-8');
    let midOutput = workingDir.replace('.txt','.mid')

    let markers = input.split('\n');


    let markersObjects = [];

    for (let i = 0; i < markers.length; i++) {
        markers[i] = markers[i].split(/[\t]/);
        markers[i][1] = markers[i][1].split(/[:.]/);

        let markerTemp = {
            "deltaTime": 0,
            "meta": true,
            "text": "",
            "type": "marker"
        };

        let timeInMs = (parseInt(markers[i][1][0]) * 60000 + parseInt(markers[i][1][1]) * 1000 + parseInt(markers[i][1][2])) * 19.2;
        // console.log(timeInMs);
        markerTemp["deltaTime"] = timeInMs;


        if (markers[i][0].length > 31) {
            let name = [];
            name[1] = markers[i][0].substring(markers[i][0].lastIndexOf(".")+1);
            name[0] = markers[i][0].substring(0, markers[i][0].lastIndexOf(".")).substring(0, 31-5-name[1].length);

            markers[i][0] = name[0] + "{...}" + name[1];
            console.log(markers[i][0]);
        }
        markerTemp["text"] = markers[i][0].substr(0, 31);
        // prevTime = timeInMs;

        markersObjects.push(markerTemp);

    }

    for (let i = 0; i < markersObjects.length-1; i++) {
        if(markersObjects[i]["deltaTime"] === markersObjects[i+1]["deltaTime"]) {
            let a = markersObjects[i+1];
            markersObjects[i+1] = markersObjects[i];
            markersObjects[i] = a;
        }
    }

    markersObjects.sort((a,b) => (a.deltaTime > b.deltaTime) ? 1 : ((b.deltaTime > a.deltaTime) ? -1 : 0));

    let prevTime = 0;

    for (let i = 0; i < markersObjects.length; i++) {

        let currentTime = markersObjects[i]["deltaTime"];

        markersObjects[i]["deltaTime"] = markersObjects[i]["deltaTime"] - prevTime;

        prevTime = currentTime;
    }


    parsed["tracks"][0] = parsed["tracks"][0].concat(markersObjects);

    let endTrack = {
        "deltaTime": 0,
        "meta": true,
        "type": "endOfTrack"
    };
    parsed["tracks"][0].push(endTrack);


    var output = writeMidi(parsed, {useByte9ForNoteOff: true, running: true});



    var outputBuffer = new Buffer(output);

    fs.writeFileSync(midOutput, outputBuffer);

}