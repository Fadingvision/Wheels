const util = {
	query(queryStr) {
		var queries = queryStr && queryStr.split("&"), query= {};
		if(queries){
		  var len = queries.length;
		  for(var i =0; i< len; i++){
		    var tmp = queries[i].split("=");
		    query[tmp[0]] = tmp[1];
		  }
		}
		return query;
	}
}

export default util; 
