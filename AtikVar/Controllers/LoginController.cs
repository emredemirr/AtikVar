using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace AtikVar.Controllers
{
    public class LoginController : Controller
    {
        // GET: Login
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> Index(string kullaniciAdi, string sifre)
        {
            HttpClient client = new HttpClient();
            var values = new Dictionary<string, string>
            {
                { "kullaniciAdi", kullaniciAdi },
                { "sifre", sifre },
            };
            var content = new FormUrlEncodedContent(values);
            var response = await client.PostAsync("http://localhost:3003/login", content);
            var responseString = await response.Content.ReadAsStringAsync();
            var parsed = JObject.Parse(responseString);
            if ((int)parsed["durumKodu"] == 200)
            {
                Session["userId"] = (int) parsed["userId"];
                Session["userName"] = parsed["kurumAdi"];
                Session["role"] = parsed["role"];
                return Redirect("/");
            }
            else
                ViewBag.message = parsed["mesaj"].ToString();
            return View();
        }

        public ActionResult Logout()
        {
            Session.Clear();
            return Redirect("/");
        }
    }
}