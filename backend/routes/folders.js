const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const path = require('path');
const fs = require('fs-extra');
const mime = require('mime');
const rimraf = require('rimraf');


/** API path that will upload the files */
router.post('/', function (req, res, next) {
    const path = req.body.path;
    const folderContent = walkSync(`upload/${path}`);

    res.status(200).json({
        message: 'Successfully get folder content list',
        files: folderContent
    });
});

/** API path that will create folder */
router.post('/create', function (req, res, next) {
    const dir = `upload/${req.body.dir}`;

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    res.status(200).json({
        message: 'Directory successfully created',
        files: dir
    });
});

/** API path that will move files and folders */
router.post('/move', function (req, res, next) {
    const data = req.body.paths;

    data.forEach(item => {
        let srcpath = `upload/${item.oldPath}`;
        let dstpath = `upload/${item.currentPath}`;

        fs.move(srcpath, dstpath, err => {
            if (err) return console.error(err);
            console.log('success!')
        });
    });

    res.status(200).json({
        message: 'Directory successfully created'
    });
});

/** API path that will delete files and folders */
router.post('/delete', function (req, res, next) {
    const dirs = req.body.paths;

    dirs.forEach(item => {
        let path = `upload/${item.dir}/${item.filename}`;

        if (item.isFolder) {
            rimraf(path, (err) => {
                if (err) throw err;
                console.log('successfully deleted');
            })
        }
        else {
            fs.unlink(path, (err) => {
                if (err) throw err;
                console.log('successfully deleted');
            });
        }
    });

    res.status(200).json({
        message: 'Directory successfully deleted',
        files: dirs
    });
});

/**
 * List all files in a directory in Node.js recursively in a synchronous fashion
 * @param dir
 * @param filelist
 * @returns {Array}
 */
const walkSync = (dir, filelist = []) => {
    fs.readdirSync(dir).forEach(file => {
        filelist = fs.statSync(path.join(dir, file)).isDirectory() ?
            filelist.concat({
                name: file,
                path: path.join(dir, file),
                isFolder: true
            })
            : filelist.concat({
                name: file,
                path: path.join(dir, file),
                size: fs.statSync(path.join(dir, file)).size,
                type: mime.getType(file),
                isFolder: false
            });
    });
    return filelist;
};


module.exports = router;