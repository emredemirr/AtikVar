using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json.Linq;

namespace AtikVar.Controllers
{
    public class RegisterController : Controller
    {
        // GET: Register
        public ActionResult Index()
        {
            if (Session["userId"] != null)
                return Redirect("Home");
            return View();
        }

        // POST: Register
        [HttpPost]
        public async Task<ActionResult> Index(string kurumAdi, string kullaniciAdi, string sifre, string adresAdi, string il, string ilce, string adres)
        {
            HttpClient client = new HttpClient();
            var values = new Dictionary<string, string>
            {
                { "kurumAdi", kurumAdi },
                { "kullaniciAdi", kullaniciAdi },
                { "sifre", sifre },
                { "adresAdi", adresAdi },
                { "il", il },
                { "ilce", ilce },
                { "adres", adres },
            };
            var content = new FormUrlEncodedContent(values);
            var response = await client.PostAsync("http://localhost:3003/user", content);
            var responseString = await response.Content.ReadAsStringAsync();
            var parsed = JObject.Parse(responseString);
            ViewBag.message = parsed["mesaj"].ToString();
            return View();
        }
    }
}