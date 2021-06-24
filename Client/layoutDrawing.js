class InfoTable {
    static zoneCount = 0; // Number of defined 'zones'--storage areas or landmark objects (which simply have empty content/desc)
    static ids = [];
    static names = []; // Entry list of names for each zone
    static contents = []; // Entry list of content for each zone
    static descriptions = []; // Entry list of description for each zone
    static positions = []; // Array of 4-tuples indiciating x,y (left, top) and width,height of each zone
    static items = []; // Array of items contained in each zone
    static rotations = []; // Array of orientations (right, down, up, left)
    static zones = [];
    static constructor() {
        //Load in data from database
    }
}

function pseudoImport() {
    InfoTable.zoneCount = 29;
    InfoTable.names = ["drawer", "drawer", "drawer", "drawer", "drawer", "drawer", "drawer", "drawer", "drawer", "desk",
        "drawer", "drawer", "drawer", "drawer", "drawer", "drawer", "drawer", "drawer", "drawer", "desk",
        "drawer", "drawer", "drawer", "drawer", "drawer", "drawer", "drawer", "drawer", "drawer"];
        InfoTable.ids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29];
    InfoTable.contents = ["PC Loaners", "Apple Loaners", "Apple Loaners 2", "45/65 W Chargers", "Dell/USB-C Chargers", "Laptop Batteries", "90+ W Chargers",
        "Slim Docks", "Slim&Thunder Docks", "", "USB-C Adapters", "Apple Chargers", "Webcams/C->Eth", "IP Phone Cords", "USB Headsets", "Wireless Headsets", "Keyboards",
        "Wireless Mice", "Wired Mice", "", "DP/VGA Cables", "Universal Power", "Dono Laptops", "HDMI To USB-C", "R A M", "Misc Cables", "DP to ?", "Misc Adapters", "DVI & USB A/B"];
    InfoTable.positions = [[75, 510, 100, 33], [75, 543, 100, 33],[75, 576, 100, 33],[175, 510, 100, 33],[175, 543, 100, 33],[175, 576, 100, 33],[275, 510, 100, 33],[275, 543, 100, 33],[275, 576, 100, 33],
        [70, 450, 310, 60],[75, 417, 100, 33],[75, 384, 100, 33], [75, 351, 100, 33],[175, 417, 100, 33], [175, 384, 100, 33], [175, 351, 100, 33],[275, 417, 100, 33],[275, 384, 100, 33],[275, 351, 100, 33],[580, 20, 60, 310],
        [547, 25, 33, 100],[514, 25, 33, 100],[481, 25, 33, 100],[547, 125, 33, 100],[514, 125, 33, 100],[481, 125, 33, 100],[547, 225, 33, 100],[514, 225, 33, 100],[481, 225, 33, 100]];
    InfoTable.rotations = ["right", "right", "right", "right", "right", "right", "right", "right", "right", "right", "right", "right", "right", "right", "right", "right", "right", "right", "right",
                        "down", "down", "down", "down", "down", "down", "down", "down", "down", "down"];
    for(let i = 0; i < InfoTable.zoneCount; i++) {
        position = InfoTable.positions[i];
        InfoTable.zones.push(new zone(InfoTable.names[i], InfoTable.ids[i], InfoTable.contents[i], position[0], position[1], position[2], position[3], InfoTable.rotations[i]));
    }
}

class zone {
    highlighted = false;

    intersects(x, y) {
        if(x > this.left && x < this.left+this.width && y> this.top && y < this.top+this.height) {
            return true;
        }
        return false;
    }
    draw(ctx, mode = "standard", passOrder = 1) {
        // Draw bound
        ctx.beginPath();
        ctx.lineWidth = "2";
        ctx.strokeStyle = "#000000";
        if(this.highlighted) {
            if(passOrder==1) {
                return this;
            }
            ctx.strokeStyle = "#00FFFF";
        }
        ctx.strokeRect(this.left, this.top, this.width, this.height);
        
        //Determine text contents
        let text = "";
        if(mode=="standard") {
            text=this.content;
        }
        else if (mode=="modify") {
            text=this.content;
        }
        else if (mode=="id") {
            text=this.id;
        }

        //Draw text contents
        ctx.font = "11 px Helvetica";
        if(this.rotation=="right") {
            ctx.fillText(text, this.left+3, this.top + this.height / 2 + 5);
        }
        else if(this.rotation=="down") {
            ctx.save();
            ctx.translate(this.left+this.width / 2, this.top+3);
            ctx.rotate(Math.PI/2);
            ctx.fillText(text, 0, 0);
            ctx.restore();
        }

        if(this.highlighted) {
            return this;
        }
    }
    constructor(name, id, content, left, top, width, height, rotation) {
        this.name = name; this.content = content;
        this.top = top; this.left = left;
        this.width = width; this.height = height;
        this.rotation = rotation;
        this.id = id;
    }
}

