const Joi = require('@hapi/joi')
const Product = require('../models/products')
const multer = require('multer')
const randomstring = require('randomstring')

const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,'./uploads')
    },
    filename: (req,file,cb)=>{
        cb(null,file.originalname)
    }
})
const uploads = multer({
    storage:storage,
    limits:{
        fileSize: 1024 * 1024 * 3
    }
})

module.exports = {
    uploads: uploads.single('file'),
    registerGet: (req, res) => {
        res.render('admin/registerProduct')
    },
    registerPost: async(req,res)=>{
        const productSchema = Joi.object({
            name:Joi.string(),
            price:Joi.number(),
            category:Joi.string(),
            file:Joi.string()
        })
        try{
            await productSchema.validateAsync(req.body).then(()=>{
                console.log('validation sucessfull')
            }).catch((err)=>{
                console.log('validation unsuccessfull')
                console.log(err.message)
                res.redirect('/admin')
            })
            const newProduct = await new Product({
                product_id: randomstring.generate(),
                name: req.body.name,
                price: req.body.price,
                category: req.body.category,
                imagePath: req.file.path
            })
            await newProduct.save().then(()=>{
                console.log('Item saved successfully')
                res.redirect('/admin')
            }).catch((err)=>{
                console.log(`error occured while saving Item to Database ${err}`)
                res.redirect('/admin')
            })
        }
        catch(err){
            console.log(`error Occured While saving Item ${err}`)
        }
    }
}