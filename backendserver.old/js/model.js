const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  lessonHash : {
    type: String,
    required: true,
  },
  lessonData : {
    type: Object,
    require : true
  },
});

const lessons = mongoose.model("Lessons", lessonSchema);

module.exports = lessons;