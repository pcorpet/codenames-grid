//---------------------------------------------------
// Parameters
//---------------------------------------------------
// Grid
var xpos0 = 70;
var ypos0 = 70;
var width0 = 50;
var height0 = 50;
var nRow = 5;
// Lamps
var lampWidth = 50;
var lampHeight = 15;
var lampStroke = 3;
var lampShift  = 12;

var cellDescriptions = {
  coop: {color: "#00BA00", createSymbol: createCircle, clickedColor: "#fff"},
  forbidden: {color: "#222", createSymbol: createCross},
  neutral: {color: "#FFEFD5", createSymbol: createSquare, clickedColor: "#838690"},
  player1: {color: "#F56C4E", createSymbol: createCircle, clickedColor: "#fff"},
  player2: {color: "#2C93E8", createSymbol: createDiamond, clickedColor: "#fff"},
};
//---------------------------------------------------
// Grid
//---------------------------------------------------
function gridData() {
	var data = new Array();
	var xpos = xpos0; //starting xpos and ypos at 1 so the stroke will show when we make the grid below
	var ypos = ypos0;
	var width = width0;
	var height = height0;
	var click = 0;
	var id = 0;
	// iterate for rows	
	for (var row = 0; row < nRow; row++) {
		data.push( new Array() );
		
		// iterate for cells/columns inside rows
		for (var column = 0; column < nRow; column++) {
			data[row].push({
				x: xpos,
				y: ypos,
				width: width,
				height: height,
				click: click,
        id:id
			})

			//data[row][column].style("fill","#2C93E8");
			// increment the x position. I.e. move it over by 50 (width variable)
			xpos += width;
      id   += 1;
		}
		// reset the x position after a row is complete
		xpos = xpos0;
		// increment the y position for the next row. Move it down 50 (height variable)
		ypos += height;	
	}
	return data;
}

// Build the grid
var gridData = gridData();	

// Create the associated SVG
var grid = d3.select("#grid")
	.append("svg")
	.attr("width",""+(2*xpos0+nRow*width0)+"px")
	.attr("height",""+(2*ypos0+nRow*height0)+"px");

//---------------------------------------------------
// Background
//---------------------------------------------------
 var line1 = grid.append("line")
 .attr("x1", xpos0-2)
 .attr("y1", ypos0-2)
 .attr("x2", xpos0-2)
 .attr("y2", ypos0 + nRow*width0 + 2)
 .attr("stroke-width", 10)
 .attr("stroke-linecap", "round")
 .attr("stroke", "black");
                          
var line2 = grid.append("line")
.attr("x1", xpos0-2)
.attr("y1", ypos0-2)
.attr("x2", xpos0 + nRow*width0 + 2)
.attr("y2", ypos0-2)
.attr("stroke-width", 10)
.attr("stroke-linecap", "round")
.attr("stroke", "black");
                          
 var line3 = grid.append("line")
 .attr("x1", xpos0 + nRow*width0 + 2)
 .attr("y1", ypos0-2)
 .attr("x2", xpos0 + nRow*width0 + 2)
 .attr("y2", ypos0 + nRow*width0 + 2)
 .attr("stroke-width", 10)
 .attr("stroke-linecap", "round")
 .attr("stroke", "black");
                          
 var line4 = grid.append("line")
 .attr("x1", xpos0 - 2)
 .attr("y1", ypos0 + nRow*width0 + 2)
 .attr("x2", xpos0 + nRow*width0 + 2)
 .attr("y2", ypos0 + nRow*width0 + 2)
 .attr("stroke-width", 10)
 .attr("stroke-linecap", "round")
 .attr("stroke", "black");


//---------------------------------------------------
// Build the squares
//---------------------------------------------------
var row = grid.selectAll(".row")
	.data(gridData)
	.enter().append("g")
  .style("stroke", "#222")
	.attr("class", "row");
  
var column = row.selectAll(".square")
	.data(function(d) { return d; })
	.enter().append("rect")
	.attr("class","square")
	.attr("x", function(d) { return d.x; })
	.attr("y", function(d) { return d.y; })
  .attr("rx", 6)
  .attr("ry", 6)
	.attr("width", function(d) { return d.width; })
	.attr("height", function(d) { return d.height; })
  .attr("id", function(d) { return 'name'+d.id; })
	.style("fill", "#fff")
	.style("stroke", "#222")
  .attr("stroke-width", 5);

var lineGenerator	            = d3.line();//;.curve(d3.curveBasisClosed);//.interpolate("linear");
var curveBasisClosedGenerator = d3.line().x(function(d) { return d.x; })
                      							     .y(function(d) { return d.y; })
                                         .curve(d3.curveBasisClosed);//;//.interpolate("linear");

function createDiamond(d)
{
  return lineGenerator([
  [d.x + d.width/2, d.y + d.height/4], 
  [d.x + 3*d.width/4, d.y + d.height/2],
  [d.x + d.width/2, d.y + 3*d.height/4],
  [d.x + d.width/4, d.y + d.height/2],
  [d.x + d.width/2, d.y + d.height/4]
  ])
}

