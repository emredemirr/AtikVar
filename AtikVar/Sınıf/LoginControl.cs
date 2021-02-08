using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;


namespace AtikVar.Sınıf
{
    public class LoginControl:ActionFilterAttribute, IActionFilter
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (HttpContext.Current.Session["userId"] != null)
            {
                base.OnActionExecuting(filterContext);
            }
            else
                HttpContext.Current.Response.Redirect("/login");
        }
    }
}