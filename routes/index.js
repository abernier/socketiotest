const express = require('express');
const router  = express.Router();

router.put('/orders/:id', (req, res, next) => {
  const orderId = req.params.id

  const newOrder = {status: 4}

  req.io.to(orderId).emit('order:update', newOrder)

  res.json(newOrder)
})

module.exports = router;
