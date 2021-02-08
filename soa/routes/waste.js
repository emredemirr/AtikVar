const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));

/**
 * Sistemdeki Atıkları kullanıcılara göre Json Formatında Listeler
 * 
 * @param 
 * @return json
 */
router.get('/waste', (req,res) => {
    const connection = getConnection();
    connection.query("SELECT * FROM atiklar a INNER JOIN atik_turleri t ON a.atik_turu=t.id where a.kullaniciId=? Order By a.id Desc",[req.query.kullaniciId],(err,rows,fields) => {
        if(err) {
            console.log("MySql de bir hata oluştu");
            res.status(400).json({durumKodu: 400, mesaj:err.message});
        }
        else
        {
            res.status(200).json({durumKodu: 200,rows});
        }
    });
});

/**
 * Sistemdeki Atıkları Json Formatında Listeler
 * 
 * @param 
 * @return json
 */
router.get('/allWaste', (req,res) => {
    const connection = getConnection();
    connection.query("SELECT * FROM atiklar a INNER JOIN atik_turleri t ON a.atik_turu=t.id INNER JOIN kullanicilar k ON k.id=a.kullaniciId Order By a.id Desc",(err,rows,fields) => {
        if(err) {
            console.log("MySql de bir hata oluştu");
            res.status(400).json({durumKodu: 400, mesaj:err.message});
        }
        else
        {
            res.status(200).json({durumKodu: 200,rows});
        }
    });
});

/**
 * İd belirtilen atığın bilgilerini döndürür.
 * 
 * @param var İd
 * @return json
 */
router.get('/waste/:id',(req,res) => {
    const connection = getConnection();
    const queryString = "SELECT * FROM users WHERE id = ?";
    const userId = req.params.id;

    connection.query(queryString,[userId],(err,rows,fields) => {
        if(err) {
            console.log("MySql de bir hata oluştu");
            res.sendStatus(500);
            res.end();
        }
        console.log("I think we fetched users successfuly");
        res.json(rows);
    });
});

/**
 * Atık Türlerini Döndürür
 * 
 * @params
 * @return json
 */
router.get('/wasteType', (req,res) => {
    const connection = getConnection();
    connection.query("SELECT * FROM atik_turleri",(err,rows,fields) => {
        if(err) {
            console.log("MySql de bir hata oluştu");
            res.status(400).json({durumKodu: 400, mesaj:err.message});
        }
        else{
            res.status(200).json({durumKodu: 200,rows});
        }
    }); 
});

/**
 * Yeni Atık Türü oluşturur
 * 
 * @params
 * @return json
 */
router.post('/wasteType', (req,res) => {
    const connection = getConnection();
    const isAdded = "SELECT * FROM kullanicilar WHERE kullanici_adi = ?";

    connection.query(isAdded,[req.body.kullaniciAdi],(err,rows,fields) => {
        if(err) {
            console.log("MySql de bir hata oluştu");
            res.status(400).json({durumKodu: 400, mesaj:err.message});
        }
        if(rows.length==1)
            res.status(400).json({durumKodu: 400, mesaj:"Böyle bir kullanıcı daha önce kayıt olmuş"});
        else{ 
            const queryString = "INSERT INTO kullanicilar (kurum_adi,kullanici_adi,sifre) VALUES (?,?,?)";
            connection.query(queryString,[
                req.body.kurumAdi,
                req.body.kullaniciAdi,
                req.body.sifre
            ], (err,rows,fields) => {
                if(err){
                    res.status(400).json({durumKodu: 400, mesaj:err.message});
                }
                const insertId = rows['insertId'];
                const queryString = "INSERT INTO kullanici_adres (kullaniciId,adresAdi,il,ilce,adres) VALUES (?,?,?,?,?)";
                connection.query(queryString,[
                    insertId,
                    req.body.adresAdi,
                    req.body.il,
                    req.body.ilce,
                    req.body.adres
                ], (err,rows,fields) => {
                    if(err)
                        res.status(400).json({durumKodu: 400, mesaj:err.message});
                });
                res.status(201).json({durumKodu:201, mesaj: "Kullanıcı başarıyla oluşturuldu, giriş yapabilirsiniz"});
            });
        }
    });
});

/**
 * Yeni Atık oluşturur
 * 
 * @params
 * @return json
 */
router.post('/waste', (req,res) => {
    const connection = getConnection();
    const queryString = "INSERT INTO atiklar (kullaniciId,atik_turu,miktar,miktar_tip) VALUES (?,?,?,?)";
    connection.query(queryString,[
        req.body.kullaniciId,
        req.body.atikTuru,
        req.body.miktar,
        req.body.miktarTip
    ], (err,rows,fields) => {
        if(err){
            res.status(400).json({durumKodu: 400, mesaj:err.message});
        }
        else
        {
            res.status(201).json({durumKodu:201, mesaj: "✔ " +     req.body.miktar + " " + req.body.miktarTip + " atık başarıyla eklendi, ilgili yer tarafından geri dönüşümü sağlanacaktır."});
        }
    });
});

/**
 * Mysql bağlantısını gerçekleştirir.
 * 
 * @param
 * @return void
 */
function getConnection() {
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'atikvar',
    });
}

module.exports = router; 