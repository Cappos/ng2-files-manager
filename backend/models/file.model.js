const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FileSchema = new Schema({
    id: String,
    destination: String,
    encoding: String,
    fieldname: String,
    filename: String,
    mimetype: String,
    originalname: String,
    path: String,
    oldPath: String,
    parentId: String,
    oldParentId: String,
    size: Number,
    isFolder: Boolean,
    tstamp: {
        type: Date,
        default: Date.now
    },
    deleted: {
        type: Boolean,
        default: false
    }
});

// FileSchema.statics.findClient = function (id) {
//
//     return this.findById(id)
//         .populate({
//             path: 'client',
//             match: {
//                 deleted: false
//             }
//         }).then(offer => offer.client);
// };

mongoose.model('file', FileSchema);