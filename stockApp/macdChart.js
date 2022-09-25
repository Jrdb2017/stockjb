const macdChartRender = (selection,props) => {
    const {selectedDate,
        width,
        height,
        data,
        trendDates} = props;

     const g = selection.selectAll('.container').data([null]);
      const gEnter = g.enter().append('g')
         .attr('class', 'container');
      gEnter.merge(g)
        .attr('transform', `translate(${60},${10})`);
        
     // Add X axis it is a date format
     x = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return d3.timeParse("%Y-%m-%d")(d.date); }))
      .range([ 0, width-200 ]);
     gEnter.append("g")
      .attr("transform", "translate(0," + 500 + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
     // .domain([-.15, d3.max(data, function(d) { return +d.MACD; })])
     .domain([d3.min(data, function(d) { return +d.MACD-.1; }), d3.max(data, function(d) { return +d.MACD; })])
      .range([ height-200, 0]);
    gEnter.append("g")
      .call(d3.axisLeft(y));
     
    //chart multiple charts https://www.d3-graph-gallery.com/graph/line_smallmultiple.html
    MACDLine = d3.line()
        .x(d => x(d3.timeParse("%Y-%m-%d")(d.date)))
        .y(d => y(d.MACD));

    MACD_SignalLine = d3.line()
        .x(d => x(d3.timeParse("%Y-%m-%d")(d.date)))
        .y(d => y(d.MACD_Signal));
    MACD_HistLine = d3.line()
        .x(d => x(d3.timeParse("%Y-%m-%d")(d.date)))
        .y(d => y(d.MACD_Hist));
    // const linePath = g.merge(gEnter)
    //     .selectAll('.line-path');
    gEnter.append("path")
          .datum(data)
          .attr("fill", "none")				  
          .attr("stroke-width", 1.5)
          .attr("stroke-linejoin", "round")
          .attr("stroke-linecap", "round")
          .attr('class', 'line-path')
          .attr("d", MACDLine)
          .attr("stroke", "purple")
    gEnter.append("path")
          .datum(data)
          .attr("fill", "none")				  
          .attr("stroke-width", 1.5)
          .attr("stroke-linejoin", "round")
          .attr("stroke-linecap", "round")
          .attr('class', 'line-path')
          .attr("d", MACD_SignalLine)
          .attr("stroke", "pink")
    // gEnter.append("path")
    //       .datum(data)
    //       .attr("fill", "none")				  
    //       .attr("stroke-width", 1.5)
    //       .attr("stroke-linejoin", "round")
    //       .attr("stroke-linecap", "round")
    //       .attr('class', 'line-path')
    //       .attr("d", MACD_HistLine)
    //       .attr("stroke", "black")  

    //bar chart
    xbar = d3.scaleBand()
           .domain(d3.range(data.length))
           .range([0, width-200]);
          
    ybar = d3.scaleLinear()
          // .domain([0,d3.max(data, d=>d.MACD_Hist)])
           .domain([d3.min(data, d=>d.MACD_Hist),d3.max(data, d=>d.MACD_Hist)])
          // .range([0,height-200]);
           .range([height-400,0]);

    gEnter.append("g")
          .attr("fill","none")
          
    .selectAll("rect")
          .data(data.reverse())
    .join("rect")
          .attr("class", "bar")         
          .style("stroke",(d,i) =>{
            if(i===0){
             return "green"
            }
            else {
              //not behaving as expected when below 0...
             return (parseFloat(d.MACD_Hist)>parseFloat(data[i-1].MACD_Hist))?"green":"red"
            }
            
          })
          .attr("x", function(d,i) {return xbar(i); })
         // .attr("y", function(d) { return  height -200 - Math.max(0,ybar(d.MACD_Hist)); })
        //  .attr("y", function(d) { return  500+(500*d.MACD_Hist) ; })
        //bar chart height values aren't matching histrogram value
          .attr("y", d => (d.MACD_Hist > 0)? y(d.MACD_Hist):y(0))
          .attr("width",  xbar.bandwidth())
          .attr("height", function(d) { return Math.abs(y(0) - y(d.MACD_Hist)); });
    //cursor
    var transpRect = gEnter.append('rect')	
        
        .attr('class', 'mouse-interceptor')
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
    .merge(g.select('.mouse-interceptor'))
        .attr('width', width-200)
        .attr('height', height-200)
        .on('mousemove', function(event) {
            const x0 = d3.pointer(event)[0]; //console.log(x0);
            const hoveredDate = x.invert(x0);//console.log(hoveredDate);
            //setSelectedDate(hoveredDate);
            
        });
    // gEnter.append('line')
    //      .attr('class', 'selected-year-line')
    //      .attr("stroke", "steelblue")
    //      .attr('y1', 0)
    //      .attr('y2', height-200)
    //     .merge(g.select('.selected-year-line'))
    //       .attr('x1', x(selectedDate))
    //       .attr('x2', x(selectedDate));
    // gEnter.append('circle')//need a mouse event? https://bl.ocks.org/larsenmtl/e3b8b7c2ca4787f77d78f58d41c3da91  https://observablehq.com/@d3/d3-bisect
    //       .attr('class', 'selected-date-circle')
    //       .attr("r", 7)
    //       .style("fill", "none")
    //       .attr("stroke", "steelblue")
    //       .style("stroke-width", "1px")
    //     .merge(g.select('.selected-date-circle'))
    //       .attr("cx", x(selectedDate))
    //       .attr("cy", y(stockPrice(selectedDate,data)));
    trendDates.forEach(d=>{
      // console.log(d)
       gEnter.append('line')
         .attr("class", "trends")          
         .attr("x1", x(new Date(d)))
         .attr("x2", x(new Date(d)))
         .attr("y1", 0)
         .attr("y2", height-200)
         .attr("stroke", "green")
         .attr("opacity", 0)
         
     });
    var verticalLine = gEnter.append("line")
    .attr("opacity", 1)
    .attr('class', 'selected-year-line')
    .attr("y1", 0)
    .attr("y2", height-200)
    .attr("stroke", "black")
    .attr("stroke-width", 1)
    .attr("pointer-events", "none")
    .merge(g.select('.selected-year-line'))
    .attr('x1', x(selectedDate))
    .attr('x2', x(selectedDate));
    
  var horizontalLine = gEnter.append("line")
    .attr("opacity", 0)
    .attr("x1", 0)
    .attr("x2", width-200)
    .attr("stroke", "black")
    .attr("stroke-width", 1)
    .attr("pointer-events", "none");

    transpRect.on("mousemove", function(event){  
      mouse = d3.pointer(event);
      mousex = mouse[0];
      mousey = mouse[1];
      hoveredDate = x.invert(mousex); 
      setSelectedDate(hoveredDate);
      try{verticalLine.attr("x1",  mousex).attr("x2",mousex).attr("opacity", 1)}catch(e){console.log(e)};
      try{ horizontalLine.attr("y1", mousey).attr("y2", mousey).attr("opacity", 1)}catch(e){}
      })
   .on("mouseout", function(){  
     // verticalLine.attr("opacity", 0);
      horizontalLine.attr("opacity", 0);
      });
      
      gEnter.on("mousemove", function(event){  
      mouse = d3.pointer(event);
      mousex = mouse[0];
      mousey = mouse[1];
      //console.log(y.invert(mousey));
      hoveredDate = x.invert(mousex);
      setSelectedDate(hoveredDate);
      verticalLine.attr("x1",  mousex).attr("x2",   mousex).attr("opacity", 1);
     try{ horizontalLine.attr("y1", mousey).attr("y2", mousey).attr("opacity", 1)}catch(e){}
      })
   .on("mouseout", function(){  
    //  verticalLine.attr("opacity", 0);
      horizontalLine.attr("opacity", 0);
      });
};