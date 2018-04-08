
// const neo4j = require('neo4j-driver').v1;

// const driver = neo4j.driver("bolt://127.0.0.1:7687", neo4j.auth.basic('neo4j', 'admin'));
// const session = driver.session();

// const personName = 'Alice';
// const resultPromise = session.run(
//   'CREATE (a:Person {name: $name}) RETURN a',
//   {name: personName}
// );

// resultPromise.then(result => {
//   session.close();

//   const singleRecord = result.records[0];
//   const node = singleRecord.get(0);

//   console.log(node.properties.name);

//   // on application exit:
//   driver.close();
// });


var cypher = require('cypher-stream')('bolt://127.0.0.1:7687', 'neo4j', 'admin');

cypher('MATCH (n:Person) RETURN n LIMIT 25')
  .on('data', function (result){
    console.log(result);
  })
  .on('end', function() {
    console.log('all done');
  })
;