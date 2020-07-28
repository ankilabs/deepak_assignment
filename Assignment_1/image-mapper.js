// Hard Code values ---------- ---------- ----------
let canvasW = 600, canvasH = 600;
let title = "IMAGE MAPPER";

//Initialize ---------- ---------- ----------
d3.csv("image_data.csv").then(d=> chart(d)); //Load data and call the function
d3.select("#title").append("text").text(title); //Title
let uc = d3.select("#container").append("svg").attr("width", canvasW).attr("height", canvasH)
    .append("g").attr("transform", "translate("+0+", "+0+")"); //Image box
let uc2 = d3.select("#description").append("svg").attr("width", 400).attr("height", canvasH)
    .append("g").attr("transform", "translate("+0+", "+0+")"); //Image details

// Image Details ---------- ---------- ----------
    uc2.append("text").attr("x", 0).attr("y", 18).attr("class","textBold").text("Image Details");
    uc2.append("text").attr("x", 0).attr("y", 50).attr("class","textRegular").text("Name:");
    uc2.append("text").attr("x", 0).attr("y", 74).attr("class","textRegular").text("Dimensions:");
    uc2.append("text").attr("x", 0).attr("y", 98).attr("class","textRegular").text("MIME Type:");
    uc2.append("text").attr("x", 120).attr("y", 50).attr("class","textBold").text("Human-skeleton.jpg");
    uc2.append("text").attr("x", 120).attr("y", 74).attr("class","textBold").text("1406 x 1604");
    uc2.append("text").attr("x", 120).attr("y", 98).attr("class","textBold").text("JPG");

// Point Details ---------- ---------- ----------
    uc2.append("text").attr("x", 0).attr("y", 144).attr("class","textItalic").text("Point of interest:");
    uc2.append("text").attr("x", 220).attr("y", 144).attr("class","textItalic").text("Positions (x, y)");

// Box ---------- ---------- ----------
function chart(data)
{
    // Convert data types
    data.forEach(d=> { d.x=+d.x; d.y=+d.y;});

    // Draw the Rectangle
    let rectangle = uc.append("rect")
        .attr("class","box")
        .attr("x", 0).attr("y", 0)
        .attr("width", canvasW).attr("height", canvasH);

    let image = uc.append("image")
        .attr("class","image")
        .attr("xlink:href", "Human-skeleton.jpg")
        .attr("x", 8).attr("y", 8);

    // Point Details
    let pointRect = uc2.selectAll("#pointRect").data(data);
    pointRect.exit().remove();
    pointRect.enter().append("rect")
        .attr("id","#pointRect").merge(pointRect)
        .attr("transform", "translate(" + 0 + "," + 156 + ")")
        .attr("x", 0).attr("y", (d,i)=>i*26)
        .attr("width",320).attr("height",24)
        .attr("fill","rgba(216,216,216,0.5)");
    let points = uc2.selectAll("#points").data(data);
    points.exit().remove();
    points.enter().append("text")
        .attr("id","#points").attr("class","textRegular12").merge(points)
        .attr("transform", "translate(" + 8 + "," + 172 + ")")
        .attr("x", 8).attr("y", (d,i)=>i*26)
        .text((d,i)=>data[i].Points);
    let pointXY = uc2.selectAll("#pointXY").data(data);
    pointXY.exit().remove();
    pointXY.enter().append("text")
        .attr("id","#pointXY").attr("class","textRegular12").merge(pointXY)
        .attr("transform", "translate(" + 220 + "," + 172 + ")")
        .attr("x", 0).attr("y", (d,i)=>i*26)
        .text((d,i)=> data[i].x + ", " + data[i].y);

    //Tooltip
    let tooltip = d3.select("body").append("div").attr("class", "tooltip");

   // Box for each datapoint
    let markers = uc.selectAll("#markers").data(data);
    markers.exit().remove();
    markers.enter().append("rect")
        .attr("id","#markers").attr("class","markers")
            .on("mouseover", (d,i)=>{return tooltip.style("visibility", "visible")
                .html("<g class='tooltipText' />" + data[i].Points + "</g/>" );})
            .on("mousemove", ()=>{return tooltip.style("top", (event.pageY-12)+"px").style("left",(event.pageX+12)+"px");})
            .on("mouseout", ()=>{return tooltip.style("visibility", "hidden");})
        .merge(markers)
        .attr("transform", "translate("+0+","+0+")")
        .attr("x", (d,i)=>data[i].x).attr("y", (d,i)=>data[i].y)
        .attr("width",12).attr("height",12)
        .attr("fill","red").attr("stroke","white");

}



