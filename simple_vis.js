/********************************************************
*                                                       *
*   dj.js example using Yelp Kaggle Test Dataset        *
*   Eol 9th May 2013                        *
*                                                       *
********************************************************/
 
/********************************************************
*                                                       *
*   Step0: Load data from json file                     *
*                                                       *
********************************************************/
d3.json("data/yelp_test_set_business.json", function (yelp_data) {
     
/********************************************************
*                                                       *
*   Step1: Create the dc.js chart objects & ling to div *
*                                                       *
********************************************************/
var bubbleChart = dc.bubbleChart("#dc-bubble-graph");

 
/********************************************************
*                                                       *
*   Step2:  Run data through crossfilter                *
*                                                       *
********************************************************/
var ndx = crossfilter(yelp_data);
     
/********************************************************
*                                                       *
*   Step3:  Create Dimension that we'll need            *
*                                                       *
********************************************************/

// for volumechart
    var cityDimension = ndx.dimension(function (d) { return d.city; });
    var cityGroup = cityDimension.group();
    var cityDimensionGroup = cityDimension.group().reduce(
        //add
        function(p,v){
            ++p.count;
            p.review_sum += v.review_count;
            p.star_sum += v.stars;
            p.review_avg = p.review_sum / p.count;
            p.star_avg = p.star_sum / p.count;
            return p;
        },
        //remove
        function(p,v){
            --p.count;
            p.review_sum -= v.review_count;
            p.star_sum -= v.stars;
            p.review_avg = p.review_sum / p.count;
            p.star_avg = p.star_sum / p.count;
            return p;
        },
        //init
        function(p,v){
            return {count:0, review_sum: 0, star_sum: 0, review_avg: 0, star_avg: 0};
        }
    );
 
    // for pieChart
    var startValue = ndx.dimension(function (d) {
        return d.stars*1.0;
    });
    var startValueGroup = startValue.group();
 
    // For datatable
    var businessDimension = ndx.dimension(function (d) { return d.business_id; });
/********************************************************
*                                                       *
*   Step4: Create the Visualisations                    *
*                                                       *
********************************************************/

bubbleChart.width(650)
            .height(300)
            .dimension(cityDimension)
            .group(cityDimensionGroup)
            .transitionDuration(1500)
            .colors(["#a60000","#ff0000", "#ff4040","#ff7373","#67e667","#39e639","#00cc00"])
            .colorDomain([-12000, 12000])
         
            .x(d3.scale.linear().domain([0, 5.5]))
            .y(d3.scale.linear().domain([0, 5.5]))
            .r(d3.scale.linear().domain([0, 2500]))
            .keyAccessor(function (p) {
                return p.value.star_avg;
            })
            .valueAccessor(function (p) {
                return p.value.review_avg;
            })
            .radiusValueAccessor(function (p) {
                return p.value.count;
            })
            .transitionDuration(1500)
            .elasticY(true)
            .yAxisPadding(1)
            .xAxisPadding(1)
            .label(function (p) {
                return p.key;
                })
            .renderLabel(true)
            .renderlet(function (chart) {
                rowChart.filter(chart.filter());
            })
            .on("postRedraw", function (chart) {
                dc.events.trigger(function () {
                    rowChart.filter(chart.filter());
                });
                        });
            ;

 /********************************************************
*                                                       *
*   Step6:  Render the Charts                           *
*                                                       *
********************************************************/
             
              
    dc.renderAll();
});
