/*
 * grunt-cp
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

    grunt.registerMultiTask('cp', 'Copies files recursively from one directory to another.', function () {
        if (!this.data) {return false; }
        // cp: {
        //   media: {
        //     src: '/public/media',
        //     dest: '/dist/media'
        //   }
        //}
        grunt.helper('cp', this.target, this.data);
    });

    // ==========================================================================
    // HELPERS
    // ==========================================================================

    grunt.registerHelper('cp', function (target, data) {
        //
        // Based off of: https://gist.github.com/562982 && wrench.js
        //
        var fs = require('fs');
        
        function rmdirSyncRecursive(path, failSilent) {
            var files;

            try {
                files = fs.readdirSync(path);
            } catch (err) {
                if(failSilent) return;
                throw new Error(err.message);
            }

            /*  Loop through and delete everything in the sub-tree after checking it */
            for(var i = 0; i < files.length; i++) {
                var currFile = fs.lstatSync(path + "/" + files[i]);

                if(currFile.isDirectory()) // Recursive function back to the beginning
                    rmdirSyncRecursive(path + "/" + files[i]);

                else if(currFile.isSymbolicLink()) // Unlink symlinks
                    fs.unlinkSync(path + "/" + files[i]);

                else // Assume it's a file - perhaps a try/catch belongs here?
                    fs.unlinkSync(path + "/" + files[i]);
            }

            /*  Now that we know everything in the sub-tree has been deleted, we can delete the main
                directory. Huzzah for the shopkeep. */
            return fs.rmdirSync(path);
        };

        function copyDirSyncRecursive(sourceDir, newDirLocation, opts) {

            if (!opts || !opts.preserve) {
                try {
                    if(fs.statSync(newDirLocation).isDirectory()) {
                        rmdirSyncRecursive(newDirLocation);
                    }
                } catch(e) { }
            }

            /*  Create the directory where all our junk is moving to; read the mode of the source directory and mirror it */
            var checkDir = fs.statSync(sourceDir);
            try {
                fs.mkdirSync(newDirLocation, checkDir.mode);
            } catch (e) {
                //if the directory already exists, that's okay
                if (e.code !== 'EEXIST') throw e;
            }

            var files = fs.readdirSync(sourceDir);

            for(var i = 0; i < files.length; i++) {
                var currFile = fs.lstatSync(sourceDir + "/" + files[i]);

                if(currFile.isDirectory()) {
                    /*  recursion this thing right on back. */
                    copyDirSyncRecursive(sourceDir + "/" + files[i], newDirLocation + "/" + files[i], opts);
                } else if(currFile.isSymbolicLink()) {
                    var symlinkFull = fs.readlinkSync(sourceDir + "/" + files[i]);
                    fs.symlinkSync(symlinkFull, newDirLocation + "/" + files[i]);
                } else {
                    /*  At this point, we've hit a file actually worth copying... so copy it on over. */
                    var contents = fs.readFileSync(sourceDir + "/" + files[i]);
                    fs.writeFileSync(newDirLocation + "/" + files[i], contents);
                }
            }
        };

        if (!data.src || !data.dest) {
            grunt.log.error().writeln("You must specify both a src and a dest for grunt-mv".yellow);
        } else {
            copyDirSyncRecursive(data.src, data.dest)
        }
    });
};
