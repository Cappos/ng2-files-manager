const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const path = require('path');
const fs = require('fs-extra');
const multer = require('multer');
const File = mongoose.model('file');


/** API path that will upload the files */
router.post('/', function (req, res, next) {
    // File upload
    let storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, './temp/');
        },
        filename: function (req, file, cb) {
            let datetimestamp = Date.now();
            // cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
            cb(null, file.originalname);
        },
    });

    let upload = multer({ //multer settings for single upload
        storage: storage
    }).any();

    let oldPath = '';
    let parentId = '';
    let oldParentId = '';
    let filename = '';

    upload(req, res, function (err) {
        if (err) {
            res.json({error_code: 1, err_desc: err});
            return;
        }
        let fileData = req.files[0];
        filename = fileData.filename;
        let name = filename.substr(filename.lastIndexOf('\\') + 1).split('.')[0];
        let extension = filename.substr(filename.lastIndexOf('\\') + 1).split('.')[1];
        let dir = req.body.dir;

        let srcpath = `./temp/${filename}`;
        let dstpath = dir === '/' ? path.join('upload', filename.replace(/\/$/, "")) : path.join('upload', dir.replace(/\/$/, ""), filename.replace(/\/$/, ""));
        let destination = dir === '/' ? `upload` : path.join('upload', dir.replace(/\/$/, ""));

        // check if file with same name exist
        fs.pathExists(dstpath, (err, exists) => {
            if (exists) {
                File.find({originalname: fileData.originalname, deleted: false}).then(res => {
                    let fileCount = `(copy ${res.length})`;
                    filename = name + ' ' + fileCount + '.' + extension;
                    let destination = path.join('upload', dir.replace(/\/$/, ""), filename.replace(/\/$/, ""));
                    fs.move(srcpath, destination, err => {
                        if (err) return console.error(err);
                        console.log('success!')
                    });
                });
            }
            else {
                fs.move(srcpath, dstpath, err => {
                    if (err) return console.error(err);
                    console.log('success!')
                });
            }

            let file = new File({
                destination: destination,
                encoding: fileData.encoding,
                fieldname: fileData.fieldname,
                filename: filename,
                mimetype: fileData.mimetype,
                originalname: fileData.originalname,
                path: dstpath,
                oldPath: oldPath,
                parentId: parentId,
                oldParentId: oldParentId,
                size: fileData.size,
                isFolder: false
            }).save(file => file);

            res.send(req.files);
        });
    });
});

module.exports = router;