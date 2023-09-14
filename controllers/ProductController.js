exports.getAllProducts = async (req, res, next) => {
  res.send('get all products');
}

exports.createProduct = async (req, res, next) => {
  res.send('create product');
}

exports.getSingleProduct = async (req, res, next) => {
  res.send('get single product');
}

exports.updateProduct = async (req, res, next) => {
  res.send('update product');
}

exports.deleteProduct = async (req, res, next) => {
  res.send('delete product');
}

exports.uploadProductImage = async (req, res, next) => {
  res.send('upload product image');
}