const User = require('../Models/User');
const { signToken } = require('../Config/jwt');

exports.createUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        console.log(name, email, password);
        await User.findOne({ email: email })
            .then(user => {
                if (user) {
                    const error = new Error("Email already Used. Please use a different email");
                    error.statusCode = 409;
                    throw error;
                }
            })
            .catch(err => {
                console.log(err);
                if (!err.statusCode) {
                    err.statusCode = 500;
                }

            });
        const newUser = await User.create({ name, email, password });
        await newUser.save();
        res.status(200).json({
            message: "User created",
            // userId: result,
            id: newUser._id,
            email: newUser.email,
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
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log(email,password);
        if (!email) {
            const error = new Error("Email is Required");
            error.statusCode = 400;
            throw error;
        }
        const user = await User.findOne({ email });
        if (!user) {
            const error = new Error("Email not found");
            error.statusCode = 404;
            throw error;
        }
        const Match = await user.comparePassword(password);
        if (!Match) {
            const error = new Error("Incorrect Password");
            error.statusCode = 401;
            throw error;
        }
        const token = signToken({
            user_id: user._id,
        });
        res.status(200).json({
            message: 'user is loggedIn',
            token: token,
            userId: user._id,
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

exports.getUser = async (req, res, next) => {

    try {
        const { id } = req.params;
        const user = await User.findById(id)
            .populate("followers")
            .populate("followings");
        if (!user) {
            const error = new Error("User not found")
            error.statusCode=404;
            throw error;
        }
        res.status(200).json({
            message: "user found",
            name: user.name,
            followers: user.followers.length,
            following: user.followings.length,
        })
    }
    catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.follow = async (req, res, next) => {
    try {
        const { follow_id, user_id } = req.params;
        let followedByMe = false
        // check whether the logged in user is already a follower of this person or not
        const currentUser = await User.findById(user_id);
        if(!currentUser)
        {
            const error = new Error("User not found")
            error.statusCode=404;
            throw error;
        } 
        const followUser= await User.findById(follow_id);
        if(!followUser)
        {
            const error = new Error("User not found")
            error.statusCode=404;
            throw error;
        } 

        for (let i=0 ;i<currentUser._doc.followings.length;i++){
            if(currentUser._doc.followings[i] == follow_id){
                followedByMe = true
                break
            }
        }
        if(followedByMe){
            const error = new Error("Already following this user");
            error.statusCode = 409;
            throw error;
        }
        // if not then add the logged in user to the followers list of the person
        else{
            // const user = await User.findById(follow_id);
            followUser.followers.push(user_id);
            await followUser.save();
            // add the person to the following list of the logged in user
            // const currentUser = await User.findById(user_id);
            currentUser.followings.push(follow_id);
            await currentUser.save();
            res.status(200).json({
                message: "followed",
            })
        }

    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}
exports.unFollow=async(req,res,next)=>{
    try {
        const {user_id,follow_id}=req.params;
        const currentUser = await User.findById(user_id);
        if(!currentUser)
        {
            const error = new Error("User not found")
            error.statusCode=404;
            throw error;
        } 
        console.log(currentUser.name,currentUser.email);
        const followUser= await User.findById(follow_id);
        if(!followUser)
        {
            const error = new Error("Followed User not found")
            error.statusCode=404;
            throw error;
        } 
        let followedByMe = false
        // check whether the logged in user is already a follower of this person or not
        for (let i=0 ;i<currentLoggedInUser._doc.followings.length;i++){
            if(currentLoggedInUser._doc.followings[i] == follows_id){
                followedByMe = true
                break
            }
        }
        if(!followedByMe){
            const error = new Error("Already not following this user");
            error.statusCode = 409;
            throw error;
        }
        // if not then add the logged in user to the followers list of the person
        else{
            // const user = await User.findById(follows_id);
            followUser.followers.pull(user_id);
            await followUser.save();
            // add the person to the following list of the logged in user
            // const currentUser = await User.findById(user_id);
            currentUser.followings.pull(follows_id);
            await currentUser.save();
            res.status(200).json({
                message: "unfollowed",
            })
        }

    } catch (error) {
        console.log(error);
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);

    }
}