const userModel = require("../models/user.model");

module.exports.createUser = async ({
  firstname,
  lastname,
  email,
  password,
  role
}) => {
  if (!firstname || !email || !password) {
    throw new Error('All fields are required')
  }
  const user=await new userModel({
    fullname:{
        firstname,
        lastname
    },
    email,
    password,
    role
  })
  await user.save()
  return user;
};
