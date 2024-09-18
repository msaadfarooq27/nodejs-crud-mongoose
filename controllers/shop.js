const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res, next)=>{
    Product.find().then(products => {
        console.log(products)
        res.render('shop/product-list', {prods: products, pageTitle: 'All Products', path: '/products', hasProducts: products.length > 0, activeShop: true, productCSS: true});
    }).catch(err => {
        console.log(err);
    });
    
    // console.log('shop.js',adminData.products);
    // res.sendFile(path.join(rootDir, 'views', 'shop.html'))
 }

exports.getProductDetails = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId).then(row => {
        res.render('shop/product-detail', {product: row , pageTitle: row.title, path: '/products'});
    }).catch(err => {
        console.log(err);
    });
    
}

exports.getIndex = (req, res, next) => {
    Product.find().then(products =>{
        res.render('shop/index', {prods: products, pageTitle: 'Shop', path: '/', hasProducts: products.length > 0, activeShop: true, productCSS: true});
    }).catch(err => {
        console.log(err);
    });
}
exports.getCart = (req, res, next) => {
    req.user.populate('cart.items.productId').then(user => {
        const products = user.cart.items;
        // console.log(products)
        res.render('shop/cart', {path: '/cart', pageTitle: 'Your Cart', products: products}); 
    }).catch(err => {
        console.log(err);
    })
    // req.user.getCart().then(cart => {
    //     return cart.getProducts().then(cartProducts => {
    //         res.render('shop/cart', {path: '/cart', pageTitle: 'Your Cart', products: cartProducts}); 
    //     }).catch(err => {
    //         console.log(err);
    //     });
    // }).catch(err => {
    //     console.log(err);
    // });
    // Cart.getProducts(cart =>{
    //     Product.findAll(products => {
    //         const cartProducts = [];
    //         for (product of products){
    //             const cartProductData = cart.products.find(prod => prod.id === product.id);
    //             if(cartProductData){
    //                 cartProducts.push({productData: product, qty: cartProductData.quantity})
    //             }
    //         }
    //         res.render('shop/cart', {path: '/cart', pageTitle: 'Your Cart', products: cartProducts});
    //     })
        
    // })
   
}

exports.postCart = (req, res, next) => {
const prodId = req.body.productId;
Product.findById(prodId).then(product => {
    return req.user.addToCart(product);
}).then(result => {
    console.log(result)
    res.redirect('/cart')
}).catch(err => {
    console.log(err)
})
// let fetchedCart;
// let newQuantity = 1;
// req.user.getCart().then(cart => {
//     fetchedCart= cart;
//     return cart.getProducts({ where: { id: prodId }}).then(products => {
//        let product;
//         if(products.length > 0){
//             product = products[0];
//         }
//         if(product){
//            const oldQuantity = product.cartItem.quantity;
//            newQuantity = oldQuantity + 1;
//            return product
//         }
//         return Product.findByPk(prodId);
//         }).then(product=>{
//             return fetchedCart.addProduct(product, {through: {quantity: newQuantity}})
//         }).catch(err => {
//             console.log(err);
//         }).then(()=>{
//             res.redirect('/');
//         })
//     }).catch(err => {
//     console.log(err);
// })
// const prodId = req.body.productId;
// Product.findById(prodId, product => {
//     console.log(product.price);
//     Cart.addProduct(prodId, product.price);
// });
// res.redirect('/cart');
}

exports.getCheckout = (req, res, next) =>{
    res.render('shop/checkout', {pageTitle: 'Checkout'})
}

exports.postCartDeleteProduct = (req, res, next)=>{
    const prodId = req.body.productId;
    req.user.removeFromCart(prodId).then(result => {
        res.redirect('/cart');
    }).catch(err => console.log(err));
    }

exports.postCreateOrder = (req, res, next) => {
    req.user.populate('cart.items.productId').then(user =>{
        console.log(user.cart.items);
        const products = user.cart.items.map(i => {
            return {quantity: i.quantity , product: {...i.productId._doc}}
        });
        const order = new Order({
            user: {
                name: req.user.name,
                userId: req.user
            },
            products: products
        })
        return order.save();
    }).then(result => {
        return req.user.clearCart();
    }).then(result => {
        return res.redirect('/orders')
    }).catch(err => {
        console.log(err);
    })

    // let fetchedCart;
    // req.user.getCart().then(cart => {
    //     fetchedCart = cart;
    //     return cart.getProducts();
    // }).then(products => {
    //     return req.user.createOrder().then(order => {
    //         return order.addProducts(products.map(product => {
    //             product.orderItem = { quantity: product.cartItem.quantity }
    //             return product;
    //         }))
    //     }).catch(err => {
    //         console.log(err);
    //     });
    // }).then(result => {
    //     fetchedCart.setProducts(null);
    // }).then(result => {
    //     res.redirect('/orders')
    // }).catch(err => {
    //     console.log(err)
    // })
}

exports.getOrders = (req, res, next) => {
    Order.find({'user.userId': req.user._id}).then(orders => {
        res.render('shop/orders', {path: '/orders', pageTitle: 'Your Orders', orders : orders});
    }).catch(err => {
        console.log(err);
    })
}