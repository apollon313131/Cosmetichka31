let express = require('express');
let app = express();
let cookieParser = require('cookie-parser');
let pagination = require('./public/js/pagination');
let admin = require('./public/js/admin');
app.use(express.static('public')); //TODO public-имя папки где хранится статика
app.set('view engine', 'pug'); //TODO задаем шаблонизатор
let mysql = require('mysql');  //TODO Подключаем модуль sql
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
const nodemailer = require('nodemailer');
const { urlencoded } = require('body-parser');
let con = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'market'
}); //TODO настраиваем модуль



process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0; //! Отключить (безопасные сертификаты)
app.listen(3000, function () {  //TODO слушаем 3000 порт
    // console.log('node exp work on 3000');
});

app.use(function (req, res, next) {
    if (req.originalUrl == '/admin' || req.originalUrl == '/admin-order') {
        admin(req, res, con, next);
    }
    else {
        next();
    }
});

//TODO Обращение к приложению через get 
app.get('/', function (req, res) {
    let cat = new Promise(function (resolve, reject) {
        con.query(
            "select id,slug,name, cost, image, category from (select id,slug,name,cost,image,category, if(if(@curr_category != category, @curr_category := category, '') != '', @k := 0, @k := @k + 1) as ind   from goods, ( select @curr_category := '' ) v ORDER BY category ) goods where ind < 8",
            function (error, result, field) {
                if (error) return reject(error);
                resolve(result);
            }
        );
    });
    let catDescription = new Promise(function (resolve, reject) {
        con.query(
            "SELECT * FROM category",
            function (error, result, field) {
                if (error) return reject(error);
                resolve(result);
            }
        );
    });
    Promise.all([cat, catDescription]).then(function (value) {
        res.render('index', {
            goods: JSON.parse(JSON.stringify(value[0])),
            cat: JSON.parse(JSON.stringify(value[1])),
        });
    });
});
app.get('/search', function (req, res) {
    res.render('search', {});
});


app.post('/search', function (req, res) {
    const keyword = req.body.keyword;
    
    let search = new Promise(function (resolve, reject) {
        con.query('SELECT * FROM goods WHERE name like "%' + keyword + '%"',
            function (error, result) {
                if (error) reject (error);
                resolve(result);
                if (result.length == 0) {
                    // console.log('error ');
                    res.redirect('st404');
                }
            });
    })
    Promise.all([search]).then(function (value) {
        res.render('search', {
            search: JSON.parse(JSON.stringify(value[0])),
            keyw: keyword
        });
        // console.log(keyword);
        
        
    });
    
});

app.get ('/st404', function (req,res){
    res.render('st404', {});
});

app.get ('/contacts', function(req,res){
    res.render('contacts', {});
});

app.get ('/delivery', function(req,res){
    res.render('delivery', {});
});




app.get('/cat', function (req, res) {
    let catid = req.query.id;
    let cat = new Promise(function (resolve, reject) {
        con.query(
            'SELECT * FROM category WHERE id=' + catid,
            function (error, result) {
                if (error) reject(error);
                resolve(result);
            });
        
    });
    let goods = new Promise(function (resolve, reject) {
        con.query(
            'SELECT * FROM goods WHERE category=' + catid,
            function (error, result) {
                if (error) reject(error);
                resolve(result);
            });
    });

    Promise.all([cat, goods]).then(function (value) {
        res.render('cat', {
            cat: JSON.parse(JSON.stringify(value[0])),
            goods: JSON.parse(JSON.stringify(value[1]))
        });
       
    });
});



app.get('/goods/*', function (req, res) {
    con.query('SELECT * FROM goods WHERE slug="' + req.params['0'] + '"', function (error, result, fields) {
        if (error) throw error;
        res.render('goods', { goods: JSON.parse(JSON.stringify(result)) });
    });
});

app.get('/goods', function (req, res) {

    con.query('SELECT * FROM goods WHERE id=' + req.query.id, function (error, result, fields) {
        if (error) throw error;
        res.render('goods', { goods: JSON.parse(JSON.stringify(result)) });
    });
});

