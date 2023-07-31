const Post = require('../Models/Post');
const User = require('../Models/User');
const { signToken } = require("../Config/jwt");

exports.createPost = async (req, res, next) => {
    try {
        const { title, description } = req.body;
        const { id } = req.params;
        if (!title || !description) {
            const error = new Error("Field is required");
            error.statusCode = 400;
            throw error;
        }
        const user = await User.findById(id);
        if (!user) {
            const error = new Error("User not Found")
            error.statusCode = 404;
            throw error;
        }
        const post = await Post.create({ user_id: id, title, description });
        await post.save();

        user.posts.push(post._id);
        res.status(200).json({
            message: "Post created",
            post: post,
        });
    }
    catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}
exports.deletePost = async (req, res, next) => {
    try {
        const { post_id, user_id } = req.params;

        const user = await User.findById(user_id);
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }

        const post = await Post.findById(post_id);
        if (!post) {
            const error = new Error("Post not found");
            error.statusCode = 404;
            throw error;
        }
        // check if post is created by this user
        if (!post.user_id.equals(user_id)) {
            const error = new Error("You are not authorized to delete this post");
            error.statusCode = 401;
            throw error;
        }
        await Post.findByIdAndDelete(post_id);

        user.posts = user.posts.filter((post_id) => !post.user_id.equals(post_id));
        await user.save();
        res.status(200).json({
            message: "Post deleted"
        });
    }
    catch (error) {
        console.log(error);
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}
exports.getPost = async (req, res, next) => {
    try {

        const { post_id } = req.params;
        const post = await Post.findById(post_id)
            .populate("comments.user_id", "name")
            .populate("like", "name");
        if (!post) {
            const error = new Error("Post not found");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            message: "Post fetched",
            post: post
        })

    } catch (error) {
        console.log(error);
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}
exports.getAllPost = async (req, res, next) => {
    try {
        const { user_id } = req.params;
        const user = await User.findById(user_id)
            .populate("posts", "details");

        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }
        //for each post of the user populate the comments and likes
        const posts = await Promise.all(
            user.posts.map(async (post) => {
                const postDetails = await Post.findById(post._id)
                    .populate("comments.user_id", "name")
                    .populate("like", "name");
                return postDetails;
            }));

        posts.sort((a, b) => b.created_at - a.created_at);

        res.status(200).json({
            message: "Post fetched",
            posts: posts
        })
    } catch (error) {
        console.log(error);
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.likePost = async (req, res, next) => {

    try {
        const { post_id, user_id } = req.params;

        const user = await User.findById(user_id);
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }

        const post = await Post.findById(post_id);
        if (!post) {
            const error = new Error("Post not found");
            error.statusCode = 404;
            throw error;
        }

        // check if post is already liked by this user
        if (post.likes.includes(user_id)) {
            const error = new Error("Post is already liked by you");
            error.statusCode = 401;
            throw error;
        }

        post.likes.push(user_id);
        await post.save();

        res.status(200).json({
            message: "Post liked successfully"
        });

    } catch (error) {
        console.log(error);
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.unlikePost = async (req, res, next) => {

    try {
        const { post_id, user_id } = req.params;

        const user = await User.findById(user_id);
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }

        const post = await Post.findById(post_id);
        if (!post) {
            const error = new Error("Post not found");
            error.statusCode = 404;
            throw error;
        }

        // check if post is already liked by this user
        if (!post.likes.includes(user_id)) {
            const error = new Error("Post is not liked by you");
            error.statusCode = 401;
            throw error;
        }

        post.likes = post.likes.filter((id) => !id.equals(user_id));
        await post.save();

        res.status(200).json({
            message: "Post unliked successfully"
        });

    } catch (error) {
        console.log(error);
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.addComment = async (req, res, next) => {

    try {

        const { comment } = req.body;
        const { user_id, post_id } = req.params;
        const user=await User.findById(user_id);
        if(!user)
        {
            const error=new Error("User not found");
            error.statusCode=404;
            throw error;
        }
        const post=await Post.findById(post_id);
        if(!post)
        {
            const error=new Error("Post not found");
            error.statusCode=404;
            throw error;
        }
        // add comment to the post having id as post_id by user
        const newComment = {
            user_id: user_id,
            comment: comment
        }
        post.comments.push(newComment);
        await post.save();
        res.status(200).json({
            message: "Comment added successfully",
            comment:newComment

        });

    } catch (error) {
        console.log(error);
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}