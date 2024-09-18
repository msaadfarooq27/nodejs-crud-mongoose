const Product = require("../models/product");


exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {pageTitle: 'Add Product', path: '/admin/add-products', activeAddProduct: true, formsCSS: true, productCSS: true, editing: false})
    // console.log('In yet another middle ware');
    // res.sendFile(path.join(rootDir, 'views', 'add-product.html'))
 }

exports.postAddProduct = (req, res, next)=>{
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product =  new Product({title: title, price: price, description: description, imageUrl: imageUrl, userId: req.user._id})
    product.save().then((result) => {
        console.log('Product Created');
        res.redirect('/admin/products')
    }).catch((err) => {
        console.log(err)
    });
 }

 exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if(!editMode){
       return res.redirect('/')
    }
    const prodId = req.params.productId;
    Product.findById(prodId).then(product => {
        // const product = products[0];
        if(!product){
        return res.redirect('/');
        }
        res.render('admin/edit-product', {pageTitle: 'Edit Product', path: '/admin/edit-product', editing: editMode, product: product})
    }).catch(err => {
        console.log(err);
    })
 }

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;
    Product.findById(prodId).then(product => {
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.imageUrl = updatedImageUrl;
        product.description = updatedDescription;
         return product.save()
    }).then(result => {
    console.log('Product Updated');
    res.redirect('/admin/products')
   }).catch(err => {
    console.log(err);
   });
}

exports.postDeleteProduct = (req, res, next) => {
const prodId = req.body.productId;
    Product.findByIdAndDelete(prodId).then(result => {
        console.log('Product Deleted!');
        res.redirect('/admin/products');
    }).catch(err => {
        console.log(err)
    })
}

exports.getProducts = (req, res, next)=>{
    Product.find()
    // .populate('userId')
    .then( products => {

        console.log(products)
        res.render('admin/products', {prods: products, pageTitle: 'Admin Products', path: '/admin/products', hasProducts: products.length > 0, activeShop: true, productCSS: true});
    }).catch(err => {
        console.log(err);
    });
}