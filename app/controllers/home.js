var db = require('orm').db;
var Employees = db.models.employees;
var Timesheets = db.models.timesheets;

exports.index = function(req, res){
    // Employees.one({id: 1}, function(err, employee){
    //     // if(err) throw new Error(err);
    //     // console.log(articles.title);
    //     // res.render('home/index', {
    //     //     title: 'Generator-Express MVC',
    //     //     articles: articles[0].example()
    //     // });
    //
    //     res.json({
    //         status: "success",
    //         message: {
    //             employee: employee
    //         }
    //     });
    // });

    Timesheets.one({id: 1}, function(err, timesheet) {
        if (err) throw new Error(err);

        res.json({
            status: "success",
            message: {
                timesheet: timesheet.getName("hehehe")
            }
        });
    });
};
