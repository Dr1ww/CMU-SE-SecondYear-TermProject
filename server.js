const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();

// 创建数据库连接
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'Qbw200452.,',
    database: 'flywings'
});

// 连接数据库
db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database');
});

// 设置 EJS 模板引擎
app.set('view engine', 'ejs');

// 设置静态文件目录
app.use(express.static('public'));

// 使用 body-parser 中间件解析请求体
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 路由处理
app.get('/', (req, res) => {
    // 查询数据库获取产品信息
    const sql = 'SELECT * FROM product';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        // 渲染 EJS 模板并传递产品信息
        res.render('HomePage', { products: results });
    });
});

// 获取单个产品信息
app.get('/product', (req, res) => {
    const productId = req.query.productId;
    const sql = 'SELECT * FROM product WHERE id = ?';
    db.query(sql, [productId], (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.render('product', { productData: results[0] });
    });
});
//获取men
app.get('/MenHomePage', (req, res) => {
    // 从数据库中获取menproduct数据
    db.query('SELECT * FROM menproduct', (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        // 将menproduct数据传递给MenHomePage.ejs模板
        res.render('MenHomePage', { menproduct: results });
    });
});
//获取women
app.get('/WomenHomePage', (req, res) => {
    // 从数据库中获取menproduct数据
    db.query('SELECT * FROM womenproduct', (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        // 将menproduct数据传递给MenHomePage.ejs模板
        res.render('WomenHomePage', { womenproduct: results });
    });
});
//获取kids
app.get('/KidsHomePage', (req, res) => {
    // 从数据库中获取menproduct数据
    db.query('SELECT * FROM kidsproduct', (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        // 将menproduct数据传递给MenHomePage.ejs模板
        res.render('KidsHomePage', { kidsproduct: results });
    });
});




// 定义计算购物车总价的函数
function calculateSubtotal(cartItems) {
    let subtotal = 0;
    for (const item of cartItems) {
        const price = parseFloat(item.price);
        if (!isNaN(price)) {
            subtotal += price;
        }
    }
    return subtotal.toFixed(2);
}
// 获取购物车信息
app.get('/cart', (req, res) => {
    // 查询数据库获取购物车信息
    const sql = 'SELECT * FROM cart';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        // 渲染 cart.ejs 模板并传递购物车信息和总价
        res.render('cart', { cartItems: results, calculateSubtotal: calculateSubtotal });
    });
});


