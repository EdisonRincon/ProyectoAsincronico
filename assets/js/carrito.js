
//DOM
document.addEventListener("DOMContentLoaded",() =>{
    //Variables - base de datos
    const baseDeDatos=[
        {
            id:1,
            nombre: 'Carne fina, de alta calidad, seleccionada',
            precio: 18700,
            imagen: 'assets/img/Carne fina-libra.jpeg',
            categoria: "Carnes y Pescados"
        },
        {
            id:2,
            nombre: 'Pan, fresco',
            precio: 2500,
            imagen: 'assets/img/Pan de leche.jpeg',
            categoria: "Panadería y Pastelería"
        },
        {
            id:3,
            nombre: 'Whisky Johnnie Walker',
            precio: 108000,
            imagen: 'assets/img/Whisky Johnnie Walker.jpeg',
            categoria: "Bebidas y Licores"
        },
        {
            id:4,
            nombre: 'Huevos',
            precio: 18000,
            imagen: 'assets/img/Huevos AAA en panal.jpeg',
            categoria: "Lácteos y Huevos"
        },
        {
            id:5,
            nombre: 'Pan',
            precio: 2500,
            imagen: 'assets/img/Pan de leche.jpeg',
            categoria: "Lácteos y Huevos"
        },
        {
            id:6,
            nombre: 'Arroz',
            precio: 2200,
            imagen: 'assets/img/Arroz.jpeg',
            categoria: "Granos Básicos"
        }
    ];
    let carrito =[];
    const divisa ="$";
    const DOMitems = document.querySelector("#items");
    const DOMcarrito = document.querySelector("#carrito");
    const DOMtotal = document.querySelector("#total");
    const DOMbotonVaciar = document.querySelector("#boton-vaciar");
 
    
    //Sección de funciones
    /*Dibujamos todos los productos a partir de la base de datos*/
    function renderizarProductos(){
        baseDeDatos.forEach((info) =>{
            //Estructura
            //Crea un documento
            const miNodo = document.createElement("div");
            miNodo.classList.add("card", "col-sm-4");
            //body
            const miNodoCardBody = document.createElement("div");
            miNodoCardBody.classList.add("card-body");
            //titulo
            const miNodoTitle = document.createElement("h6");
            miNodoTitle.classList.add("card-title");
            miNodoTitle.textContent = info.nombre;
            //imagen
            const miNodoImagen = document.createElement("img");
            miNodoImagen.classList.add("img-fluid");
            miNodoImagen.setAttribute("src",info.imagen);
            //precio
            const miNodoPrecio = document.createElement("p");
            miNodoPrecio.classList.add("card-text");
            miNodoPrecio.textContent = `${divisa}${info.precio}`;
            // Boton
            const miNodoBoton = document.createElement('button');
            miNodoBoton.classList.add('btn', 'btn-primary');
            miNodoBoton.textContent = 'Agregar';
            miNodoBoton.setAttribute('marcador', info.id);
            miNodoBoton.addEventListener('click', anadirProductoAlCarrito);

            //insertamos
            miNodoCardBody.appendChild(miNodoImagen);
            miNodoCardBody.appendChild(miNodoTitle);
            miNodoCardBody.appendChild(miNodoPrecio);
            miNodoCardBody.appendChild(miNodoBoton);
            miNodo.appendChild(miNodoCardBody);
            DOMitems.appendChild(miNodo);
        });
    }
    //Obten el contador del almacenamiento local-Contador de visitas
    let visitas = localStorage.getItem("contadorVisitas");
    //contador
    if(!visitas){
        visitas =0;
    }
    //incrementa el contador
    visitas++;
    //Guardar el nuevo contador en el almacenamiento local
    localStorage.setItem("contadorVisitas", visitas);

    // Muestra el contador en la página
    document.getElementById('contador').textContent = visitas;

    //Dibujar todos los productos guardados en el carrito
    // Evento para añadir producto al carrito de la compra
    function anadirProductoAlCarrito(evento) {
        //Añadimos el Nodo a nuestro carrito
        carrito.push(evento.target.getAttribute("marcador"));
        // Actualizamos el carrito
        renderizarCarrito();
        handleCarritoValue(carrito.length)
    }
    //Mostrar cantidad de productos en el carrito
    function handleCarritoValue(value) {
    const carritoContainer = document.getElementById("carrito-value");
    carritoContainer.textContent =  `${value}`
    }
    // Mostrar productos guardados en el carrito
    function renderizarCarrito(){
        //Vaciamos todo el html.
        DOMcarrito.textContent = "";
        //Quitamos los duplicados
        const carritoSinDuplicados = [...new Set(carrito)];
        //Generamos los Nodos a partir del carrito
        carritoSinDuplicados.forEach((item) =>{
            //Obtenemos el item que necesitamos de la variable base de datos
            const miItem = baseDeDatos.filter((itemBaseDatos)=>{
                //Coincide las id? Sólo puede existir un caso
                return itemBaseDatos.id === parseInt(item);
            });
            //Cuenta el número que se repite el producto
            const numeroUnidadesItem = carrito.reduce((total, itemId) =>{
                //¡Coincide las id? Incremento el contador, en caso contrario no mantengo
                return itemId === item ? total += 1 : total;
            },0);
            //Creamos el nodo del item del carrito
            const miNodo = document.createElement('li');
            miNodo.classList.add('list-group-item', 'text-right', 'mx-2');
            miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - ${divisa}${miItem[0].precio}`;
            //Creamos el boton de borrar
            const miBoton = document.createElement("button");
            miBoton.classList.add("btn", "btn-danger", "mx-5");
            miBoton.textContent="x";
            miBoton.style.marginLeft = "1rem";
            miBoton.dataset.item = item;
            miBoton.addEventListener("click", borrarItemCarrito);
            //Mezclamos nodos
            miNodo.appendChild(miBoton);
            DOMcarrito.appendChild(miNodo);
        });
        DOMtotal.textContent = calcularTotal();
    }
    /**
    * Evento para borrar un elemento del carrito
    */
    function borrarItemCarrito(evento) {
        // Obtenemos el producto ID que hay en el boton pulsado
        const id = evento.target.dataset.item;
        // Borramos todos los productos
        carrito = carrito.filter((carritoId) => {
            return carritoId !== id;
        });
        renderizarCarrito();
        guardarCarritoEnLocalStorage();
        handleCarritoValue(carrito.length);
    }    
    //Calcular total
    function calcularTotal(){
        return carrito.reduce((total, item)=> {
            const miItem = baseDeDatos.filter((itemBaseDatos)=>{
                return itemBaseDatos.id === parseInt(item);
            });
            return total + miItem[0].precio;
        },0).toFixed(2);
    }
    //Vaciar carrito
    function vaciarCarrito(){
        carrito = [];
        renderizarCarrito();
        localStorage.clear();
    }

    function guardarCarritoEnLocalStorage() {
        miLocalStorage.setItem('carrito', JSON.stringify(carrito));
    }

    function cargarCarritoDeLocalStorage() {
        if (miLocalStorage.getItem('carrito') !== null) {
            carrito = JSON.parse(miLocalStorage.getItem('carrito'));
            handleCarritoValue(carrito.length);
        }
    }

    // Eventos
    DOMbotonVaciar.addEventListener('click', vaciarCarrito);
    filtroSelect.addEventListener('change', renderizarProductos);

    // Inicio
    cargarCarritoDeLocalStorage();
    renderizarProductos();
    renderizarCarrito();                  
});
                