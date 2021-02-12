exports.posts = function(request, response){
    if(request.cookies.email){
        response.render("home.hbs");
    }else{
        response.redirect("/accounts/signin");
    }
}