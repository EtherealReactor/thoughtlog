const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// ------------------------------------------------------------------------------
//  Constants and other variables.
// ------------------------------------------------------------------------------
const STATUS = ['published', 'deleted', 'drafted'];


// ------------------------------------------------------------------------------
//  Schema definition
// ------------------------------------------------------------------------------
const thoughtSchema = new mongoose.Schema({
  description: {
    type: String,
    trim: true,
    required: [true, 'A thought should have some description.']
    minlength: [5, 'A thought should be atleast 5 characters long']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: STATUS,
    default: 'published'
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

var Thought = mongoose.model('Thought', thoughtSchema);

module.exports = Thought;
