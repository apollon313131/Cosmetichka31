function deleteLocalStorageCart(){
    setTimeout(function() {
        // location.reload();
        document.getElementById("h4_order").innerHTML = 'Ваш заказ отправлен нашему менеджеру, скоро с вами свяжутся! Спасибо за покупку в нашем интернет-магазине.';
        var css_modern = document.querySelector(".order_info");
        css_modern.classList.toggle("order_info");
        css_modern.classList.toggle("order_info_active");
      }, 1000);
}


document.querySelector('#lite-shop-order').onsubmit = function(event){
    event.preventDefault();
    let username = document.querySelector('#username').value.trim();
    let phone = document.querySelector('#phone').value.trim();
    let social = document.querySelector('#social').value.trim();
    let email = document.querySelector('#email').value.trim();
    let address = document.querySelector('#address').value.trim();

    if (!document.querySelector('#rule').checked){
        //! с правилами не согласен
        Swal.fire({
            title : 'Внимание',
            text : 'Необходимо принять правила',
            type: 'info',
            confirmButtonText: 'Ok'
        });
        return false;
    }

    if (username == '' || phone == '' || social == '' || address == '') {
        //! не заполнены поля
        Swal.fire({
            title : 'Внимание',
            text : 'Заполните все поля',
            type: 'info',
            confirmButtonText: 'Ok'
        });
        return false;

    }

    fetch('/finish-order', {
        method: 'POST',
        body: JSON.stringify({
            'username' : username,
            'phone' : phone,
            'social' : social,
            'email' : email,
            'address' : address,
            'key' : JSON.parse(localStorage.getItem('cart'))
        }),
        headers: {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
        }
    })
        .then(function(response){
            return response.text();
        })
        .then(function(body){
            if (body == 1) {
                
                Swal.fire({
                    title : 'Заказ успешно отправлен!!!',
                    text : 'Ожидайте, скоро с вами свяжется наш менеджер',
                    type: 'info',
                    confirmButtonText: 'Ok'
                    
                });
                localStorage.clear();
                deleteLocalStorageCart();
                return false;
            }
            else {
                Swal.fire({
                    title : 'Проблема с отправкой формы(email)',
                    text : 'Error-свяжитесь с менеджером',
                    type: 'error',
                    confirmButtonText: 'Ok'
                });
                return false;
            }
        })
}


