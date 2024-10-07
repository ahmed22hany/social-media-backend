const express = require('express');

const replyToPost= async (req,res)=>{
    try{
        const {text}=req.body;
        const postId=req.params.id;
        const userId=req.user._id;
        const username=req.user.username;
        const userProfilePIC=req.user.profilePic;
        
        const user= await user.findById(userId)
        if(!userId){
            return res.status(401).json({message: 'User not authenticated'})
        }
        
        const post = await post.findById(postId)
        if(!post){
            return res.status(404).json({message: 'Post not found'})
        }
        
        if(!text){
            return res.status(400).json({message: 'Text is required'})
        }
        const reply = {userId,username, userProfilePIC,text};
        post.replies.push(reply)
        await post.save()
        res.json({message: 'Reply added successfully', post})
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message: 'Server error'})
    }
}

    const deleteReply= async (req,res)=>{
        try{
            const postId=req.params.id;
            const replyId=req.params.replyId;
            const userId=req.user._id;
            
            if(!userId){
                return res.status(401).json({message: 'User not authenticated'})
            }
            
            const post = await post.findById(postId)
            if(!post){
                return res.status(404).json({message: 'Post not found'})
            }

            const reply= await post.replies.id(replyId)
            if(!reply){
                return res.status(404).json({message: 'Reply not found'})
            }
            await reply.remove()
            await post.save()
            res.json({message: 'Reply deleted successfully',reply})
        }
        catch(err){
            console.log(err);
            return res.status(500).json({message: 'Server error'})
        }
    }

    module.exports={replyToPost, deleteReply};