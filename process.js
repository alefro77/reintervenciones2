
d3.json("../fileDi2.json", function(error, data) {
  if (error) throw error;
  cargar();
  function cargar(){
    pc = {}; datos = []; //Array services and data for scatter and icicle
    var ft = {}, k = 0;
    arrproc = {}; tpac = {};
    years = []; 
      d3.selectAll(".year").each(function(){
        if(this.checked) years.push(this.value)
      })

    data.forEach(function(p){ //Procesing json
      var eval = 0; // Eval if year of surgery is on the array of years
      for(var c in p["cirugias"]){
        var fc = p["cirugias"][c].fecha.substring(6,10)
        if(years.indexOf(fc) > -1){
            eval = 1;
            var ini = [];
            var hj = p["cirugias"][c].hijas.length;
            var val = 0
            for(var v in p["cirugias"][c].hijas) 
              val+=p["cirugias"][c].hijas[v].valorfactura;
            for(var j in p["cirugias"][c]["procedimientos"]){
              var k = p["cirugias"][c]["procedimientos"][j];
              if (ini.indexOf(k.nomProc) == -1) ini.push(k.nomProc)
              if(!ft[k["especialidad"]]) ft[k["especialidad"]] = {};
              if(!ft[k["especialidad"]][k["nomProc"]]) ft[k["especialidad"]][k["nomProc"]] = {"reint": 0, "valor": 0};
              if(!arrproc[k["nomProc"]]) arrproc[k["nomProc"]] = k["especialidad"];
            }
            for(var z in ini){
              ft[arrproc[ini[z]]][ini[z]]["reint"] += hj;
              ft[arrproc[ini[z]]][ini[z]]["valor"] += val;
            }
        }
      }
      if(eval == 1) tpac[p.id]= p;

    });
    var cons = 0;
    for (var i in ft){
      pc[i] = {"id": "A" + cons,"value":0}; cons++;
      for(var j in ft[i]){
        if(ft[i][j].reint>0){
          datos.push({"nomProc": j, "especialidad": i, "reintervenciones": ft[i][j].reint, "costo":  ft[i][j].valor})
        }
        
      }
    }
    x.domain(d3.extent(datos, function(d) { return d.costo; })).nice();
    y.domain([0,50]).nice();
    nvt = 0; //Count total reinterventions
    datos.forEach(function(d) {
      d.x = x(d.costo);
      d.y = y(d.reintervenciones); nvt+=d.reintervenciones;
      d.color = colore(d.especialidad);
      d.radius = radius;
    });
    updateScar()
    updateAll(["genero", "edad", "fuerza"])
  }
  //Legend on scatter
  var legend = gsl.selectAll(".legend")
          .data(colore.domain())
          .enter().append("g")
          .attr("class", "legend")
          .attr("transform", function(d, i) { return "translate(100," + i * 20 + ")"; });             
  legend.append("rect")
      .attr("x", ls - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", colore)
      .attr("class", function(d){ return "serv L" + pc[d].id })
      .on('mouseover', function(d){
        d3.select(this).attr("width", "20").attr("height", "20");
        d3.selectAll(".dot").attr("opacity", 0.2);
        d3.selectAll("." + pc[d].id).attr("opacity", 1);
      })
      .on('mouseout', function(d){
        d3.select(this).attr("width", "18").attr("height", "18");
        d3.selectAll(".dot").attr("opacity", 1);
       })
  legend.append("text")
      .attr("x", ls - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });


  
  function updateScar(){
    d3.select(".creint .card-text").text("Total: " + nvt) //Write on card of reinterventions
    d3.selectAll(".axis").remove()
    //Axis for scatter
    gsc.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (height-margin.bottom-margin.top) + ")")
        .call(xAxis)
    gsc.append("text")
        .attr("class", "label axis")
        .attr("x", (width-margin.right-margin.left))
        .attr("y", (height-margin.bottom-margin.top - 6))
        .style("text-anchor", "end")
        .text("Costo de las reintervenciones");
    gsc.append("g")
        .attr("class", "y axis")
        .call(yAxis)
    gsc.append("text")
        .attr("class", "label axis")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Número de reintervenciones")
    //Circles of scatter    
    var node = gsc.selectAll(".dot")
      .data(datos)
    node.exit().remove()
    node.attr("r", radius)
      .attr("class", function(d){ return "dot " + pc[d.especialidad].id})
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
      .style("fill", function(d) { return d.color; })
    node.enter().append("circle")
      .attr("class", function(d){ return "dot " + pc[d.especialidad].id})
       .on('mouseover', function(d){
          tip.show(d);
          d3.selectAll(".serv").attr("opacity", 0.2);
          d3.selectAll(".L" + pc[d.especialidad]["id"]).attr("opacity", 1);
       }) 
       .on('mouseout', function(d){
          tip.hide(d);
          d3.selectAll(".serv").attr("opacity", 1);
        })
      .attr("r", radius)
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
      .style("fill", function(d) { return d.color; })
    
    //Collision Detection
    var forceCollide = d3.forceCollide(function(d) { return d.radius; })
       .strength(0.8);
    var s = 0.02;
    var force = d3.forceSimulation(data)
      .force("x", d3.forceX(function(d) { return d.x; }))
      .force("y", d3.forceY(function(d) { return d.y; }))
      .on('tick', function() {
        svg.selectAll('.dot')
          .attr('cx', function(d) { return d.x; })
          .attr('cy', function(d) { return d.y; })
      })
          
         
    d3.select("#collisiondetection").on("change", function() {
        if(d3.select(this).property("checked")){
          force.nodes(datos)
          .force('collide', forceCollide)
        }else{
          force.nodes(datos)
          .force('collide', function(){})
          cargar()
        }
     });
  }


  function updateAll(niveles){
   //Para el Icicle
      var arr = {}
      for(var c in tpac){
        var k = tpac[c];
        if(!arr[k[niveles[0]]]) arr[k[niveles[0]]] = {}
        if(!arr[k[niveles[0]]][k[niveles[1]]]) arr[k[niveles[0]]][k[niveles[1]]] = {}
        if(!arr[k[niveles[0]]][k[niveles[1]]][k[niveles[2]]]) arr[k[niveles[0]]][k[niveles[1]]][k[niveles[2]]] = 0
        arr[k[niveles[0]]][k[niveles[1]]][k[niveles[2]]]++ 
      }
      var arr2 = {};
      arr2["pacientes"] = (niveles[0])? arr: d.length;
      var root = arr2;
      root = d3.hierarchy(d3.entries(root)[0], function(d) {
          return d3.entries(d.value)
      })
      .sum(function(d) { 
          return d.value;
      })
      .sort(function(a, b) { return b.value - a.value; });
      partition(root);
      var init = [], finit = [];
      var w = 0;    
      var tit = gt.selectAll("text").data(niveles) //Sortable titles
      //Areas for icicle
      gi.selectAll("rect").remove();
      var rect = gi.selectAll("rect").data(root.descendants());
      rect.exit().remove()
      rect.attr("x", function(d) { return d.y0; })
          .attr("y", function(d) { return d.x0})
          .attr("width", function(d) { w = d.y1 - d.y0; return w; })
          .attr("height", function(d) { return d.x1 - d.x0; })
          .attr("fill", function(d) {  return color(d.data.key); })
          .attr("lev", function(d){  return d.depth})
      rect = rect.enter().append("rect")
          .attr("x", function(d) { return d.y0; })
          .attr("y", function(d) { return d.x0})
          .attr("width", function(d) { w = d.y1 - d.y0; return w; })
          .attr("height", function(d) { return d.x1 - d.x0; })
          .attr("fill", function(d) { return color(d.data.key); })
          .attr("lev", function(d){  return d.depth})
          .on("dblclick", function(d){
            d3.selectAll("rect").each(function(k){
              if(d3.select(this).attr("lev") > d.depth)
                d3.select(this).classed("litrect", true)
            })
            d3.selectAll(".litrect").attr("pointer-events", "none")
          })
          .on("click", clicked)
          .on("mouseover", over)
          .on("mouseout", function(){
            if(d3.event.x > width || d3.event.y < mtop || d3.event.y > (mtop + height)){
              d3.selectAll(".litrect").attr("pointer-events", "auto")
            }
          })
          d3.select(".ultimo").style("opacity", 100).style("background", color(root.descendants()[0].data.key)).text("Total Pacientes: " + root.descendants()[0].value)
          d3.select(".cpac .card-text").text("Total Pacientes: " + root.descendants()[0].value)
      var pos = [[w,2*w], [2*w,3*w], [3*w,4*w]];      
      gtot.append("text").text("TOTAL PACIENTES").attr("x", -(mtop + (hi/2) + 50)).attr("y", 25).attr("transform", "rotate(-90)").attr("class", "total").style("fill", "white").style("font-size", "14px"); 
      
      //Enter levels titles
      tit.transition(tra)
          .attr("y", (mtop-10))
          .attr("x", function(d, i) { k = (w/2) + pos[i][0] - (d.length + 2)*3; return k; })
          .text(function(d){ return "- " + d + "-" })
      tit = tit.enter().append("text")
            .attr("y", (mtop-10))
            .attr("x", function(d, i) { k = (w/2) + pos[i][0] - (d.length + 2)*3; return k; })
            .text(function(d){ return "- " + d + "-" })
            .call(d3.drag()
              .on("start", dragstarted)
              .on("drag", dragged)
              .on("end", dragended))
            .attr("class", "dli");
         
     
       function clicked(d) {
          //Restore behavior for icicle because dbclick had disabled it
          d3.selectAll(".litrect").attr("pointer-events", "auto").classed("litrect", false);
          var ent = {}, margin = 40; //Ent es is the array for filter (gender, force or age)
          var ac = d;
          d3.selectAll(".sp1").text("");

          while(ac.parent){
            d3.select(".deep" + ac.depth)
              .style("opacity", 100)
              .style("background", color(ac.data.key))
              .text(ac.data.key+ ": " + ac.value)
            ent[niveles[ac.depth-1]] = ac.data.key;  
            ac = ac.parent;
          }
          if(!ac.parent){
            var ck = d3.select(".ultimo")
              .style("opacity", 100)
              .style("background", color(ac.data.key))
              .text("Total Pacientes: " + ac.value)
            }
            
          ac = d;    

            vy.domain([d.x0, d.x1]).range([0, hi-mtop])
            vx.domain([d.y0, wi]).range([d.depth ? margin : 0, wi]); 
            rect.transition()
            .duration(750)
            .attr("x", function(d) { return vx(d.y0); })
            .attr("y", function(d) { return vy(d.x0)})
            .attr("width", function(d) { w = vx(d.y1) - vx(d.y0);  return vx(d.y1) - vx(d.y0); })
            .attr("height", function(d) { return vy(d.x1) - vy(d.x0); });
            var pos = {0: [[w,2*w], [2*w,3*w], [3*w,4*w]],
                       1: [[margin,(w+margin)], [(w+margin),(2*w + margin)], [(2*w + margin),(3*w + margin)]],
                       2: [[1000,1001], [margin,(w+20)], [(w+margin),(2*w + margin)]],
                       3: [[1000,1101], [1000,1101], [margin,(w+margin)]]} 
            tit = gt.selectAll("text")
            .data(niveles)
            tit.transition(tra)
            .attr("y", mtop-10)
            .attr("x", function(d, i) { 
              k = (w/2) + pos[ac.depth][i][0] - (d.length + 2)*3;
              return k; 
            })
            .text(function(d){ return "- " + d + "-" })
          update2(ent);
        } 
        function over(d) {
            d3.selectAll(".sp").style("opacity", 0)
            var ac = d;
            d3.selectAll(".sp1").text("");
            while(ac.parent){
              d3.select(".deep" + ac.depth)
                .style("opacity", 100)
                .style("background", color(ac.data.key))
                .style("width", "300px")
                .text(ac.data.key+ ": " + ac.value) 
              ac = ac.parent;
            }
            if(!ac.parent)
              d3.select(".ultimo")
                .style("opacity", 100)
                .style("background", color(ac.data.key))
                .text("Total Pacientes: " + ac.value)
        }  
        function dragstarted(d) {
          init = [d3.select(this).attr("x"), d3.select(this).attr("y")];
          d3.select(this).raise().classed("active", true);
        }
        function dragged(d) {
          d3.select(this).attr("x", d3.event.x).attr("y", d3.event.y);
        }
        function dragended(d) {
          var pa = niveles.indexOf(d);
          var finit = d3.event.x;
          d3.select(this).classed("active", false);
          d3.select(this).attr("x", init[0]).attr("y", init[1]);
          for(var p in pos){
            if(pos[p][0]<= finit && pos[p][1] > finit && pa != p){
              niveles[pa] = niveles[p]
              niveles[p] = d;
              updateAll(niveles);
            }
          }
        }
        update2();
      //Cierra lo del icicle
      
         function update2(ent){
            var ft = {"pac": {}}, k = 0, arrproc = {};
            var wt = 40, cons = 0;
            for(var z in tpac){
              var p = tpac[z];
              if(eval(p)){
                //tpac[p.id]= p;
                for(var c in p["cirugias"]){
                  var fc = p["cirugias"][c].fecha.substring(6,10)
                    if(years.indexOf(fc) > -1){
                    var ini = [];
                    var hj = p["cirugias"][c].hijas.length;
                    for(var j in p["cirugias"][c]["procedimientos"]){
                      var k = p["cirugias"][c]["procedimientos"][j];
                      if (ini.indexOf(k.nomProc) == -1) ini.push(k.nomProc)
                      if(!ft["pac"][k["especialidad"]]) ft["pac"][k["especialidad"]] = {};
                      if(!ft["pac"][k["especialidad"]][k["nomProc"]]) ft["pac"][k["especialidad"]][k["nomProc"]] = 0;
                      if(!arrproc[k["nomProc"]]) arrproc[k["nomProc"]] = k["especialidad"];
                    }
                    for(var z in ini)
                      ft["pac"][arrproc[ini[z]]][ini[z]] += hj;
                  }
                }
              }
            };

            var xx = d3.hierarchy(d3.entries(ft)[0], function(d) {
                return d3.entries(d.value)
            }).sum(function(d) { 
                  return d.value;
              }).sort(function(a, b) { return b.value - a.value; });
            pack(xx);
            var q = d3.selectAll(".cir");
            q.remove();
            var node = svgbubble.selectAll("g")
              .data(xx.descendants())
              
            node.transition(tra)
                .attr("id", function(d) { return "node-" + d.id; })
                .attr("r", function(d) { 
                  return d.r/1.5; })
                .style("fill", function(d) {  return color(d.data.key); }); 
            var n1 = node.enter().append("g")
                .attr("transform", function(d) { return "translate(" + d.x/1.2 + "," + d.y/1.2 + ")"; })
                .attr("class", function(d) { if(d.depth == 1) return("serv L" + pc[d.data.key]["id"]); else return "serv"})
                .each(function(d) { d.node = this; })
                .on("mouseover", hovered)
                .on("mouseout",  nohovered)
                .on("dblclick", function(){
                  d3.selectAll(".little").attr("pointer-events", "none")
                })
            var vt = 0    
            n1.append("circle")
                .style("cursor", "pointer")
                .attr("r", function(d) { return d.r/1.2; })
                .style("fill", function(d) {
                    if(d.depth == 0) vt = d.value;  
                    if(d.depth == 1){
                     pc[d.data.key]["value"] = d.value;
                     return colore(d.data.key)
                    }else return color(d.data.key); })
                .attr("class", function(d){ if (d.depth > 0) return "little" }) 
            d3.select(".cproc .card-header")
                    .style("background", color("pac"))
                    .text("Total Reintervenciones")
            d3.select(".cproc .card-text")
                      .text("Reintervenciones: " + vt) 
            
             
          function eval(p){
            var b = 0
            for(var e in ent){
              if (p[e] != ent[e]){
                b = 1; break; 
              }
            }

            return (b==0)? true: false;
          }
           function hovered(d) {
                d3.select(".cproc .card-title").text("");
                if(d.depth > 1){
                  d3.select(".cproc .card-header")
                    .style("background", colore(d.parent.data.key))
                    .text(d.parent.data.key + ": " + pc[d.parent.data.key].value)
                  d3.select(".cproc .card-title")
                    .text(d.data.key)
                  d3.select(".cproc .card-text")
                    .text("Reintervenciones: " + d.data.value)  
                }else if(d.depth == 1){
                  d3.select(".cproc .card-header")
                    .style("background", colore(d.data.key))
                    .text(d.data.key)
                  d3.select(".cproc .card-text")
                    .text("Reintervenciones: " + d.value) 
                  }else{
                    if(!(d3.selectAll(".little").attr("pointer-events") == "none") )
                    d3.select(".cproc .card-header")
                    .style("background", color(d.data.key))
                    .text("Total Reintervenciones")
                    d3.select(".cproc .card-text")
                      .text("Reintervenciones: " + d.value) 
                  }
            };
           function nohovered(d) {   
                d3.selectAll(".augment").classed("augment", false);
                if(d.depth == 0)
                  d3.selectAll(".little").attr("pointer-events", "auto")
           };
           
        }     
      
  }//Cierra Update
  updateAll(["genero", "edad", "fuerza"])
  d3.selectAll(".year").on("change", function(){
    cargar();
    updateAll(["genero", "edad", "fuerza"])
  })
});
