const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const userData = require('./src/data/people.json');
const PORT = 3000;

server.use(middlewares);

server.get('/search-users', async (req, res) => {
  const {query} = req;

  // Simulate Request Duration
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('ok');
    }, 350);
  });

  // Search function
  const filteredUsers = userData.filter(user => {
    return `${user.name.first} ${user.name.last}`
      .toLowerCase()
      .includes(query.name.toLowerCase());
  });

  const results = [];

  // Return only needed fields
  filteredUsers.forEach(user => {
    results.push({
      name: {...user.name},
      username: user.username,
      thumbnail: user.picture.thumbnail,
    });
  });

  res.jsonp([...results.reverse()]);
});

server.get('/select-user', async (req, res) => {
  const {query} = req;

  // Simulate Request Duration
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('ok');
    }, 350);
  });

  // Find user
  const selectedUser = userData.find(user => user.username === query.username);

  res.jsonp(selectedUser);
});

server.use(router);
server.listen(PORT, () => {
  console.log('JSON Server is running on port', PORT);
});
