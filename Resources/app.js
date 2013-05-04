
var win = Ti.UI.createWindow({
    backgroundColor:"blue"
});

var button = Ti.UI.createButton({
    title:"Add Map",
    width:100,
    height:40,
    bottom:50
});

var text = Ti.UI.createTextField({
    height:40,
    width:"80%",
    backgroundColor:"white",
    bottom:"40%"
});

var pin = Titanium.Map.createAnnotation({
    pincolor:Titanium.Map.ANNOTATION_RED,
    animate:true
});

var mapview = Titanium.Map.createView({
    mapType: Titanium.Map.STANDARD_TYPE,
    animate:true,
    regionFit:true,
    top:0,
    left:0,
    right:0,
    bottom:"50%"
});

win.add(button);

win.open();

button.addEventListener("touchmove", doMove);

button.addEventListener("click", doShow);

text.addEventListener("touchmove", doMove);

function getAddress(data){
    Ti.API.info(JSON.stringify(data));
    Ti.Geolocation.reverseGeocoder(data.coords.latitude, data.coords.longitude, fillData);
    pin.applyProperties({
        latitude:data.coords.latitude,
        longitude:data.coords.longitude
    });
    mapview.region = {
        latitude:data.coords.latitude,
        longitude:data.coords.longitude,
        latitudeDelta:0.2,
        longitudeDelta: 0.2
    };
}

function fillData(data){
    Ti.API.info(JSON.stringify(data));
    text.value = data.places[0].address;
    pin.applyProperties({
        title: data.places[0].street,
        subtitle: data.places[0].city + ", "+data.places[0].zipcode
    });
    mapview.annotations = [pin];
}

function doShow(evt){
    Ti.Geolocation.purpose = "Get Address";
    Ti.Geolocation.getCurrentPosition(getAddress);  
    win.add(mapview);
    win.add(text);
    button.removeEventListener("click", doShow);
    button.addEventListener("click", doRemove);
    button.title = "Remove Map"
    
    function doRemove(){
        win.remove(mapview);
        win.remove(text);
        button.removeEventListener("click", doRemove);
        button.addEventListener("click", doShow);
        button.title = "Add Map"
    }
}

function doMove(evt){
    var point = evt.source.convertPointToView({x:evt.x, y:evt.y}, win);
    evt.source.center = point;
}