app.get('/relouis', function (req, res) {
    let rel = new Promise(function (resolve, reject) {
        con.query(
            'SELECT * FROM goods WHERE name LIKE "%rel%" ',
            function (error, result) {
                if (error) throw (error);
                resolve(result);
            });
    })

    Promise.all([rel]).then(function (value) {

        res.render('relouis', {
            rel: JSON.parse(JSON.stringify(value[0]))
        });
    });
});


app.get('/estel', function (req, res) {
    let a_a = req.url;
    // console.log(a_a);
    let est = new Promise(function (resolve, reject) {
        con.query(
            'SELECT * FROM goods WHERE name LIKE "%' + a_a.slice(1) + '%" ',
            function (error, result) {
                if (error) throw (error);
                resolve(result);
            });
    })

    Promise.all([est]).then(function (value) {

        res.render('estel', {
            est: JSON.parse(JSON.stringify(value[0]))
        });
    });
});

app.get('/kapous', function (req, res) {
    let kap = new Promise(function (resolve, reject) {
        con.query(
            'SELECT * FROM goods WHERE name LIKE "%kapou%" ',
            function (error, result) {
                if (error) throw (error);
                resolve(result);
            });
    })

    Promise.all([kap]).then(function (value) {
        res.render('kapous', {
            kap: JSON.parse(JSON.stringify(value[0]))
        });
    });
});

app.get('/ollin', function (req, res) {
    let oll = new Promise(function (resolve, reject) {
        con.query(
            'SELECT * FROM goods WHERE name LIKE "%ollin%" ',
            function (error, result) {
                if (error) throw (error);
                resolve(result);
            });
    })

    Promise.all([oll]).then(function (value) {
        res.render('ollin', {
            oll: JSON.parse(JSON.stringify(value[0]))
        });
    });
});

app.get('/loreal', function (req, res) {
    let lor = new Promise(function (resolve, reject) {
        con.query(
            'SELECT * FROM goods WHERE name LIKE "%oreal%" ',
            function (error, result) {
                if (error) throw (error);
                resolve(result);
            });
    })

    Promise.all([lor]).then(function (value) {
        res.render('loreal', {
            lor: JSON.parse(JSON.stringify(value[0]))
        });
    });
});

app.get('/cd', function (req, res) {
    let cd = new Promise(function (resolve, reject) {
        con.query(
            'SELECT * FROM goods WHERE name LIKE "%consta%" ',
            function (error, result) {
                if (error) throw (error);
                resolve(result);
            });
    })

    Promise.all([cd]).then(function (value) {
        res.render('cd', {
            cd: JSON.parse(JSON.stringify(value[0]))
        });
    });
});

app.get('/belorus', function (req, res) {
    let belorus = new Promise(function (resolve, reject) {
        con.query(
            'SELECT * FROM goods WHERE slug LIKE "%bel%" ',
            function (error, result) {
                if (error) throw (error);
                resolve(result);
            });
    })

    Promise.all([belorus]).then(function (value) {
        res.render('belorus', {
            belorus: JSON.parse(JSON.stringify(value[0]))
        });
    });
});

app.get('/korea', function (req, res) {
    let kor = new Promise(function (resolve, reject) {
        con.query(
            'SELECT * FROM goods WHERE slug LIKE "%kor%" ',
            function (error, result) {
                if (error) throw (error);
                resolve(result);
            });
    })

    Promise.all([kor]).then(function (value) {
        res.render('korea', {
            kor: JSON.parse(JSON.stringify(value[0]))
        });
    });
});

