function renderGraph() {
    var query = $("#mysqlQuery").val();
    if (query) {

        $("#mysql").html("");
        $("#mysqlV").html("");
        $("#neo").html("");
        $("#neoV").html("");
         $("#mongoV").html("");
         $("#mongo").html("");

	   mysqlqueryurl1 = 'http://localhost:3000/performmysql' + query;
       mysqlqueryurl2 = 'http://localhost:3000/performmysqlV' + query;
    
       neoq = 'http://localhost:3000/neoPerform' + query;
       neoqV = 'http://localhost:3000/neoPerformV' + query;

       mongo = 'http://localhost:3000/mongoperform' + query;
       mongoV = 'http://localhost:3000/mongoperformV' + query;


		$.ajax({
            url: mysqlqueryurl1,
            type: 'GET',
            success: function(data) {
                
                $("#mysql").html(data.result);

                
            }
    	});

        $.ajax({
            url: mysqlqueryurl2,
            type: 'GET',
            success: function(data) {
                
                $("#mysqlV").html(data.result);
                
            }
        });

        $.ajax({
            url: neoq,
            type: 'GET',
            success: function(data) {
                
                $("#neo").html(data.result);

                
            }
        });

        $.ajax({
            url: neoqV,
            type: 'GET',
            success: function(data) {
                
                $("#neoV").html(data.result);
                
            }
        });


        $.ajax({
            url: mongo,
            type: 'GET',
            success: function(data) {
                
                $("#mongo").html(data.fact);

                
            }
        });

        $.ajax({
            url: mongoV,
            type: 'GET',
            success: function(data) {
                
                $("#mongoV").html(data.fact);
                
            }
        });
	}   
}