const express = require('express');

const PORT = 3000;

const app = express();

app.get('/hello', (req, res)=> {
  console.log('first hello')
  res.send('world');
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