function createCross(d)
{
	return lineGenerator([
  [d.x + d.width/4, d.y + d.height/4], 
  [d.x + 3*d.width/4, d.y + 3*d.height/4],
  [d.x + d.width/2, d.y + d.height/2],
  [d.x + 3*d.width/4, d.y + d.height/4],
  [d.x + d.width/4, d.y + 3*d.height/4],
  [d.x + d.width/2, d.y + d.height/2],
  [d.x + d.width/4, d.y + d.height/4]
  ])
}

function createCircle(d)
{
	x0 = d.x + d.width/2;
  y0 = d.y + d.height/2;
  rad = d.height/4;
  var nPoints = 20;
  
  var points = new Array();
  for (var row = 0; row <= nPoints; row++) {
		points.push( {x:x0 + rad*Math.cos(2*Math.PI*row/nPoints),
    							y:y0 + rad*Math.sin(2*Math.PI*row/nPoints)
                  } );
    }
   return curveBasisClosedGenerator(points);
}

function createSquare(d)
{
	return lineGenerator([
  [d.x + d.width/4, d.y + d.height/4], 
  [d.x + 3*d.width/4, d.y + d.height/4],
  [d.x + 3*d.width/4, d.y + 3*d.height/4],
  [d.x + d.width/4, d.y + 3*d.height/4],
	[d.x + d.width/4, d.y + d.height/4]
  ])
}

var diamond = row.selectAll(".diamond")
	.data(function(d) { return d; })
	.enter().append("path")
	.attr("class","diamond")
	.attr("d", function(d) { return createDiamond(d); })
  .attr("id", function(d) { return 'diamond'+d.id; })
	.style("fill", "transparent")
	.style("stroke", "#fff")
  .attr("stroke-width", 1)
  .on('click', function(d) {
       d.click ++;
       if ((d.click)%2 == 0 ) { d3.select(this).style("fill","transparent"); }
       if ((d.click)%2 == 1 ) { d3.select(this).style("fill","#fff"); }
    });
  
/*
var diamond = row.selectAll(".diamond")
	.data(function(d) { return d; })
	.enter().append("rect")
	.attr("class","diamond")
	.attr("x", function(d) { return d.x + d.width/4; })
	.attr("y", function(d) { return d.y + d.height/4; })
  .attr("rx", 6)
  .attr("ry", 6)
	.attr("width", function(d) { return d.width/2; })
	.attr("height", function(d) { return d.height/2; })
  .attr("id", function(d) { return 'diamond'+d.id; })
	.style("fill", "transparent")
	.style("stroke", "#fff")
  .attr("stroke-width", 1);
*/  
//---------------------------------------------------
// Build the lamps
//---------------------------------------------------
 var lampData = new Array();
    lampData.push({
				x: xpos0+Math.floor(nRow/2)*width0,
				y: ypos0-(lampHeight+lampShift),
				width: lampWidth,
				height: lampHeight,
        id:0
			})
      
      lampData.push({
				x: xpos0+Math.floor(nRow)*width0+lampShift,
				y: ypos0+Math.floor(nRow/2)*height0,
				width: lampHeight,
				height: lampWidth,
        id:1
			})
      
      lampData.push({
				x: xpos0-(lampHeight+lampShift),
				y: ypos0+Math.floor(nRow/2)*height0,
				width: lampHeight,
				height: lampWidth,
        id:2
			})
      
      lampData.push({
				x: xpos0+Math.floor(nRow/2)*width0,
				y: ypos0+Math.floor(nRow)*width0+(lampShift),
				width: lampWidth,
				height: lampHeight,
        id:3
			})
console.log(lampData);


var lamp = grid.selectAll(".lamp")
.data(lampData)
.enter().append("rect")
.attr("class","lamp")
.attr("x", function(d) { return d.x; })
.attr("y", function(d) { return d.y; })
.attr("width", function(d) { return d.width; })
.attr("height", function(d) { return d.height; })
.attr("id", function(d) { return 'lampid'+d.id; })
.attr("rx", 2)
.attr("ry", 2)
.style("fill", "#838690")
.attr("stroke-width", lampStroke);

var flash = grid.selectAll(".flash")
.data(lampData)
.enter().append("rect")
.attr("class","flash")
.attr("x", function(d) { return d.x+2; })
.attr("y", function(d) { return d.y+2; })
.attr("width", function(d) { return d.width-4; })
.attr("height", function(d) { return d.height-4; })
.attr("id", function(d) { return 'lampc'+d.id; })
.attr("rx", 2)
.attr("ry", 2)
.style("fill", "transparent")
.style("stroke", "#fff")
.attr("stroke-width", 1);
//.style("transform", "rotate(20deg)")


console.log(lamp);

