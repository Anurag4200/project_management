const userModel = require("../models/user.model");
const userService = require("../services/user.service");

module.exports.registerUser = async (req, res, next) => {
  const { fullname, email, password ,role} = req.body;

  const isUserAlreadyExist = await userModel.findOne({ email });
  if (isUserAlreadyExist) {
    return res.status(401).json({ msg: "user alrady exist" });
  }

  const hashedPassword = await userModel.hashPassword(password);

  const user = await userService.createUser({
    firstname: fullname.firstname,
    lastname: fullname.lastname,
    email,
    password: hashedPassword,
    role: role || 'user'
  });
  const token = user.generateAuthToken();

  res.cookie("token", token);

  res.status(201).json({ token, user });
};

module.exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    res.status(401).json({ msg: "invalid email or password" });
  }
  if(user.role==='admin'){
    return res.status(401).json({msg:"You are the admin do admin login"})
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ msg: "invalid email or password" });
  }
  const token = user.generateAuthToken();

  res.cookie("token", token);

  res.status(200).json({ token, user });
};

module.exports.getUserProfile = async (req, res, next) => {
  try {
    
    const user = await userModel.findById(req.user._id).populate('projects'); 

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the populated user
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

module.exports.logoutUser = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  res.cookie("token", "");

  res.status(201).json({ msg: "logout successfuly" });
};
