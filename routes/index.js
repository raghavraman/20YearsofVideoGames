var express = require('express'), 
	router = express.Router(),
	db = require('../db');


router.get('/',function(req,res) {
	res.render('dashboard',{activedash:"active"});
});

router.get('/dashboard',function(req,res){
	res.render('dashboard',{activedash:"active"});
});

router.get('/summary1', function(req, res) {

    db.query('SELECT release_year as name,count(*) as Freq from odb group by release_year having count(*) >1', function(err, results, feilds) {
         if (err) {
                console.error(err);
                res.statusCode = 500;
                res.send({
                    result: 'error',
                    err:    err.code
                });
            }
            
            res.send(results);
        }); 
});

router.get('/summary2', function(req, res) {
    db.query('SELECT genre as name,count(*) as Freq from odb group by genre having count(*) >500', function(err, results, feilds) {
             if (err) {
                    console.error(err);
                    res.statusCode = 500;
                    res.send({
                        result: 'error',
                        err:    err.code
                    });
                }
                
                res.send(results);
            }); 
    });

router.use(require('./relational'));
router.use(require('./mongo'));
router.use(require('./neo'));


module.exports = router;