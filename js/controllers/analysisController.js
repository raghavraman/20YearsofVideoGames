function renderGraph() {
    var query = $("#mysqlQuery").val();
    if (query) {


	   mysqlqueryurl1 = 'http://localhost:3000/performmysql' + query;
       mysqlqueryurl2 = 'http://localhost:3000/performmysqlV' + query;
    
       neoq = 'http://localhost:3000/neoPerform' + query;
       neoqV = 'http://localhost:3000/neoPerformV' + query;

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
	}   
}