using AtikVar.Sınıf;
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
    [LoginControl]
    public class WasteController : Controller
    {
        // GET: Waste
        public async Task<ActionResult> Index()
        {
            if (Session["role"].ToString() == "2")
            {
                try
                {
                    string url = "http://localhost:3003/waste?kullaniciId=" + Session["userId"];
                    HttpClient client = new HttpClient();
                    var response = await client.GetAsync(url);
                    var responseString = await response.Content.ReadAsStringAsync();
                    var parsed = JObject.Parse(responseString);
                    if ((int)parsed["durumKodu"] == 200)
                    {
                        ViewBag.waste = parsed["rows"];
                    }
                    else
                        ViewBag.message = parsed["mesaj"].ToString();
                }
                catch (HttpRequestException e)
                {
                    Console.WriteLine(e.ToString());
                }
                return View();
            }
            else if(Session["role"].ToString()=="1")
            {
                try
                {
                    string url = "http://localhost:3003/allWaste";
                    HttpClient client = new HttpClient();
                    var response = await client.GetAsync(url);
                    var responseString = await response.Content.ReadAsStringAsync();
                    var parsed = JObject.Parse(responseString);
                    if ((int)parsed["durumKodu"] == 200)
                    {
                        ViewBag.waste = parsed["rows"];
                    }
                    else
                        ViewBag.message = parsed["mesaj"].ToString();
                }
                catch (HttpRequestException e)
                {
                    Console.WriteLine(e.ToString());
                }
                return View("AllWastes");
            }
            return View();
        }

        public async Task<ActionResult> Add()
        {
            try
            {
                HttpClient client = new HttpClient();
                var response = await client.GetAsync("http://localhost:3003/wasteType");
                var responseString = await response.Content.ReadAsStringAsync();
                var parsed = JObject.Parse(responseString);
                if ((int)parsed["durumKodu"] == 200)
                {
                    ViewBag.wasteTypes = parsed["rows"];
                }
                else
                    ViewBag.message = parsed["mesaj"].ToString();
            }
            catch (HttpRequestException e)
            {
                Console.WriteLine(e.ToString());
            }
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> Add(string atikTuru, string miktar, string miktarTip)
        {
            try
            {
                HttpClient client = new HttpClient();
                var values = new Dictionary<string, string>
                {
                    { "atikTuru", atikTuru.ToString() },
                    { "miktar", miktar.ToString()},
                    { "miktarTip", miktarTip },
                    { "kullaniciId", Session["userId"].ToString()}
                };
                var content = new FormUrlEncodedContent(values);
                var response = await client.PostAsync("http://localhost:3003/waste", content);
                var responseString = await response.Content.ReadAsStringAsync();
                var parsed = JObject.Parse(responseString);
                ViewBag.message = parsed["mesaj"].ToString();

                response = await client.GetAsync("http://localhost:3003/wasteType");
                responseString = await response.Content.ReadAsStringAsync();
                parsed = JObject.Parse(responseString);
                if ((int)parsed["durumKodu"] == 200)
                {
                    ViewBag.wasteTypes = parsed["rows"];
                }
                else
                    ViewBag.message = parsed["mesaj"].ToString();
            }
            catch (HttpException e)
            {
                Console.WriteLine(e.ToString());
            }

            return View();
        }
    }
}