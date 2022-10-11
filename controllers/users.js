const bcryptjs = require('bcryptjs');
const usersRouters = require('express').Router();
const User = require('../models/user');

usersRouters.get('/', async (request, response) => {
  const users = await User.find({});
  response.json(users);
});

usersRouters.post('/', async (request, response) => {
  const { username, name, password } = request.body;

  const passwordHash = await bcryptjs.hash(password, 10);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
});

module.exports = usersRouters;
