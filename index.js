const polyline = require('polyline');
const request = require('request');

const from = process.argv[2].replace('("|\')', ''), to = process.argv[3].replace('("|\')', '');
const url = 'https://maps.googleapis.com/maps/api/directions/json?origin="' + from + '"&destination="' + to + '"';

request(url, (error, response, body) => {
    var points = JSON.parse(body).routes[0].overview_polyline.points;
    var coords = polyline.decode(points).map((x) => [x[1], x[0]]);
    
    var firstPoint = coords[0];
    var lastPoint = coords[coords.length - 1];

    console.log(`{
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "LineString",
                "coordinates": ${JSON.stringify(coords, null, 16)}
            }
        },
        {
            "type": "Feature",
            "properties": {
                "comment": "${from}"
            },
            "geometry": {
                "type": "Point",
                "coordinates": ${JSON.stringify(firstPoint)}
            }
        },
        {
            "type": "Feature",
            "properties": {
                "comment": "${to}"
            },
            "geometry": {
                "type": "Point",
                "coordinates": ${JSON.stringify(lastPoint)}
            }
        }
    ]
}`)
    
})


