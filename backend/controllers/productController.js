const Product = require('../models/Product');

const addProduct = async (req, res) => {
    let products = await Product.find({});
    let id;
    if (products.length > 0) {
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id + 1;
    } else {
        id = 1;
    }
    const product = new Product({
        id: id,
        name: req.body.name,
        description: req.body.description,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
        sizes: req.body.sizes,
    });
    console.log(product);
    await product.save();
    console.log("Saved");
    res.json({
        success: true,
        name: req.body.name,
    })
}

const removeProduct = async (req, res) => {
    await Product.findOneAndDelete({
        id: req.body.id
    });
    console.log("Removed");
    res.json({
        success: true,
        name: req.body.name,
    })
}

const getSingleProduct = async (req, res) => {
    try {
        const product = await Product.findOne({
            id: parseInt(req.params.id)
        });
        if (!product) return res.status(404).json({
            message: 'Product not found'
        });
        res.json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Server error'
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        const {
            id
        } = req.params;
        const updateFields = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(id, updateFields, {
            new: true
        });

        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.json({
            success: true,
            product: updatedProduct
        });
    } catch (err) {
        console.error('Error updating product:', err);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

const allProducts = async (req, res) => {
    try {
        const {
            page = 1, limit = 5, search = ''
        } = req.query;

        const query = search ?
            {
                name: {
                    $regex: search,
                    $options: 'i'
                }
            } // tìm theo tên, không phân biệt hoa thường
            :
            {};

        const total = await Product.countDocuments(query);
        const products = await Product.find(query)
            .skip((page - 1) * limit)
            .limit(Number(limit));

        res.json({
            products,
            currentPage: Number(page),
            totalPages: Math.ceil(total / limit),
        });
    } catch (err) {
        console.error('Error in allProducts:', err);
        res.status(500).json({
            message: 'Server Error'
        });
    }
};


const newcollections = async (req, res) => {
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("NewCollection Fetched");
    res.send(newcollection);
}

const popularinwomen = async (req, res) => {
    let products = await Product.find({
        category: "women"
    })
    let popular_in_women = products.slice(0, 4);
    console.log("Popular in women fetched");
    res.send(popular_in_women);
}

const getProductsByCategory = async (req, res) => {
    try {
        const category = req.params.category;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 8;
        const search = req.query.search || '';
        const skip = (page - 1) * limit;

        const query = {
            category,
            name: { $regex: search, $options: 'i' }  // tìm kiếm không phân biệt hoa thường
        };

        const total = await Product.countDocuments(query);

        const products = await Product.find(query)
            .skip(skip)
            .limit(limit);

        res.json({
            success: true,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            products
        });
    } catch (err) {
        console.error("Error fetching category products:", err);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};


module.exports = {
    addProduct,
    removeProduct,
    getSingleProduct,
    updateProduct,
    allProducts,
    newcollections,
    popularinwomen,
    getProductsByCategory
};