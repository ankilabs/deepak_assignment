// Hard Code values ---------- ---------- ----------
let canvasW = 1050, canvasH = 420, chartH = 300;
let title = "SHARE TRACKER", script = "Vodafone Idea";
let dateParser = d3.utcParse("%d/%m/%y"), utc = d3.utcFormat("%d/%m"), tooltipDate = d3.utcFormat("%A, %B %-d, %Y"), showPrice = d3.format(",.2f");
let red = "#D0021B", green = "#5EAD02", widthBand = "5px";

//Initialize ---------- ---------- ----------
d3.csv("share_data.csv").then(d=> chart(d)); //Load data and call the function
d3.select("#title").append("text").text(title); //Title
d3.select("#script").append("text").text(script); //Selected script
let uc = d3.select("#container").append("svg").attr("width", canvasW).attr("height", canvasH)
    .append("g").attr("transform", "translate("+0+", "+0+")");

//Draw Chart ---------- ---------- ----------
function chart(data)
{
    // Convert data types and create arrays
    data.forEach(d=> { d.Close=+d.Close; d.PrevClose=+d.PrevClose; d.Open=+d.Open; d.High=+d.High; d.Low=+d.Low; d.Date=dateParser(d.Date); return d;});
    let dateArray = []; data.map(d =>dateArray.push(d.Date));
    let closeArray = []; data.map(d=>closeArray.push(d.Close));
    let lowArray = []; data.map(d=>lowArray.push(d.Low)), min = d3.min(lowArray);
    let highArray = []; data.map(d=>highArray.push(d.High)), max = d3.max(highArray);

    // Setup scales
    let xScale = d3.scalePoint().domain(dateArray).range([0, canvasW-150]).padding(0.5);
    let yScale = d3.scaleLinear().domain([min*0.9, max*1.1]).range([chartH, 0]);

    // X axis
    let lineX = uc.selectAll("#lineX").data([""]);
    lineX.exit().remove();
    lineX.enter().append("g")
        .attr("class", "xAxis").attr("id","lineX").merge(lineX)
        .attr("transform", "translate("+ 90 +"," + chartH + ")")
        .call(d3.axisBottom(xScale)
            .ticks(dateArray.length).tickSize(0).tickPadding(8).tickFormat((d,i)=>utc(dateArray[i])));

   // Y axis
    let lineY = uc.selectAll("#lineY").data([""]);
    lineY.exit().remove();
    lineY.enter().append("g")
        .attr("class", "yAxis").attr("id","lineY").merge(lineY)
        .attr("transform", "translate("+ 90 +"," + 0 + ")")
        .call(d3.axisLeft(yScale)
            .ticks(5).tickSize(0).tickPadding(12).tickFormat(d3.format(",.2f")));

    // Legend
    uc.append("text").attr("x", 150).attr("y", chartH+50).attr("class","legend").text("Closing Price");
    uc.append("path").attr("class","line").attr("d", d3.line()([[90, chartH+45], [130, chartH+45]]))

    // Draw lines ---------- ---------- ----------
    let lineArray = []; data.map((d,i)=> lineArray[i] = [dateArray[i],closeArray[i]]);
    let linePath = d3.line().x(d=>xScale(d[0])).y(d=>yScale(d[1])).curve(d3.curveLinear);//Curve Type
    uc.append("path").data([lineArray]).attr("class","line")
        .attr("transform", "translate("+ 90 +"," + 0 + ")").attr("d", linePath);

    // Draw Range bands
    let lineBand = []; data.map((d,i)=> lineBand[i] =
        [[dateArray[i],data[i].High],[dateArray[i],data[i].Low],[dateArray[i],data[i].Open],[dateArray[i],data[i].Close]]);
    for(i=0;i<lineBand.length;i++){
        uc.append("path").data([lineBand[i]])
            .attr("transform", "translate("+ 90 +"," + 0 + ")").attr("d", linePath)
            .attr("stroke",(d)=>{ if(data[i].Close >= data[i].PrevClose){return green;}else{return red;}}).attr("stroke-width",widthBand);}

    //Tooltip
    let tooltip = d3.select("body").append("div").attr("class", "tooltip");

   // Box for each datapoint
    let markers = uc.selectAll("#markers").data(data); let yPosition = -6;
    markers.exit().remove();
    markers.enter().append("rect")
        .attr("id","#markers").attr("class","markers")
            .on("mouseover", (d,i)=>{return tooltip.style("visibility", "visible")
                .html("<b/>" + tooltipDate(data[i].Date) + "</b/>"
                    + "<br/>" + "Open Price: " + "<b/>" + showPrice(data[i].Open) + "</b/>"
                    + "&nbsp;&nbsp;&nbsp;&nbsp;" + "Close Price: " + "<b/>" + showPrice(data[i].Close) + "</b/>"
                    + "<br/>" + "Day High: " + "<b/>" + showPrice(data[i].High) + "</b/>"
                    + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + "Day Low: " + "<b/>" + showPrice(data[i].Low) + "</b/>");})
            .on("mousemove", ()=>{return tooltip.style("top", (event.pageY-65)+"px").style("left",(event.pageX+12)+"px");})
            .on("mouseout", ()=>{return tooltip.style("visibility", "hidden");})
        .merge(markers)
        .attr("transform", "translate("+84+"," + yPosition + ")")
        .attr("x", (d,i)=>xScale(dateArray[i])).attr("y", (d,i)=>yScale(closeArray[i]))
        .attr("width",12).attr("height",12)
        .attr("fill",(d,i)=>{ if(data[i].Close >= data[i].PrevClose){ return green; } else { return red; } }).attr("stroke","white");
}
