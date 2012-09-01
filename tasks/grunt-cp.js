/*
 * grunt-mv
 * https://github.com/c4urself/grunt-mv
 *
 * Copyright (c) 2012 Christian Verkerk
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
    

    // Please see the grunt documentation for more information regarding task and
    // helper creation: https://github.com/cowboy/grunt/blob/master/docs/toc.md

    // ==========================================================================
    // TASKS
    // ==========================================================================

    grunt.registerMultiTask('mv', 'Copies files recursively from one directory to another.', function () {
        console.log(this.data);
        console.log(this.target);
        if (!this.data) {return false; }
        // mv: {
        //   media: {
        //     src: '/public/media',
        //     dest: '/dist/media'
        //   }
        //}
        grunt.helper('mv', this.target, this.data);
    });

    // ==========================================================================
    // HELPERS
    // ==========================================================================

    grunt.registerHelper('mv', function (target, data) {
        //
        // Based off of: https://gist.github.com/562982
        //
        var fs = require('fs');
        function copyDirRecursive(srcDir, newDir, clbk) {
            console.log(srcDir);
            console.log(newDir);
            console.log("About to call stat on " + srcDir);
            fs.statSync(srcDir, function(err, stats) {
               return console.log("Stat srcdir");
                //if (err) return clbk(err);
            });
            console.log("Moving on");
            console.log(stats);
            /*
                fs.mkdir(newDir, srcDirStat.mode, function(err){
                    console.log("Made dir");
                    if (err) return clbk(err);
                    fs.readdir(srcDir, function(err, files){
                        if (err) return clbk(err);
                        (function copyFiles(err){
                            if (err) return clbk(err);

                            var filename = files.shift();
                            if (filename === null || typeof filename == 'undefined')
                                return clbk();

                            var file = srcDir+'/'+filename,
                                newFile = newDir+'/'+filename;

                            fs.stat(file, function(err, fileStat){
                                if (fileStat.isDirectory())
                                    copyDirRecursive(file, newFile, copyFiles);
                                else if (fileStat.isSymbolicLink())
                                    fs.readlink(file, function(err, link){
                                        fs.symlink(link, newFile, copyFiles);
                                    });
                                else
                                    fs.readFile(file, function(err, data){
                                        fs.writeFile(newFile, data, copyFiles);
                                    });
                            });
                        })();
                    });
                });
            });
            */
        };
        
        if (!data.src || !data.dest) {
            grunt.log.error().writeln("You must specify both a src and a dest for grunt-mv".yellow);
        } else {
            copyDirRecursive(data.src, data.dest, function (err) {
                console.log(err);
            });
            //, function (data) {
            //    grunt.log.write('Successfully copied ' + data.src + ' to ' + data.dest);
            //});
        }
    });
};