function createCell(idx, {color, createSymbol, clickedColor}) {
  d3.select('#name'+idx).style("fill", color);
  d3.select('#diamond'+idx).attr("d", function(d) { return createSymbol(d); })
  d3.select('#diamond'+idx).style("fill", "transparent");
  if (!clickedColor) {
    d3.select('#diamond'+idx).style("stroke", "grey");
    return
  }
  d3.select('#diamond'+idx).style("cursor", "pointer");
  d3.select('#diamond'+idx).style("stroke", color);
  d3.select('#diamond'+idx).on('click', function(d) {
     d.click ++;
     if ((d.click)%2 == 0 ) { d3.select(this).style("fill", "transparent"); }
     if ((d.click)%2 == 1 ) { d3.select(this).style("fill", clickedColor); }
  });
}
//---------------------------------------------------
// Update game
//---------------------------------------------------
function update(seed, duoMode)
{

  if (!seed) {
    Math.seedrandom()
    seed = Math.floor(Math.random() * 0x1000000).toString(16)
    history.pushState({}, '', '#' + seed)
  }
  setDuoMode(duoMode)
  Math.seedrandom(seed)
  var check = d3.randomUniform(1)();
  var beginPlayer = duoMode ? 'coop' : check > 0.5 ? 'player1'  : 'player2';

  // Array of indexes
  var rsort = new Array(25);
  for(var idx = 0; idx < 25; idx++)
  {
    rsort[idx] = idx;
  }

  // Shuffling
  for(idx = 0; idx < rsort.length; idx++)
  {
    var swpIdx = idx + Math.floor(Math.random() * (rsort.length - idx));
    // now swap elements at idx and swpIdx
    var tmp = rsort[idx];
    rsort[idx] = rsort[swpIdx];
    rsort[swpIdx] = tmp;
    if (duoMode === "heads") {
      // Invert the view
      rsort[idx] = 24 - rsort[idx]
    }
  }

  var cells = duoMode ? duoMode === "heads" ? [
    ['forbidden', 1],
    ['neutral', 5],
    ['coop', 9],
    ['neutral', 1],
    ['forbidden', 1],
    ['neutral', 7],
    ['forbidden', 1],
  ] : [
    ['coop', 9],
    ['neutral', 5],
    ['forbidden', 3],
    ['neutral', 8],
  ] : [
    ['forbidden', 1],
    ['neutral', 7],
    ['player1', beginPlayer === 'player1' ? 9 : 8],
    ['player2', beginPlayer === 'player1' ? 8 : 9],
  ]

  var idx = 0
  for(var [cellType, count] of cells) {
    var next_max = idx + count
    for(idx; idx < next_max; idx++) {
      createCell(rsort[idx], cellDescriptions[cellType])
    }
  }

  // Lamps
  for(idx = 0; idx < 4; idx++)
  {
  	d3.select('#lampid'+idx).style("fill", cellDescriptions[beginPlayer].color);
  }
  
}

function getDuoMode() {
  return (window.location.search.substr(1).split('&').find(kv => kv.startsWith("duo=")) || '').substr("duo=".length)
}

function setDuoMode(duoMode) {
  var url = new URL(window.location.href)
  if (!duoMode) {
    url.searchParams.delete("duo")
    history.pushState({}, '', url)
    document.getElementById('duo').innerText = "Mode duo"
    document.getElementById('switch-duo').setAttribute("style", "display: none;")
    document.getElementById('switch-duo').setAttribute("href", "")
    return
  }
  url.searchParams.set("duo", duoMode)
  history.pushState({}, '', url)
  var otherUrl = new URL(url)
  otherUrl.searchParams.set("duo", duoMode === "tails" ? "heads" : "tails")
  document.getElementById('duo').innerText = "Mode \u00e9quipes"
  document.getElementById('switch-duo').setAttribute("style", "display: inline;")
  document.getElementById('switch-duo').setAttribute("href", otherUrl.href)
}
//---------------------------------------------------
// Listeners
//---------------------------------------------------
document.getElementById("newGame").addEventListener("click", function(event) {
  event.target.blur();
  update(undefined, getDuoMode());
});
document.getElementById("duo").addEventListener("click", function(event) {
  event.target.blur();
  update(window.location.hash.substr(1), !getDuoMode() && "tails")
})
//First game
update(window.location.hash.substr(1), getDuoMode());
window.onpopstate = function() {
  update(window.location.hash.substr(1), getDuoMode());
}



//---------------------------------------------------
// Glow
//---------------------------------------------------
//Container for the gradients
var defs = grid.append("defs");

//Filter for the outside glow
var filter = defs.append("filter")
.attr("id","glow");

filter.append("feGaussianBlur")
  .attr("class", "blur")
  .attr("stdDeviation","3")
  .attr("result","coloredBlur");

var feMerge = filter.append("feMerge");
feMerge.append("feMergeNode")
  .attr("in","coloredBlur");
feMerge.append("feMergeNode")
  .attr("in","SourceGraphic");

grid.selectAll(".lamp").style("filter", "url(#glow)");
grid.selectAll(".flash").style("filter", "url(#glow)");
grid.selectAll(".diamond").style("filter", "url(#glow)");
