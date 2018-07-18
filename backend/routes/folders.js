const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const dir = require('node-dir');


const walkSync = function (dir, filelist) {
    let path = path || require('path');
    let fs = fs || require('fs'),
        files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function (file) {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            filelist = walkSync(path.join(dir, file), filelist);
        }
        else {
            filelist.push(file);
        }
    });

    console.log(filelist);
    return filelist;
};

/** API path that will upload the files */
router.post('/', function (req, res, next) {
    console.log('in');
// List all files in a directory in Node.js recursively in a synchronous fashion

    const filest = walkSync('upload');
});

module.exports = router;