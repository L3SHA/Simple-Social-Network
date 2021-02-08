exports.posts = function(request, response){
    if(request.cookies.email){
        response.render("posts.hbs");
    }else{
        response.redirect("/accounts/signin");
    }
}