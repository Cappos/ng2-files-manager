const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const File = mongoose.model('file');


/** API path that will upload the files */
router.post('/', function (req, res, next) {

    // File upload
    let storage = multer.diskStorage({ //multers disk storage settings

        destination: function (req, file, cb) {
            cb(null, './upload/');
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
    let oldParentId= '';

    upload(req, res, function (err) {
        if (err) {
            res.json({error_code: 1, err_desc: err});
            return;
        }

        let dir = req.body;
        console.log(dir);
        let fileData = req.files[0];

        // let file =  new File({
        //     destination: fileData.destination,
        //     encoding: fileData.encoding,
        //     fieldname: fileData.fieldname,
        //     filename: fileData.filename,
        //     mimetype: fileData.mimetype,
        //     originalname: fileData.originalname,
        //     path: fileData.path,
        //     oldPath: oldPath,
        //     parentId: parentId,
        //     oldParentId: oldParentId,
        //     size: fileData.size,
        //     isFolder: false
        // }).save(file => file);

        // res.send(req.files);
    });

});

module.exports = router;