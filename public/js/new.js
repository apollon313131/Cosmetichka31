
window.onload = function () {
    let p = document.querySelector('.text_nal').textContent;
    let resetcolorP = document.querySelector('.text_nal');
    let pp = document.querySelector('.add-to-cart');
    let result = p == 0 ? 'Нет в наличии' : 'Есть в наличии';
    document.querySelector('.text_nal').innerHTML = result;
    if (p == 0) {
        pp.style.display = 'none';

    }
    else {
        resetcolorP.style.color = 'green';
    }
    console.log(pp);

};
// Smooth Scroll on clicking nav items
$('nav a').click(function () {
    var $href = $(this).attr('href');
    $('body').stop().animate({
      scrollTop: $($href).offset().top
    }, 1000);
    return false;
  });
  
  // back to top
  $('#toTop a').click(function () {
    $('body').animate({
      scrollTop: 0
    }, 1000);
    return false;
  });
  