function handleMovement(event) {
    canvas = document.getElementById("LayoutCanvas");
    canvasBound = canvas.getBoundingClientRect();
    x = event.clientX-canvasBound.left;
    y = event.clientY-canvasBound.y;
    ctx = document.getElementById("LayoutCanvas").getContext("2d");

    for(let i = 0; i < InfoTable.zoneCount; i++) { // Could save some performance by keeping track of highlighted boxes and breaking loop when a new highlighted intersection is found
        if(InfoTable.zones[i].intersects(x, y)==true) {
            InfoTable.zones[i].highlighted = true;
        }
        else {
            InfoTable.zones[i].highlighted = false;
        }
    }
    drawModify();
}

function handleClick(event) {
    canvas = document.getElementById("LayoutCanvas");
    canvasBound = canvas.getBoundingClientRect();
    x = event.clientX-canvasBound.left;
    y = event.clientY-canvasBound.y;
    ctx = document.getElementById("LayoutCanvas").getContext("2d");

    for(let i = 0; i < InfoTable.zoneCount; i++) {
        if(InfoTable.zones[i].intersects(x, y)==true) {
            document.getElementById("name").value = InfoTable.zones[i].name;
            document.getElementById("id").value = InfoTable.zones[i].id;
            document.getElementById("content").value = InfoTable.zones[i].content;
            document.getElementById("items").value = InfoTable.zones[i].items;
            document.getElementById("description").value = InfoTable.zones[i].description;
        }
    }
}


function zoneImport() {
    target = document.getElementById("arbitraryImport");
    console.log("fetch attempted");
    fetch('zones.json')
    .then(response => response.json())
    .then(json => {
        console.log(json);
        var count = Object.keys(json).length;
        console.log(count);
        InfoTable.zoneCount = count;
        for(let i = 0; i < count; i++) {
            InfoTable.names.push(json[i].name);
            InfoTable.ids.push(json[i]._id);
            InfoTable.contents.push(json[i].content);
            InfoTable.positions.push(json[i].position);
            InfoTable.rotations.push(json[i].rotation);
        }
        for(let i = 0; i < InfoTable.zoneCount; i++) {
            position = InfoTable.positions[i];
            InfoTable.zones.push(new zone(InfoTable.names[i],
                 InfoTable.ids[i],
                  InfoTable.contents[i],
                   position[0], position[1], position[2], position[3],
                    InfoTable.rotations[i]));
        }
        drawStandard(); // modify to follow enum from InfoTable
    });
}

function drawStandard() {
    var canvas = document.getElementById("LayoutCanvas");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let extraZone;
    for(let i = 0; i < InfoTable.zoneCount; i++) {
        let extraZoneBuffer = InfoTable.zones[i].draw(ctx); // this might be my favorite workaround ever
        if(extraZoneBuffer != null) {
            extraZone = extraZoneBuffer;
        }
    }
    if(extraZone !=null) {
        extraZone.draw(ctx, "standard", 2);
    }
}

function drawModify() {
    var canvas = document.getElementById("LayoutCanvas");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let extraZone;
    for(let i = 0; i < InfoTable.zoneCount; i++) {
        let extraZoneBuffer = InfoTable.zones[i].draw(ctx); // this might be my favorite workaround ever
        if(extraZoneBuffer != null) {
            extraZone = extraZoneBuffer;
        }
    }
    if(extraZone !=null) {
        extraZone.draw(ctx, "modify", 2);
    }
}

function drawIDs() {
    var canvas = document.getElementById("LayoutCanvas");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let extraZone;
    for (let i = 0; i < InfoTable.zoneCount; i++) {
        let extraZoneBuffer = InfoTable.zones[i].draw(ctx); // this might be my favorite workaround ever
        if(extraZoneBuffer != null) {
            extraZone = extraZoneBuffer;
        }
    }
    if(extraZone !=null) {
        extraZone.draw(ctx, "id", 2);
    }
}