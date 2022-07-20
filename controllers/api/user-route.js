const router = require('express').Router();
const { User, Property } = require('../../models');

// router.get('/booked', (req, res) => {
//   // query db and return all bookings where user_id == logged in user ID
// });

// router.get('/properties', (req, res) => {
//   // find all users rentals in the database
// });

router.get('/:id', async (req, res) => {
  // find one User by its `id` value
  try {
    const userByID = await User.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!userByID) {
      res.status(404).json({ message: 'Id does not exist' });
      return;
    }
    res.status(200).json(userByID);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post('/signUp', async (req, res) => {
  console.log(Property);
  try {
    const userData = await User.create(req.body);
    req.session.save(() => {
      req.session.logged_in = true;
      req.session.user_id = userData.id;
      console.log(req.session.user_id);

      res.status(200).json(userData);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/signIn', async (req, res) => {
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });

    if (!userData) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email orr password, please try again' });
      return;
    }
    // res.json({ user: userData, message: 'You are now logged in!' });

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.json({ user: userData, message: 'You are now logged in!' });
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/signOut', async (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

// //Optional

// router.put('/:id', (req, res) => {
//   // update a User's description by its `id` value
// });

// router.delete('/:id', (req, res) => {
//   // delete a User by its `id` value
// });

module.exports = router;
