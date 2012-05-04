var fs = require('fs');
var path = require('path');
var child_process = require('child_process');
var dir = "test";
var files = fs.readdirSync(dir);
var royTests = files.filter(function(x) {
    return x.lastIndexOf('.roy') == (x.length - 4);
});
// var royTests = ['tagged_unions.roy'];
var jsTests = files.filter(function(x) {
    return x.lastIndexOf('.js') == (x.length - 3);
});
var doTest = function(test, command, rbFile, outFile) {
    var name = path.join(dir, test);
    return child_process.exec(command, function(e1, x, y) {
        return (function() {
            if(e1 != undefined) {
                return console.log("Error:", name, e1.message);
            } else {
              child_process.exec("ruby -Ilib -rprelude " + rbFile, function(error, stdout, stderr) {
                if(error != undefined) {
                  console.log(stdout.toString())
                return console.log("Error:", name, error.message);
                } else {
                var expected = fs.readFileSync(outFile, 'utf8');
                var actual = stdout.toString();
                console.assert(actual == expected, "Output of " + test + ": " + JSON.stringify(actual) + " does not match " + JSON.stringify(expected));
                return console.log("Pass:", name);
                }
              });
            }
        })();
    });
};

royTests.forEach(function(t) {
    var name = path.join(dir, t);
    var outFile = path.join(dir, path.basename(t, '.roy')) + '.out';
    var rbFile = path.join(dir, path.basename(t, '.roy')) + '.rb';
    return doTest(t, ((process.argv[0]) + ' ./roy lib/prelude.roy ' + name), rbFile, outFile);
});
// jsTests.forEach(function(t) {
//     var name = path.join(dir, t);
//     var outFile = path.join(dir, path.basename(t, '.js')) + '.out';
//     return doTest(t, (process.argv[0]) + ' ' + name, outFile);
// });
//@ sourceMappingURL=run-tests.js.map
