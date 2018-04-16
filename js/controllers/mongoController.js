$( document ).ready(function() {
var r = document.getElementById('range');
var max = r.getAttribute('max');
var min = r.getAttribute('min');
var w = r.clientWidth;
w += r.offsetLeft;
var isDragging = false;

var moveTip = (function(e){
    if(isDragging){
     var posPerc = (r.value/max) * 100;
   var pixPos = (posPerc/100) * w;
    pixPos += r.offsetLeft;

    document.getElementById('tip').style.display = 'block';
     document.getElementById('tip').style.left = pixPos +'px';
     document.getElementById('tip').innerHTML = document.getElementById('range').value;
    }
});

r.onmousedown = (function(e){
       isDragging = true;
        r.addEventListener('mousemove',moveTip,false);
});
r.onmouseup = (function(e){
isDragging = false;
    r.removeEventListener('mousemove',moveTip);
     document.getElementById('tip').style.display = 'none';
});

});
function selectQuery(){
	var query = $("#mongoDBQuery").val();
	switch(query){
		
		
		default:$("#genreDiv").hide();
		$("#platformDiv").hide();
		$("#ratingDiv").hide();
		$("#yearDiv").hide();
	}
}
function renderGraph() {
    var query = $("#mongoDBQuery").val();
    var caption = $("#mongoDBQuery option:selected").text();
    var queryurl, xAxisName, yAxisName, caption;
    var fusionbool = false;
    if (query) {

    	switch(query){

    		default:  queryurl = 'http://localhost:3000/mongoquery' + query;
		}
      
		$.ajax({
            url: queryurl,
            type: 'GET',
            success: function(data) {
                chartData = data;
                var chartProperties = {
                    "caption": caption,
                    "rotatevalues": "1",
                    "theme": "zune",

                     //Cosmetics
	                "baseFontColor" : "#333333",
	                "baseFont" : "Helvetica Neue,Arial",
	                "captionFontSize" : "14",
	                "subcaptionFontSize" : "14",
	                "subcaptionFontBold" : "0",
	                "showborder": "0",
	                "paletteColors" : "#0075c2",
	                "bgcolor": "#FFFFFF",
	                "showalternatehgridcolor": "0",
	                "showplotborder": "0",
	                "labeldisplay": "WRAP",
	                "divlinecolor": "#CCCCCC",
	                "showcanvasborder": "0",
	                "linethickness": "3",
	                "plotfillalpha": "100",
	                "plotgradientcolor": "",
	                "numVisiblePlot" : "12",
	                "divlineAlpha" : "100",
	                "divlineColor" : "#999999",
	                "divlineThickness" : "1",
	                "divLineIsDashed" : "1",
	                "divLineDashLen" : "1",
	                "divLineGapLen" : "1",
	                "scrollheight" : "10",
	                "flatScrollBars" : "1",
	                "scrollShowButtons" : "0",
	                "scrollColor" : "#cccccc",
	                "showHoverEffect" : "1"
                };
                FusionCharts.ready(function () {
                apiChart = new FusionCharts({
                    type: 'column2d',
                    renderAt: 'chart-container',
                    width: '100%',
                    height: '100%',
                    dataFormat: 'json',
                    dataSource: {
                        "chart": chartProperties,
                        "data": chartData
                    },
                    "events": {
                        "beforeRender": function(evt, args) {
                            var controllers = evt.sender._controllers,
                                radio = [],
                                radElem,
                                val;

                            if (!controllers) {
                                controllers = evt.sender._controllers = document.createElement("div");
                                controllers.innerHTML = "<form><label style='display:inline;margin-bottom:0;'><input name='chart-type' id='change-chart-type-line' type='radio' value='line' /> Line chart</label>&nbsp;&nbsp;<input name='chart-type' id='change-chart-type-bar' type='radio' value='bar2d' />&nbsp;<label for='change-chart-type-bar' style='display:inline;margin-bottom:0;'>Bar chart</label>&nbsp;&nbsp;<input name='chart-type' id='change-chart-type-column' type='radio' value='column2d' checked='true' />&nbsp;<label for='change-chart-type-column' style='display:inline;margin-bottom:0;'>Column chart</label></form>";
                                controllers.style.cssText = "text-align: Center;"
                                var clearText = args.container.firstChild;
                                while (clearText) {
                                    ((clearText.nodeType === 3) || (clearText.nodeName === "#text")) && clearText.parentNode.removeChild(clearText);
                                    clearText = clearText.nextSibling;
                                }
                                args.container.appendChild(controllers);

                                radio = controllers.getElementsByTagName('input');
                                for (i = 0; i < radio.length; i++) {
                                    radElem = radio[i];
                                    if (radElem.type === 'radio') {
                                        radElem.onchange = function() {
                                        	 controllers.innerHTML = "<form><label style='display:inline;margin-bottom:0;'><input name='chart-type' id='change-chart-type-line' type='radio' value='line' /> Line chart</label>&nbsp;&nbsp;<input name='chart-type' id='change-chart-type-bar' type='radio' value='bar2d' />&nbsp;<label for='change-chart-type-bar' style='display:inline;margin-bottom:0;'>Bar chart</label>&nbsp;&nbsp;<input name='chart-type' id='change-chart-type-column' type='radio' value='column2d' checked='true' />&nbsp;<label for='change-chart-type-column' style='display:inline;margin-bottom:0;'>Column chart</label></form>";
                                            val = this.getAttribute('value');
                                            val && evt.sender.chartType(val);
                                            
                                        };

                                    }
                                }
                            }
                        },
                        "fusionchartsdataplotclick": function(evt, args) {
                        	console.log("asf");
                        }
                    }
                }).render();
            	});
            }
    	});
	}   
}