const express = require('express');
const mysql = require('mysql');
const router = express.Router();

/**
 * Kullanıcı Giriş Kontrolü
 * 
 * @params
 * @return json
 */
router.post('/login', (req,res) => {
    const connection = getConnection();
    const loginQuery = "SELECT * FROM kullanicilar WHERE kullanici_adi = ? and sifre = ?";

    connection.query(loginQuery,[req.body.kullaniciAdi,req.body.sifre],(err,rows,fields) => {
        if(err) {
            console.log("MySql de bir hata oluştu");
            res.status(400).json({durumKodu: 400, mesaj:err.message});
        }
        if(rows.length==1)
            res.status(200).json({durumKodu: 200, mesaj:"Giriş başarılı", userId : rows[0].id, kurumAdi : rows[0].kurum_adi, role: rows[0].rol});
        else
            res.status(400).json({durumKodu: 400, mesaj:"Kullanıcı adı veya şifre hatalı"});
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