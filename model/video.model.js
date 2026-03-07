import mongoose, {schema}from 'mongoose';
const videoSchema = new mongoose.Schema({
    videoFile: {
        type: String, //cloudnary URL
        required: true         
    },      
    thumbnail: {  
        type: String,
        required: true
    },      
    title: { 
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
   duration:{
        type: Number,
        required: true  
   }
});

export const Video = mongoose.model('Video', videoSchema);