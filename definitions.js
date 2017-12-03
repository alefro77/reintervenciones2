
//Definition margin and transition
var margin = {top: 20, right: 200, bottom: 60, left: 60},
    width = 1000,
    height = 550,
    padding = 1, 
    ls = 200,
    radius = 6;
var tra = d3.transition()
      .duration(2000);    

//Color Definition
var colore = d3.scaleOrdinal(d3.schemeCategory10) //Color just for services
ck = d3.scaleOrdinal(d3.schemeCategory20c)
var colorg = {"MASCULINO": "#316395", "FEMENINO": "#ff9896", "EJERCITO 2017": "#8FBC8F",
              "FAC  FUERZA AEREA COLOMBIANA": "#778899", "ARMADA NACIONAL": "#1E90FF",
              "pac": "#4682B4"} //Color just for gender 
//Defintion of color scale according data, 
function color(dk){
  if(colorg[dk]) return colorg[dk];
  else return ck(dk)
}
//Years this append these years to html
var ytot = [2012,2013,2014,2015,2016,2017];
var pyears = d3.select(".pullyears")
for(var ye in ytot)
  pyears.append("p").html('<input type="checkbox" class="year" value="' + ytot[ye] +'" checked="checked">' + ytot[ye])

//This will locate the total cards
d3.select(".desc").style("left", (margin.left+50) + "px");


//Scatter Plot elements
var format = d3.format("$,"); // x Axis
var x = d3.scaleLinear()
    .range([0, (width-margin.left-margin.right)]);
var y = d3.scaleLinear()
    .range([(height-margin.top-margin.bottom), 0]);
var yAxis = d3.axisLeft(y)
    .ticks(5);
var xAxis = d3.axisBottom(x)
    .tickFormat(format)
    .ticks(5);    

//SVG para scatter
var svg = d3.select(".container").append("svg") //Svg contenedor de todo el scatter
    .attr("class", "svgscatter")
    .attr("width", width)
    .attr("height", height)

    //gsc is just scatter without legend
var gsc = svg.append("g").attr("class", "gsc").attr("width", (width - margin.left - margin.right))
    .attr("height", (height - margin.bottom - margin.top))
    .attr("transform", "translate("+ margin.left +"," + margin.top + ")")

    //gsl is just for legend of scaret
var gsl = svg.append("g").attr("class", "gsl").attr("width", ls)
    .attr("height", 400)
    .attr("transform", "translate(" + (width-300) +",200)")  
       
//tip for hoover on circles of scatter
var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 150])
    .html(function(d) {
    return "<strong>Procedimiento:</strong> <span>" + d.nomProc + "</span><br> <strong>Reintervenciones:</strong> <span>" + d.reintervenciones + "</span><br> <strong>Costo:</strong> <span>" + format(d.costo) + "</span>";
  })
  svg.call(tip);


//Icicle elements

var mtop = 20, wi = 300, hi = 400, wt = 700;//Icicle width and height and margin top

var vx = d3.scaleLinear()
    .range([0, hi]);
var vy = d3.scaleLinear()
    .range([0, wi]); 

var svgtit = d3.select(".container").append("div") //This contain the description on the right of icicle
    .attr("class", "svgtit")
    .attr("width", width)
    .attr("height", mtop)
    .style("left", (margin.left + wi) + "px")
    .style("top", (2*margin.top) + "px");
svgtit.append("span").attr("class", "sp ultimo")
svgtit.append("span").attr("class", "deep1 sp sp1")
svgtit.append("span").attr("class", "deep2 sp sp1")
svgtit.append("span").attr("class", "deep3 sp sp1")    



var svgi = d3.select(".container").append("svg") //This will contain the icicle
    .attr("class", "svgi")
    .attr("width", (wt + margin.left))
    .attr("height", (hi)).attr("transform", "translate(0,0)");
   
var gi = svgi.append("g") //This is the icicle
    .attr("width", wi).attr("height", hi).attr("transform", "translate(" + margin.left + "," + margin.top + ")"); 
var gt = svgi.append("g").attr("class", "gt") //this is for sortable titles of icicle
    .attr("width", (wi)).attr("height", mtop).attr("transform", "translate(" + margin.left + ",0)")
gt.append("rect").attr("width", "100%")
    .attr("height", mtop)
    .attr("fill", "white");      
var gtot = svgi.append("g").attr("class", "gtot") //Margin left title (Total Pacientes)
    .attr("width", (wi/4)).attr("height", hi).attr("transform", "translate(" + margin.left + ",0)");

var tap = svgi.append("g") //It was necesary to maintain the margin left
    .attr("width", margin.left).attr("height", hi).
    append("rect").attr("width", margin.left)
    .attr("height", hi)
    .attr("fill", "white"); 

//Definitions for buuble

var wc = 400, wl = 300;
var hc = 400, hl = 600;

//Para el bubble

var divproc = d3.select(".container").append("div") //legenda del bubble
    .html('<div class="card cproc"><h3 class="card-header primary-color white-text"></h3><div class="card-body"><h4 class="card-title"></h4><p class="card-text"></p></div></div>')
    .style("width", wl + "px")
    .style("height", 200 + "px")
    .attr("class", "divproc").style("left", (wc+wl+5) + "px").style("top", (3*mtop - hi) +"px")
var pack = d3.pack() //This is how circles of bubble will be scaled
    .size([wc, hc])
    .padding(10); 

var svgbubble = svgi.append("g").attr("class", "bubble")
    .attr("width", wc)
    .attr("height", hc)
    .attr("transform", "translate(" + (wi + 10 + margin.left) + ", " + mtop*3 +")")
    .attr("class", "svgbuble")        
          
var partition = d3.partition() //How the icicle will be scaled
    .size([(hi-mtop), wi])
    .padding(0)
    .round(true);



//End Icicle    




