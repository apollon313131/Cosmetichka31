
$("nav div").click(function() {
    $(".ul_top").slideToggle();
    $("ul ul").css("display", "none");
    });
    $('ul li').click(function() {
    $('ul ul').slideUp();
    $(this).find('ul').slideToggle();
    });
    $(window).resize(function(){
    if($(window).width() > 768) {
    $('.ul_top').removeAttr('style')
    }
    });

    $('.button-text ').click(function() {
        $(".ul_top ").css("display", "none");
      });
      $('.close ').click(function() {
        $(".ul_top ").css("display", "flex");
      });


      
    let currentUrl = window.location.href;
// document.querySelector('.close-nav').onclick = closeNav;
// document.querySelector('.show-nav').onclick = showNav;

// function closeNav(){
//     document.querySelector('.site-nav').style.left = '-300px';
//     document.querySelector('.main').style.left = '0';
// }
// function showNav(){
//     document.querySelector('.site-nav').style.left = '0';
//     document.querySelector('.main').style.left = '300px';
// }

function getCategoryList(){
    fetch('/get-category-list',
        {
            method: 'POST'
        }
    ).then(function(response){
        return response.text();
        }
    ).then(function(body){
        showCategoryList(JSON.parse(body));
    })
}

function showCategoryList(data){
    // console.log(data);
    let out = '<ul class = "category-list"><li><a href="/">Main</a></li>';
    for (let i = 0; i < data.length; i++) {
        out += `<li><a href="/cat?id=${data[i]['id']}">${data[i]['category']}</a></li>`;
    }
    out += '</ul>';
    document.querySelector('#category-list').innerHTML = out;

}

getCategoryList();

let main = document.querySelector('.content_container');
let closeMenu = event => {
    // console.log(event.target);
    let target = event.target;
    if (target.contains(closeNav())) {
        console.log(1);
    }
};


main.addEventListener('click', closeMenu);


  