const mongoose = require('mongoose');
const product = require('./product');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [
        {productId: {type: Schema.Types.ObjectId, ref: 'Product', required: true},
        quantity: {type: Number, required: true}}]
    }
})

userSchema.methods.addToCart = function(product){
                const cartProductIndex = this.cart.items.findIndex(cp => {
                    return cp.productId.toString() === product._id.toString();
                })
                let newQuantity = 1;
                let updatedCartItems = [...this.cart.items];
                if(cartProductIndex >= 0) {
                    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
                    updatedCartItems[cartProductIndex].quantity = newQuantity;
                } else {
                    updatedCartItems.push({productId: product._id, quantity: newQuantity})
                }
        
                const updatedCart = {items: updatedCartItems};
                this.cart = updatedCart;
                return this.save();
            }

userSchema.methods.removeFromCart = function(prodId){
    const updatedCartItems = this.cart.items.filter(item => {
            return item.productId.toString() !== prodId.toString()
    });
    this.cart.items = updatedCartItems;
    return this.save();
}

userSchema.methods.clearCart = function(){
    this.cart = {items: []};
    return this.save();
}
// userSchema.methods.getCart = function(){
//             const productIds = this.cart.items.map(i=>{
//                 return i.productId
//             });
//             return product.findById(productIds).toArray().then(products => {
//                 return products.map(product => {
//                     return {...product, quantity: this.cart.items.find(i => {
//                         return i.productId.toString() === product._id.toString();
//                     }).quantity};
//                 })
//             })
// }
module.exports = mongoose.model('User', userSchema);
// const mongoDb = require('mongodb');
// const getDb = require('../util/database').getDb;
// const ObjectId = mongoDb.ObjectId;

// class User {
//     constructor(username, email, cart, id){
//         this.username = username;
//         this.email = email;
//         this.cart = cart;
//         this._id = id;
//     }

//     save(){
//         const db = getDb();
//         return db.collection('users').insertOne(this);
//     }

//     addToCart(product){
//         const db = getDb();
//         const cartProductIndex = this.cart.items.findIndex(cp => {
//             return cp.productId.toString() === product._id.toString();
//         })
//         let newQuantity = 1;
//         let updatedCartItems = [...this.cart.items];
//         if(cartProductIndex >= 0) {
//             newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//             updatedCartItems[cartProductIndex].quantity = newQuantity;
//         } else {
//             updatedCartItems.push({productId: product._id, quantity: newQuantity})
//         }

//         const updatedCart = {items: updatedCartItems};
//         return db.collection('users').updateOne({_id : new ObjectId(this._id)},{$set: {cart : updatedCart}})
//     }

//     deleteCartItem(productId){
//         const updatedCartItems = this.cart.items.filter(item => {
//             return item.productId.toString() !== productId.toString();
//         })
//         const db = getDb();
//         const updatedCart = {items: updatedCartItems};
//         return db.collection('users').updateOne({_id : new ObjectId(this._id)},{$set: {cart : updatedCart}})
//     }

//     getCart(){
//         const db = getDb();
//         const productIds = this.cart.items.map(i=>{
//             return i.productId
//         });
//         return db.collection('products').find({_id : {$in: productIds}}).toArray().then(products => {
//             return products.map(product => {
//                 return {...product, quantity: this.cart.items.find(i => {
//                     return i.productId.toString() === product._id.toString();
//                 }).quantity};
//             })
//         })
//     }

//     addOrder(){
//         const db = getDb();
//         return this.getCart().then(products => {
//             const order = {
//                 items: products,
//                 user: {
//                     _id: new ObjectId(this._id),
//                     name: this.username,
//                     email: this.email
//                 }
//             }
//             return db.collection('orders').insertOne(order)
//         }).then(result => {
//             this.cart = {items: []};
//             return db.collection('users').updateOne({_id : new ObjectId(this._id)},{$set: {cart : {items: []}}})
//         })
//     }

//     getOrder(){
//         const db = getDb();
//         return db.collection('orders').find({'user._id': new ObjectId(this._id)}).toArray();
//     }



//     static findById(userId){
//         const db = getDb();
//         return db.collection('users').findOne({_id: new ObjectId(userId)}).then(user => {
//             console.log(user);
//             return user;
//         }).catch(err => {
//             console.log(err);
//         });
//     }
// }

// module.exports = User;
