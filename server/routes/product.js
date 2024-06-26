const express = require('express');
const router = express.Router();
const { User } = require('../models/User');
const { Product } = require('../models/Product');
const multer = require('multer');

const { auth } = require('../middleware/auth');
const FileHandlerService = require('../libs/file-handler.lib');

//=================================
//             Product
//=================================

var storage = multer.memoryStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.jpg' || ext !== '.png') {
      return cb(res.status(400).end('Only jpg and png allowed'), false);
    }
    cb(null, true);
  },
});

const upload = multer({ storage: multer.memoryStorage() });

const fileUploadHandler = new FileHandlerService();
router.post('/uploadImage', auth, upload.single('file'), async (req, res) => {
  // upload(req, res, error => {
  //     if (error) {
  //         return res.json({success: false, error})
  //     }
  //     return res.json({success: true, image: res.req.file.path, fileName: res.req.file.filename})
  // })
  if (!req.file) {
    return res
      .status(403)
      .json({ success: false, message: 'No file uploaded' });
  }
  try {
    const uploadResult = await fileUploadHandler.uploadToS3(req.file);

    return res.status(200).json({
      success: true,
      message: `File uploaded successfully`,
      data: uploadResult.Location,
    });
  } catch (error) {
    return res.json({ success: false, error });
  }
});

router.post('/uploadProduct', auth, (req, res) => {
  const product = new Product(req.body);

  product.save((e) => {
    if (e) {
      return res.status(400).json({ success: false, e });
    }
    return res.status(200).json({ success: true });
  });
});

router.post('/getProducts', (req, res) => {
  let order = req.body.order ? req.body.order : 'desc';
  let sortBy = req.body.sortBy ? req.body.sortBy : '_id';
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = parseInt(req.body.skip);

  let findArgs = {};

  let term = req.body.searchTerm;

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === 'price') {
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1],
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  if (term) {
    Product.find(findArgs)
      .find({ $text: { $search: term } })
      .populate('writer')
      .sort([[sortBy, order]])
      .skip(skip)
      .limit(limit)

      .exec((err, products) => {
        if (err) return res.status(400).json({ success: false, err });
        res
          .status(200)
          .json({ success: true, products, postSize: products.length });
      });
  } else {
    Product.find(findArgs)
      .populate('writer')
      .sort([[sortBy, order]])
      .skip(skip)
      .limit(limit)

      .exec((err, products) => {
        if (err) return res.status(400).json({ success: false, err });
        res
          .status(200)
          .json({ success: true, products, postSize: products.length });
      });
  }
});

router.get('/products_by_id', (req, res) => {
  let type = req.query.type;
  let productIds = req.query.id;

  if (type === 'array') {
    let ids = req.query.id.split(',');
    productIds = [];
    productIds = ids.map((item) => {
      return item;
    });
  }

  Product.find({ _id: { $in: productIds } })
    .populate('writer')
    .exec((err, product) => {
      if (err) return req.status(400).send(err);
      return res.status(200).send(product);
    });
});

module.exports = router;
