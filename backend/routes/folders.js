const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const path = require('path');
const fs = require('fs-extra');
const mime = require('mime');
const rimraf = require('rimraf');
const File = mongoose.model('file');


/** API path that will upload the files */
router.post('/', function (req, res, next) {
    const path = req.body.path === "/" ? `upload/${req.body.path}` : req.body.path;
    const folderContent = walkSync(path);
    res.status(200).json({
        message: 'Successfully get folder content list',
        files: folderContent
    });
});

/** API path that will create folder */
router.post('/create', function (req, res, next) {
    const dir = req.body.dir.parent === '' ? path.join('upload', req.body.dir.parent, req.body.dir.name) : path.join(req.body.dir.parent, req.body.dir.name);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    res.status(200).json({
        message: 'Directory successfully created',
        files: dir
    });
});

/** API path that will rename files and folders */
router.post('/rename', function (req, res, next) {
    let oldPath = req.body.oldPath;
    let newPath = req.body.parent === '' ? path.join('upload', req.body.newName) : path.join(req.body.parent, req.body.newName);

    fs.rename(oldPath, newPath, function (err) {
        if (err) throw err;
        fs.stat(newPath, function (err, stats) {
            if (err) throw err;

            if(req.body.isFolder){
                const folderContent = walkSync(newPath);
                folderContent.forEach(file => {
                    File.findOneAndUpdate({filename: file.name}, {$set: {destination: newPath, path: path.join(newPath, file.name)}}, {new: true}).then(res =>res);
                })
            }
            else {
                File.findOneAndUpdate({path: oldPath}, {$set: {filename: req.body.newName, originalname: req.body.newName, path: newPath}}, {new: true}).then(res =>res);
            }
        });
    });
    res.status(200).json({
        message: 'Directory successfully created'
    });
});

/** API path that will move files and folders */
router.post('/move', function (req, res, next) {
    const data = req.body.paths;

    data.forEach(item => {
        let srcpath = `${item.oldPath}`;
        let dstpath = path.join('upload', item.currentPath);
        fs.move(srcpath, dstpath, err => {
            if (err) return console.error(err);

            if(item.isFolder){
                const folderContent = walkSync(dstpath);
                folderContent.forEach(file => {
                    File.findOneAndUpdate({filename: file.name}, {$set: {destination: dstpath, path: path.join(dstpath, file.name)}}, {new: true}).then(res =>res);
                })
            }
            console.log('success!');
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
        let dir = item.dir;
        let filepath;
        item.dir === "" ? filepath = path.join('upload', item.filename) : filepath = path.join(dir, item.filename);
        if (item.isFolder) {
            rimraf(filepath, (err) => {
                if (err) throw err;
                console.log('successfully deleted');
            })
        }
        else {
            fs.unlink(filepath, (err) => {
                if (err) throw err;
                File.findOneAndUpdate({path: filepath, deleted: false}, {$set: {deleted: true}}, {new: true}).then(res => res);
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
                currentPath: path.join(dir, file),
                parent: dir.replace('upload//', ''),
                isFolder: true
            })
            : filelist.concat({
                name: file,
                orginalName: file.substr(file.lastIndexOf('\\') + 1).split('.')[0],
                extension: file.substr(file.lastIndexOf('\\') + 1).split('.')[1],
                currentPath: path.join(dir, file),
                parent: dir.replace('upload//', ''),
                size: fs.statSync(path.join(dir, file)).size,
                type: mime.getType(file),
                isFolder: false
            });
    });
    return filelist;
};



module.exports = router;