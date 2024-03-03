const express = require('express');
const router = express.Router();
const multer = require('multer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = "en-pinxo-li-va-dir-a-en-panxo";

const { Bolet, Tag, User } = require('./models');
const {
  createItem,
  updateItem,
  deleteItem,
  readItem,
  readItems
} = require('./generics');



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`)
  }
})

const upload = multer({ storage: storage }).single('foto');


// CRUD operations for Bolet
//router.post('/bolets', async (req, res) => await createItem(req, res, Bolet));
router.get('/bolets', async (req, res) => await readItems(req, res, Bolet));
router.get('/bolets/:id', async (req, res) => await readItem(req, res, Bolet));
router.put('/bolets/:id', async (req, res) => await updateItem(req, res, Bolet));
router.delete('/bolets/:id', async (req, res) => await deleteItem(req, res, Bolet));


// CRUD operations for Tag
router.post('/tags', async (req, res) => await createItem(req, res, Tag));
router.get('/tags', async (req, res) => await readItems(req, res, Tag));
router.get('/tags/:id', async (req, res) => await readItem(req, res, Tag));
router.put('/tags/:id', async (req, res) => await updateItem(req, res, Tag));
router.delete('/tags/:id', async (req, res) => await deleteItem(req, res, Tag));

// CRUD operations for User
//router.post('/users', async (req, res) => await createItem(req, res, User)); // replaced by register
router.get('/users', async (req, res) => await readItems(req, res, User));
router.get('/users/:id', async (req, res) => await readItem(req, res, User));
router.put('/users/:id', async (req, res) => await updateItem(req, res, User));
router.delete('/users/:id', async (req, res) => await deleteItem(req, res, User));


// post bolet, incloent foto
/*
router.post('/bolets', (req, res, next) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    if (req.file) {
      req.body.foto = req.file.filename
    }
    try {
      const item = await Bolet.create(req.body);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  })
});
*/

// post bolet per a user, incloent foto
/*
router.post('/bolets/users/:userId', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId);
    if (!user) {
       return res.status(500).json({ error: err.message })
    }
    req.body.userId = req.params.userId;

    upload(req, res, async function (err) {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      if (req.file) {
        req.body.foto = req.file.filename
      }

      const item = await Bolet.create(req.body);
      res.status(201).json(item);
    })

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

});
*/


// Middleware to check JWT token in cookie
const checkToken = (req, res, next) => {
  console.log("checking")
  const token = req.cookies?.token;
  if (!token) {
    console.log(req.cookies)
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decodedToken = jwt.verify(token, SECRET_KEY);
    req.userId = decodedToken.userId; // Set userId in the request object
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Use the middleware in the route
router.post('/bolets', checkToken, async (req, res, next) => {
  try {
    // Find the user by userId
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(500).json({ error: 'User not found' });
    }

    // Set userId in the request body
    req.body.userId = req.userId;

    upload(req, res, async function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (req.file) {
        req.body.foto = req.file.filename;
      }

      const item = await Bolet.create(req.body);
      res.status(201).json(item);
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// Endpoint to link a tag to a bolet
router.post('/bolets/:boletId/tags/:tagId', async (req, res) => {
  try {
    const bolet = await Bolet.findByPk(req.params.boletId);
    const tag = await Tag.findByPk(req.params.tagId);
    if (!bolet || !tag) {
      return res.status(404).json({ error: 'Bolet or Tag not found' });
    }
    await bolet.addTag(tag);
    res.json({ message: 'Tag linked to bolet successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to create a bolet linked to an author
router.post('/bolets/users/:userId', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const bolet = await Bolet.create({ ...req.body, userId: req.params.userId });
    res.status(201).json(bolet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to get all tags for an bolet
router.get('/bolets/:boletId/tags', async (req, res) => {
  try {
    const bolet = await Bolet.findByPk(req.params.boletId);
    if (!bolet) {
      return res.status(404).json({ error: 'Bolet not found' });
    }
    const tags = await bolet.getTags();
    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// Endpoint to get the bolets for a tag
router.get('/tags/:tagtId/bolets', async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.tagId, { include: Bolet });
    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }
    res.json(tag.bolets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// Endpoint to log in a user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Compare the provided password with the hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Incorrect password' });
    }
    // Generate JWT token
    const token = jwt.sign({ userId: user.id, userName: user.name }, SECRET_KEY, { expiresIn: '1h' });
    // Set the token in a cookie
    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // Max age: 1 hour
    res.json({ message: 'Logged in successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Endpoint to create a user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Check if name, email, and password are provided
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    // Check if the email is already registered
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered' });
    }
    // Create the user
    const user = await User.create({ name, email, password });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




module.exports = router;
