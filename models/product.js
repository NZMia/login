var mongoose = require("mongoose");

// product Schema
var productSchema = mongoose.Schema({
    title:{
        type:String
    },
   category:{
        type:String
    },
    img:{
        type:String
    },
    price:{
        type:Number
    },
    description:{
        type:String
    },
    meta:{
        createdAt:{
            type:Date,
            default:Date.now()
        },
        updateAt:{
            type:Date,
            default:Date.now()
        }
    }
});
productSchema.pre("save",function(next) {
    if (this.isNew)
    {
        this.meta.createdAt = this.meta.updateAt = Date.now();
    }
    else
    {
        this.meta.updateAt = Date.now();
    }
    next();
});
// create collection
var Product = module.exports = mongoose.model('User',productSchema);
// export model