## Installation
`npm i -S hapi-multi-mongoose`

## Usage
```
const Hapi = require('hapi');
const HapiMultiMongooose = require('hapi-multi-mongoose');
const server = new Hapi.Server();
 
server.register({
    register: HapiMultiMongooose,
    options: {
        dbs: [{
            uri: 'mongodb://localhost/marketing',
            name: 'marketing'
        }, {
            uri: 'mongodb://localhost/sales',
            name: 'sales'
        }]
    }
});

const { mongoose, connections } = server.plugins['hapi-multi-mongoose'];
const Schema = mongoose.Schema;

const productSchema = new Schema({ name: String });
 
const Product = connections.sales.model('Product', productSchema);
 
const phone = new Product({ name: 'iPhone' });
 
phone.save((err) => {
    if (err) {
        return err;
    }
    
    // Done
})
```