app.get('/palmolive', function (req, res) {
    let pal = new Promise(function (resolve, reject) {
        con.query(
            'SELECT * FROM goods WHERE name LIKE "%palmol%" ',
            function (error, result) {
                if (error) throw (error);
                resolve(result);
            });
    })

    Promise.all([pal]).then(function (value) {
        res.render('palmolive', {
            pal: JSON.parse(JSON.stringify(value[0]))
        });
    });
});
app.get('/pantene', function (req, res) {
    let pan = new Promise(function (resolve, reject) {
        con.query(
            'SELECT * FROM goods WHERE name LIKE "%panten%" ',
            function (error, result) {
                if (error) throw (error);
                resolve(result);
            });
    })

    Promise.all([pan]).then(function (value) {
        res.render('pantene', {
            pan: JSON.parse(JSON.stringify(value[0]))
        });
    });
});
app.get('/pupa', function (req, res) {
    let pup = new Promise(function (resolve, reject) {
        con.query(
            'SELECT * FROM goods WHERE name LIKE "%pupa%" ',
            function (error, result) {
                if (error) throw (error);
                resolve(result);
            });
    })

    Promise.all([pup]).then(function (value) {
        res.render('pupa', {
            pup: JSON.parse(JSON.stringify(value[0]))
        });
    });
});
app.get('/schwarzkopf', function (req, res) {
    let sch = new Promise(function (resolve, reject) {
        con.query(
            'SELECT * FROM goods WHERE name LIKE "%schwar%" ',
            function (error, result) {
                if (error) throw (error);
                resolve(result);
            });
    })

    Promise.all([sch]).then(function (value) {
        res.render('schwarzkopf', {
            sch: JSON.parse(JSON.stringify(value[0]))
        });
    });
});
app.get('/syoss', function (req, res) {
    let syo = new Promise(function (resolve, reject) {
        con.query(
            'SELECT * FROM goods WHERE name LIKE "%syoss%" ',
            function (error, result) {
                if (error) throw (error);
                resolve(result);
            });
    })

    Promise.all([syo]).then(function (value) {
        res.render('syoss', {
            syo: JSON.parse(JSON.stringify(value[0]))
        });
    });
});
app.get('/vivienne_sabo', function (req, res) {
    let vivi = new Promise(function (resolve, reject) {
        con.query(
            'SELECT * FROM goods WHERE name LIKE "%vivienne%" ',
            function (error, result) {
                if (error) throw (error);
                resolve(result);
            });
    })

    Promise.all([vivi]).then(function (value) {

        res.render('vivienne_sabo', {
            vivi: JSON.parse(JSON.stringify(value[0]))
        });
    });
});
app.get('/wella', function (req, res) {
    let wel = new Promise(function (resolve, reject) {
        con.query(
            'SELECT * FROM goods WHERE name LIKE "%wella%" ',
            function (error, result) {
                if (error) throw (error);
                resolve(result);
            });
    })

    Promise.all([wel]).then(function (value) {

        res.render('wella', {
            wel: JSON.parse(JSON.stringify(value[0]))
        });
    });
});
app.get('/max_factor', function (req, res) {
    let maxF = new Promise(function (resolve, reject) {
        con.query(
            'SELECT * FROM goods WHERE name LIKE "%factor%" ',
            function (error, result) {
                if (error) throw (error);
                resolve(result);
            });
    })

    Promise.all([maxF]).then(function (value) {

        res.render('max_factor', {
            maxF: JSON.parse(JSON.stringify(value[0]))
        });
    });
});
app.get('/maybelline', function (req, res) {
    let may = new Promise(function (resolve, reject) {
        con.query(
            'SELECT * FROM goods WHERE name LIKE "%maybell%" ',
            function (error, result) {
                if (error) throw (error);
                resolve(result);
            });
    })

    Promise.all([may]).then(function (value) {

        res.render('maybelline', {
            may: JSON.parse(JSON.stringify(value[0]))
        });
    });
});
app.get('/garnier', function (req, res) {
    let gar = new Promise(function (resolve, reject) {
        con.query(
            'SELECT * FROM goods WHERE name LIKE "%garnier%" ',
            function (error, result) {
                if (error) throw (error);
                resolve(result);
            });
    })

    Promise.all([gar]).then(function (value) {

        res.render('garnier', {
            gar: JSON.parse(JSON.stringify(value[0]))
        });
    });
});
app.get('/lux_visage', function (req, res) {
    let lux = new Promise(function (resolve, reject) {
        con.query(
            'SELECT * FROM goods WHERE name LIKE "%visage%" ',
            function (error, result) {
                if (error) throw (error);
                resolve(result);
            });
    })

    Promise.all([lux]).then(function (value) {

        res.render('lux_visage', {
            lux: JSON.parse(JSON.stringify(value[0]))
        });
    });
});
app.get('/eveline', function (req, res) {
    let eveli = new Promise(function (resolve, reject) {
        con.query(
            'SELECT * FROM goods WHERE name LIKE "%evelin%" ',
            function (error, result) {
                if (error) throw (error);
                resolve(result);
            });
    })

    Promise.all([eveli]).then(function (value) {

        res.render('eveline', {
            eveli: JSON.parse(JSON.stringify(value[0]))
        });
    });
});

