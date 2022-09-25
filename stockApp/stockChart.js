const stockChartRender = (selection,props) => {
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
     y = d3.scaleLinear()
      .domain([d3.min(data, function(d) { return +d.value; }), d3.max(data, function(d) { return +d.value; })])
      .range([ height-200, 0 ]);
    gEnter.append("g")
      .attr('class', 'stockYaxis')
      .merge(g.select('.stockYaxis'))
      .transition()
      .duration(750)
      .call(d3.axisLeft(y));
     
    //chart multiple charts https://www.d3-graph-gallery.com/graph/line_smallmultiple.html
    line = d3.line()
        .x(d => x(d3.timeParse("%Y-%m-%d")(d.date)))
        .y(d => y(d.value));
    const linePath = g.merge(gEnter)
        .selectAll('.line-path');
    gEnter.append("path")
          
          .attr("fill", "none")				  
          .attr("stroke-width", 1.5)
          .attr("stroke-linejoin", "round")
          .attr("stroke-linecap", "round")
          .attr('class', 'line-path')
          .merge(g.select('.line-path'))
          .data([data])
          // .transition()
          // .duration(750)
         
          .attr("d", line)
          .attr("stroke", "steelblue")
    
          
    
    //cursor
   var transpRect= gEnter.append('rect')	
        
        .attr('class', 'mouse-interceptor')
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
    .merge(g.select('.mouse-interceptor'))
        .attr('width', width-200)
        .attr('height', height-200)
        // .on('mousemove', function(event) {
        //     const x0 = d3.pointer(event)[0]; 
        //     console.log(d3.pointer(event)[0]);
        //     console.log(d3.pointer(event)[1]);
        //     const hoveredDate = x.invert(x0);//console.log(hoveredDate);
        //     setSelectedDate(hoveredDate);
            
        // });
    // gEnter.append('line')
    //      .attr('class', 'selected-year-line')
    //      .attr("stroke", "steelblue")
    //      .attr('y1', 0)
    //      .attr('y2', height-200)
       
    // gEnter.append('line')
    //       .attr('class', 'cross')
    //       .attr("stroke", "steelblue")
    //       .attr('x1', 0)
    //       .attr('x2', width-200)
    //      .merge(g.select('.cross'))
    //      .attr('y1', y(stockPrice(selectedDate,data)))
    //      .attr('y2', y(stockPrice(selectedDate,data)));
          
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
           // mousey = mouse[1];
            hoveredDate = x.invert(mousex); 
            setSelectedDate(hoveredDate);
            try{verticalLine.attr("x1",  mousex).attr("x2",mousex).attr("opacity", 1)}catch(e){console.log(e)};
            try{ horizontalLine.attr("y1", y(stockPrice(hoveredDate,data))).attr("y2", y(stockPrice(hoveredDate,data))).attr("opacity", 1)}catch(e){console.log(e)}
            })
         .on("mouseout", function(){  
           // verticalLine.attr("opacity", 0);
            horizontalLine.attr("opacity", 0);
            });
            
            gEnter.on("mousemove", function(event){  
            mouse = d3.pointer(event);
            mousex = mouse[0];//console.log(x.invert(mousex));
            mousey = mouse[1];//console.log(y.invert(mousey));
            //display this value?
            // console.log(y.invert(mousey));
            hoveredDate = x.invert(mousex);
            setSelectedDate(hoveredDate);
            verticalLine.attr("x1",  mousex).attr("x2",   mousex).attr("opacity", 1);
           try{ horizontalLine.attr("y1", y(stockPrice(hoveredDate,data))).attr("y2", y(stockPrice(hoveredDate,data))).attr("opacity", 1)}catch(e){console.log(e)}
            })
         .on("mouseout", function(){  
          //  verticalLine.attr("opacity", 0);
            horizontalLine.attr("opacity", 0);
            });
};