// 添加到购物车的路由处理
app.post('/add-to-cart', (req, res) => {
    // 从请求体中获取商品信息
    const { title, size, price } = req.body;

    // 将商品信息插入到数据库的购物车表中
    const sql = 'INSERT INTO cart (title, size, price) VALUES (?, ?, ?)';
    db.query(sql, [title, size, price], (err, result) => {
        if (err) {
            console.error('Error inserting into database:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        console.log('Item added to cart successfully!');
        // 响应客户端请求
        res.redirect('/cart');
    });
});

// 删除购物车物品的路由处理
app.post('/remove-from-cart', (req, res) => {
    const itemId = req.body.itemId;
    const sql = 'DELETE FROM cart WHERE itemId = ?';
    db.query(sql, [itemId], (err, result) => {
        if (err) {
            console.error('Error removing item from cart:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        console.log('Item removed from cart successfully!');
        // 发送成功响应
        res.send('Item removed from cart successfully!');
    });
});

app.get('/menproduct/:productId', (req, res) => {
    const productId = req.params.productId;
    const sql = 'SELECT * FROM menproduct WHERE id = ?';
    db.query(sql, [productId], (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.render('product', { productData: results[0] });
    });
});
app.get('/womenproduct/:productId', (req, res) => {
    const productId = req.params.productId;
    const sql = 'SELECT * FROM womenproduct WHERE id = ?';
    db.query(sql, [productId], (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.render('product', { productData: results[0] });
    });
});
app.get('/kidsproduct/:productId', (req, res) => {
    const productId = req.params.productId;
    const sql = 'SELECT * FROM kidsproduct WHERE id = ?';
    db.query(sql, [productId], (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.render('product', { productData: results[0] });
    });
});



app.get('/FAQ', (req, res) => {
    // 在这里发送您的FAQ页面
    res.render('FAQ'); // 假设您的FAQ页面是使用ejs模板渲染的，这里假设模板文件名为FAQ.ejs
});
app.get('/SignInPage', (req, res) => {
    // 在这里发送您的FAQ页面
    res.render('SignInPage'); // 假设您的FAQ页面是使用ejs模板渲染的，这里假设模板文件名为FAQ.ejs
});

// 在您的 Express 应用中添加一个特定路由用于处理 特定 页面的请求
app.get('/specialDiscount', (req, res) => {
    const sql = 'SELECT * FROM menproduct WHERE cate_id = ?'; 
    db.query(sql, ['SD'], (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.render('SubNavPage', { menproduct: results });
    });
});

app.get('/featuredClothing', (req, res) => {
    const sql = 'SELECT * FROM menproduct WHERE cate_id = ?'; 
    db.query(sql, ['FC'], (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.render('SubNavPage', { menproduct: results });
    });
});

app.get('/Sneakers', (req, res) => {
    const sql = 'SELECT * FROM menproduct WHERE cate_id = ?'; 
    db.query(sql, ['Sn'], (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.render('SubNavPage', { menproduct: results });
    });
});

app.get('/RunningShoes', (req, res) => {
    const sql = 'SELECT * FROM menproduct WHERE cate_id = ?'; 
    db.query(sql, ['RS'], (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.render('SubNavPage', { menproduct: results });
    });
});

app.get('/BasketBallShoes', (req, res) => {
    const sql = 'SELECT * FROM menproduct WHERE cate_id = ?'; 
    db.query(sql, ['BS'], (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.render('SubNavPage', { menproduct: results });
    });
});

app.get('/Fitness', (req, res) => {
    const sql = 'SELECT * FROM menproduct WHERE cate_id = ?'; 
    db.query(sql, ['FT'], (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.render('SubNavPage', { menproduct: results });
    });
});

app.get('/Accessories', (req, res) => {
    const sql = 'SELECT * FROM menproduct WHERE cate_id = ?'; 
    db.query(sql, ['Ac'], (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.render('SubNavPage', { menproduct: results });
    });
});
//Women
app.get('/specialDiscount_W', (req, res) => {
    const sql = 'SELECT * FROM womenproduct WHERE cate_id = ?'; 
    db.query(sql, ['SD'], (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.render('SubNavPageWomen', { womenproduct: results });
    });
});

app.get('/featuredClothing_W', (req, res) => {
    const sql = 'SELECT * FROM womenproduct WHERE cate_id = ?'; 
    db.query(sql, ['FC'], (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.render('SubNavPageWomen', { womenproduct: results });
    });
});

app.get('/Sneakers_W', (req, res) => {
    const sql = 'SELECT * FROM womenproduct WHERE cate_id = ?'; 
    db.query(sql, ['Sn'], (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.render('SubNavPageWomen', { womenproduct: results });
    });
});

app.get('/RunningShoes_W', (req, res) => {
    const sql = 'SELECT * FROM womenproduct WHERE cate_id = ?'; 
    db.query(sql, ['RS'], (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.render('SubNavPageWomen', { womenproduct: results });
    });
});

app.get('/BasketBallShoes_W', (req, res) => {
    const sql = 'SELECT * FROM womenproduct WHERE cate_id = ?'; 
    db.query(sql, ['BS'], (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.render('SubNavPageWomen', { womenproduct: results });
    });
});

app.get('/Fitness_W', (req, res) => {
    const sql = 'SELECT * FROM womenproduct WHERE cate_id = ?'; 
    db.query(sql, ['FT'], (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.render('SubNavPageWomen', { womenproduct: results });
    });
});

app.get('/Accessories_W', (req, res) => {
    const sql = 'SELECT * FROM womenproduct WHERE cate_id = ?'; 
    db.query(sql, ['Ac'], (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.render('SubNavPageWomen', { womenproduct: results });
    });
});
//Kids
app.get('/specialDiscount_K', (req, res) => {
    const sql = 'SELECT * FROM kidsproduct WHERE cate_id = ?'; 
    db.query(sql, ['SD'], (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.render('SubNavPageKids', { kidsproduct: results });
    });
});

app.get('/BoysClothing_K', (req, res) => {
    const sql = 'SELECT * FROM kidsproduct WHERE cate_id = ?'; 
    db.query(sql, ['BC'], (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.render('SubNavPageKids', { kidsproduct: results });
    });
});

app.get('/GirlsClothing_K', (req, res) => {
    const sql = 'SELECT * FROM kidsproduct WHERE cate_id = ?'; 
    db.query(sql, ['GC'], (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.render('SubNavPageKids', { kidsproduct: results });
    });
});

app.get('/GirlsShoes_K', (req, res) => {
    const sql = 'SELECT * FROM kidsproduct WHERE cate_id = ?'; 
    db.query(sql, ['GS'], (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.render('SubNavPageKids', { kidsproduct: results });
    });
});

app.get('/BoysShoes_K', (req, res) => {
    const sql = 'SELECT * FROM kidsproduct WHERE cate_id = ?'; 
    db.query(sql, ['BS'], (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.render('SubNavPageKids', { kidsproduct: results });
    });
});

app.get('/Accessories_K', (req, res) => {
    const sql = 'SELECT * FROM kidsproduct WHERE cate_id = ?'; 
    db.query(sql, ['Ac'], (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.render('SubNavPageKids', { kidsproduct: results });
    });
});
app.post('/pay', (req, res) => {
    // 查询购物车数据
    const sqlSelectCart = 'SELECT * FROM cart';
    db.query(sqlSelectCart, (err, cartItems) => {
        if (err) {
            console.error('Error querying cart:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        // 将购物车数据插入销售历史表
        const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' '); // 获取当前时间
        const sqlInsertSalesHistory = 'INSERT INTO SalesHistory (bill_date, product_id, number_of_items, bill_price) VALUES (?, ?, ?, ?)';
        cartItems.forEach(cartItem => {
            // 生成随机商品编号
            const products = ['k001', 'k002', 'k003', 'k004', 'k005', 'k006', 'k007', 'k008', 'k009', 'k010', 'k011', 'k012', 'k013', 'k014', 'k015', 'k016', 'k017', 'k018',
            'm001', 'm002', 'm003', 'm004', 'm005', 'm006', 'm007', 'm008', 'm009', 'm010', 'm011', 'm012', 'm013', 'm014', 'm015', 'm016', 'm017', 'm018', 'm019',
            'w001', 'w002', 'w003', 'w004', 'w005', 'w006', 'w007', 'w008', 'w009', 'w010', 'w011', 'w012', 'w013', 'w014', 'w015', 'w016', 'w017', 'w018', 'w019',
            'h000', 'h001', 'h002', 'h003', 'h004'];
            const productId = products[Math.floor(Math.random() * products.length)];
            
            // 获取购物车中商品的价格
            const price = cartItem.price;
            
            // 插入到销售历史表中
            const values = [currentDate, productId, 1, price];
            db.query(sqlInsertSalesHistory, values, (err, result) => {
                if (err) {
                    console.error('Error inserting into SalesHistory:', err);
                    res.status(500).send('Internal Server Error');
                    return;
                }
                console.log('Data saved to SalesHistory successfully!');
            });
        });

        // 清空购物车数据
        const sqlDeleteCart = 'DELETE FROM cart';
        db.query(sqlDeleteCart, (err, result) => {
            if (err) {
                console.error('Error deleting from cart:', err);
                res.status(500).send('Internal Server Error');
                return;
            }
            console.log('Data deleted from cart successfully!');
            // 发送成功响应
            res.send('Payment success!');
        });
    });
});



// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