app.get('/order', function (req, res) {
    res.render('order');
});

app.post('/get-category-list', function (req, res) {
    //  console.log(req.body);
    con.query('SELECT id, category FROM category', function (error, result, fields) {
        if (error) throw error;
        // console.log(result)
        res.json(result);
    });
});

app.post('/get-goods-info', function (req, res) {
    // console.log(req.body.key);
    if (req.body.key.length != 0) {
        con.query('SELECT id, name, cost FROM goods WHERE id IN (' + req.body.key.join(',') + ')', function (error, result, fields) {
            if (error) throw error;
            // console.log(result);
            let goods = {};
            for (let i = 0; i < result.length; i++) {
                goods[result[i]['id']] = result[i];
            }
            res.json(goods);
        });
    }
    else {
        res.send('0');
    }
});

app.post('/finish-order', function (req, res) {
    // console.log(req.body);
    if (req.body.key.length != 0) {
        let key = Object.keys(req.body.key);
        con.query(
            'SELECT id,name,cost FROM goods WHERE id IN (' + key.join(',') + ')',
            function (error, result, fields) {
                if (error) throw error;
                // console.log(result);
                sendMail(req.body, result).catch(console.error);
                saveOrder(req.body, result);
                res.send('1');
            });
    }
    else {
        res.send('0');
    }
});

app.get('/admin', function (req, res) {
    res.render('admin', {});
});


app.get('/admin-goods', function (req, res) {
    con.query(`SELECT 
            goods.id as id, 
            goods.name as name,
            goods.cost as cost,
            goods.availability as availability
        FROM 
            goods 
        ORDER BY id ASC`, function (error, result, fields) {
        if (error) throw error;
        // console.log(result);
        res.render('admin-goods', { goods_admin: JSON.parse(JSON.stringify(result)) });
    });
});

app.get('/create', function(req, res) {
    res.render('create');
});

app.post('/create', function(req, res) {
    if(!req.body) return res.sendStatus(400);
    const slug = req.body.slug;
    const name = req.body.name;
    const description = req.body.description;
    const cost = req.body.cost;
    const category = req.body.category;
    const availability = req.body.availability;
    con.query(`INSERT INTO goods (slug, name, description, cost, category, availability) VALUES (?,?,?,?,?,?)`, [slug,name,description,cost,category,availability], function(error,result) {
        if(error) return console.log(error);
         res.redirect("/create");
    });
});

app.get('/edit/:id', function(req,res){
    const id = req.params.id
    con.query(`SELECT * FROM goods WHERE id=?`, [id], function(error,result){
        if(error) return console.log(error);
        res.render('edit', {
            edit: JSON.parse(JSON.stringify(result))
         });
    });
});

app.post('/edit', function(req,res){
   
    const id = req.body.id;
    const slug = req.body.slug;
    const name = req.body.name;
    const description = req.body.description;
    const cost = req.body.cost;
    const category = req.body.category;
    const availability = req.body.availability;
    con.query(`UPDATE goods SET slug=?, name=?, description=?, cost=?, category=?, availability=? WHERE id=?`,[slug,name,description,cost,category,availability,id], function(error,result) {
        if(error) throw error;
        res.redirect('admin-goods');
    });
});


app.get('/admin-order', function (req, res) {
    con.query(`SELECT 
            shop_order.id as id,
            shop_order.user_id as user_id,
            shop_order.goods_id as goods_id,
            shop_order.goods_cost as goods_cost,
            shop_order.goods_amount as goods_amount,
            shop_order.total as total,
            from_unixtime(date,"%Y-%m-%d %h:%m") as human_date,
            user_info.user_name as user,
            user_info.user_phone as phone,
            user_info.address as address
        FROM 
            shop_order 
        LEFT JOIN 
            user_info 
        ON shop_order.user_id = user_info.id ORDER BY id DESC`, function (error, result, fields) {
        if (error) throw error;
        // console.log(result);
        res.render('admin-order', { order: JSON.parse(JSON.stringify(result)) });
    });
});

