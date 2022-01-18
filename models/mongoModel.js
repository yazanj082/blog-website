//importing mongoose
const mongoose = require('mongoose');
//connecting to my db and collection
mongoose.connect('mongodb://localhost:27017/blogDB', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  //making my documents schema
  const postSchema={
    title:String,
    body:String,
    date:Date,
    
    
}

const Post = mongoose.model('Post',postSchema);





    
  module.exports = {
    //to add new post
      addPost : (title , body)=>{
 

  const newPost = new Post({
    title:title,
    body:body,
    date: Date.now(),
    
    });
    newPost.save();
  },
  //return object filled with 5 posts after skipping to an index
  listPosts : async (index)=>{
    try {
        const list = await Post.find().sort('-date').limit(5).skip(index);
    return list;
    } catch (err) {
        console.error(err.message);
    }
    
},
//return total number of pages needed to display 5 posts in each page
  countPages : async ()=>{
      try {let count = await Post.countDocuments();
      return Math.ceil(count/5);
          
      } catch (err) {
        console.error(err.message);
      }
    
    
  },
  //get selected post by id
  getById : async (id)=>{
    try {
      const doc = await Post.findById(id);
  return doc;
  } catch (err) {
      console.error(err.message);
  }
  }
}
   