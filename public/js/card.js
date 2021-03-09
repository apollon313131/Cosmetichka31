let cart = {};
document.querySelectorAll('.add-to-cart').forEach(function(element){
    element.onclick = addToCart;
});

if (localStorage.getItem('cart')){
    cart = JSON.parse(localStorage.getItem('cart'));
    ajaxGetGoodsInfo(); 
}

function addToCart(){
    let goodId = this.dataset.goods_id;  //! Получаем id
    if (cart[goodId]) {
        cart[goodId]++
    }
    else {
        cart[goodId] = 1; 
    }
    // console.log(cart);
    ajaxGetGoodsInfo();
}

function ajaxGetGoodsInfo(){
    updateLocalStorageCart();
    
    fetch('/get-goods-info',{
        method: 'POST',
        body: JSON.stringify({key: Object.keys(cart)}),
        headers: {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
        }
        
    })
    
    .then(function(response){
        return response.text();
        
    })

    .then(function(body){
        // console.log(body);
        showCart(JSON.parse(body));
        showCartTitle(JSON.parse(body));
        showCartPreview(JSON.parse(body));
      
    })
}

function showCart(data) {
    let out = '<table class="table table_order_m table-striped table-cart"><tbody>';
    let total = 0;
    for (let key in cart) {
        out +=`<tr class=top_tr><td colspan=4 class=tr_table><a href="/goods?id=${key}">${data[key]['name']}  ( ${formatPrice(data[key]['cost'])} Руб)</a></tr>`;
        out +=`<tr class=bot_tr><td><i class='far fa-minus-square cart-minus' data-goods_id='${key}'></i></td>`;
        out +=`<td>${cart[key]} шт</td>`;
        out +=`<td><i class='far fa-plus-square cart-plus' data-goods_id='${key}'></i></td>`;
        out +=`<td>${formatPrice(data[key]['cost']*cart[key])} &#8381 </td>`;
        out +=`</tr>`;
        total += cart[key]*data[key]['cost'];
    } 
    out += `<tr><td colspan = '3'>Итого: </td><td>${formatPrice(total)} &#8381</td></tr>`;
    out += '</tbody></table>';
    document.querySelector('#cart-nav').innerHTML = out;
    document.querySelectorAll('.cart-minus').forEach(function(element){
        element.onclick = cartMinus;
    });
    document.querySelectorAll('.cart-plus').forEach(function(element){
        element.onclick = cartPlus;
    });
  
}

function showCartPreview(data) {
    let out = '<table class="table table-striped table-cart"><tbody>';
    let total = 0;
    for (let key in cart) {
        out +=`<tr class=top_tr><td colspan=4 class=tr_table_pre><a href="/goods?id=${key}">${data[key]['name']}  ( ${formatPrice(data[key]['cost'])} Руб)</a></tr>`;
        out +=`<tr class=bot_tr><td><i class='far fa-minus-square cart-minus' data-goods_id='${key}'></i></td>`;
        out +=`<td>${cart[key]} шт</td>`;
        out +=`<td><i class='far fa-plus-square cart-plus' data-goods_id='${key}'></i></td>`;
        out +=`<td>${formatPrice(data[key]['cost']*cart[key])} &#8381 </td>`;
        out +=`</tr>`;
        total += cart[key]*data[key]['cost'];
    } 
    out += `<tr class=td_total><td colspan = '3' >Итого: </td><td>${formatPrice(total)} &#8381 </td></tr>`;
    out += '</tbody></table>';
    document.querySelector('#cart-nav-preview').innerHTML = out;
    document.querySelectorAll('.cart-minus').forEach(function(element){
        element.onclick = cartMinus;
    });
    document.querySelectorAll('.cart-plus').forEach(function(element){
        element.onclick = cartPlus;
    });
  
}



function showCartTitle(data) {
    let out = '';
    let total = 0;
    for (let key in cart) {
        total += cart[key]*data[key]['cost'];
    } 
    out += `Корзина: ${formatPrice(total)} Руб`;
    document.querySelector('#cart-nav-title').innerHTML = out;
}







function cartPlus() {
    let goodsId = this.dataset.goods_id;
    cart[goodsId]++;
    ajaxGetGoodsInfo();
}

function cartMinus() {
    let goodsId = this.dataset.goods_id;
    if (cart[goodsId] -1 > 0) {
        cart[goodsId]--;
    }
    else {
        delete(cart[goodsId]);
    }
    ajaxGetGoodsInfo();
    
}

function updateLocalStorageCart(){
    localStorage.setItem('cart', JSON.stringify(cart));
    
}







function formatPrice(price){
    return price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$& ');
}



var anchors = document.querySelectorAll('button.scroll-to')
for (let anchor of anchors) {
  anchor.addEventListener('click', function (e) {
    e.preventDefault()
    const blockID = anchor.getAttribute('href')
    document.querySelector(blockID).scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  })
}



let isMobile = {
	Android: function() {return navigator.userAgent.match(/Android/i);},
	BlackBerry: function() {return navigator.userAgent.match(/BlackBerry/i);},
	iOS: function() {return navigator.userAgent.match(/iPhone|iPad|iPod/i);},
	Opera: function() {return navigator.userAgent.match(/Opera Mini/i);},
	Windows: function() {return navigator.userAgent.match(/IEMobile/i);},
	any: function() {return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());}
};
		let body=document.querySelector('body');
if(isMobile.any()){
		body.classList.add('touch');
		let arrow=document.querySelectorAll('.arrow');
	for(i=0; i<arrow.length; i++){
			let thisLink=arrow[i].previousElementSibling;
			let subMenu=arrow[i].nextElementSibling;
			let thisArrow=arrow[i];

			thisLink.classList.add('parent');
		arrow[i].addEventListener('click', function(){
			subMenu.classList.toggle('open');
			thisArrow.classList.toggle('active');
		});
	}
}else{
	body.classList.add('mouse');
}




