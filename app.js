const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/user');
// const expressHbs = require('express-handlebars');

const pageNotfoundController = require('./controllers/404');

// const User =  require('./models/user');
// app.engine('handlebars', expressHbs({layoutsDir: 'views/layouts/', defaultLayout: 'main-layout', extname: 'handlebars'}));
const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const user = require('./models/user');




app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')))
app.use((req, res, next)=>{
    User.findById("66e98a5e7d9a7e70f5fc3a07").then(user => {
        req.user = user;
        next();
    }).catch(err => {
        console.log(err);
        next();
    })
})
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use('/', pageNotfoundController.get404 );
mongoose.connect('mongodb+srv://msaadfarooq27:iv99qQYg0XASf4BO@cluster0.sflkm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then(result => {
    User.findOne().then(user => {
        if(!user){
            const user = new User({
                name: 'Saad',
                email: 'msaadfarooq28@gmail.com',
                cart: {
                    items: []
                }
            });
            user.save();
        }
    })
    
    app.listen(3000);
}).catch(err =>{
    console.log(err);
})





// const express = require('express');
// const app = express();
// app.use('/users', (req, res, next)=>{
//     console.log('this is the users section');
//     res.send('<h1>This section is "users"</h1>');
// })
// app.use('/', (req, res, next)=>{
//     console.log('this is the nothing section');
//     res.send('<h1>This section is "nothing"</h1>');
// })


// app.listen(5000);