//TODO  LOGIN FORM 
app.get('/login', function (req, res) {
    res.render('login', {});
});

app.post('/login', function (req, res) {
    // console.log('=============');
    // console.log(req.body);
    // console.log(req.body.login);
    // console.log(req.body.password);
    // console.log('=============');
    con.query(
        'SELECT * FROM user WHERE login="' + req.body.login + '" and password="' + req.body.password + '"',
        function (error, result) {
            if (error) reject(error);
            // console.log(result);
            // console.log(result.length);
            if (result.length == 0) {
                // console.log('error user not found');
                res.redirect('/login');
            }
            else {
                result = JSON.parse(JSON.stringify(result));
                let hash = makeHash(32);
                res.cookie('hash', hash);
                res.cookie('id', result[0]['id']);
                //* Запись Hash в БД */
                sql = "UPDATE user SET hash='" + hash + "' WHERE id=" + result[0]['id'];
                con.query(sql, function (error, resultQuery) {
                    if (error) throw error;
                    res.redirect('/admin');
                });
            };
        });
});





//TODO Функция отправки на почту
async function sendMail(data, result) {
    let res = '<h2>Заказ в интернет-магазине Cosmetichka31.ru</h2>';
    let total = 0;
    for (let i = 0; i < result.length; i++) {
        res += `<p>${result[i]['name']} - ${data.key[result[i]['id']]} - ${result[i]['cost'] * data.key[result[i]['id']]} Руб</p> `;
        total += result[i]['cost'] * data.key[result[i]['id']];
    }
    // console.log(res);
    res += `<hr>`;
    res += `Всего к оплате ${total} Руб`;
    res += `<hr>Телефон: ${data.phone}`;
    res += `<hr>Социальная сеть: ${data.social}`;
    res += `<hr>Имя: ${data.username}`;
    res += `<hr>Адрес: ${data.address}`;
    res += `<hr>Email: ${data.email}`;
    // let testAccount = await nodemailer.createTestAccount();
    let transporter = nodemailer.createTransport({
        host: 'smtp.yandex.ru',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'cosmetichka31@yandex.ru',//testAccount.user, // generated ethereal user
            pass: '539601bb'//testAccount.pass // generated ethereal password
        }
    });
    let mailOption = {
        from: '<cosmetichka31@yandex.ru>',
        to: 'apollo-bel@yandex.ru,' + data.email,
        subject: "Lite shop order",
        text: 'Hello world',
        html: res
    };

    let info = await transporter.sendMail(mailOption);
    // console.log("MessageSent: %s", info.messageId);
    // console.log("PreviewSent: %s", nodemailer.getTestMessageUrl(info));
    // console.log(data.email);
    return true;

    
}


function makeHash(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}



function saveOrder(data, result) {
    //TODO data -  информация о пользователе
    //TODO result - сведения о товаре (результат обработки запроса)
    let sql;
    sql = "INSERT INTO user_info (user_name, user_phone, user_email, address) VALUES ('" + data.username + "','" + data.phone + "','" + data.email + "','" + data.address + "')";
    con.query(sql, function (error, resultQuery) {
        if (error) throw error;
        // console.log('1 user info saved');
        // console.log(resultQuery);
        let userId = resultQuery.insertId;
        date = new Date() / 1000;
        for (let i = 0; i < result.length; i++) { //! ПЕРЕДЕЛАТЬ (ВВОД ТОВАРОВ В БД-МНОГО ЗАПРОСОВ к БД)
            sql = "INSERT INTO shop_order (date, user_id, goods_id, goods_cost, goods_amount, total) VALUES (" + date + "," + userId + "," + result[i]['id'] + "," + result[i]['cost'] + "," + data.key[result[i]['id']] + " , " + data.key[result[i]['id']] * result[i]['cost'] + ")";
            con.query(sql, function (error, resultQuery) {
                if (error) throw error;
                // console.log("1 goods saved");
            })

        }
    });
}







