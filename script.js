
let facturas = JSON.parse(localStorage.getItem('facturas')) || [];


function agregarArticulo(articulo = {}) {
    const tbody = document.querySelector('#tablaArticulos tbody');
    const tr = document.createElement('tr');

    tr.innerHTML = `
        <td><input type="text" value="${articulo.codigo || ''}"></td>
        <td><input type="text" value="${articulo.nombre || ''}"></td>
        <td><input type="number"  step="0.01" value="${articulo.precio || ''}" oninput="calcularTotal()"></td>
        <td><input type="number" value="${articulo.cantidad || ''}" oninput="calcularTotal()"></td>
        <td class="subtotal">${articulo.subtotal || '0.00'}</td>
        <td><button onclick="eliminarArticulo(this)" class="btn btn-danger btn-sm no-print"><i class="bi bi-trash"></i> Eliminar</button></td>
    `;

    tbody.appendChild(tr);
    calcularTotal();


}

function calcularTotal() {
    let total = 0;

    document.querySelectorAll('#tablaArticulos tbody tr').forEach(tr => {
        const precio = parseFloat(tr.children[2].querySelector('input').value) || 0;
        const cantidad = parseFloat(tr.children[3].querySelector('input').value) || 0;
        const subtotal = precio * cantidad;

        tr.children[4].textContent = subtotal.toFixed(2);
        total += subtotal;
    }   
    );

    document.querySelector('#totalFactura').textContent = total.toFixed(2);
}

function guardarFactura() {
    const cliente = document.querySelector('#cliente').value;
    const fecha = document.querySelector('#fecha').value;
    const filas = document.querySelectorAll('#tablaArticulos tbody tr');

    document.getElementById('error').innerHTML = '';

    if (!cliente || !fecha || filas.length === 0) {
        document.getElementById('error').innerHTML = 'Por favor complete todos los campos y agregue al menos un artículo.';
        return;
    }

    const articulos = [];
    let valido = true;

    filas.forEach(tr => {
        const codigo = tr.children[0].querySelector('input').value;
        const nombre = tr.children[1].querySelector('input').value;
        const precio = parseFloat(tr.children[2].querySelector('input').value) || 0;
        const cantidad = parseFloat(tr.children[3].querySelector('input').value) || 0;

        if (!codigo || !nombre || precio <= 0 || cantidad <= 0) {
            valido = false;
        }

        articulos.push({ codigo, nombre, precio, cantidad, subtotal: precio * cantidad });
    });

    if (!valido) {
        document.getElementById('error').innerHTML = 'Por favor, rellene todos los campos y agregue al menos un artículo.';
        return;
    }
    const numero = `F-${String(facturas.length + 1).padStart(4, '0')}`;
    const total = parseFloat(document.querySelector('#totalFactura').textContent);
    
    const factura = { numero, cliente, fecha, articulos, total };
    facturas.push(factura);
    localStorage.setItem('facturas', JSON.stringify(facturas));

    limpiarFormulario();
    cargarHistorial();
}

function cargarHistorial() {
    const tbody = document.querySelector('#tablaHistorial tbody');
    tbody.innerHTML = '';

    facturas.forEach((factura, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
       <td>${factura.numero}</td>
         <td>${factura.cliente}</td>
         <td>${factura.fecha}</td>
         <td>${factura.total.toFixed(2)}</td>
         <td><button onclick="verFactura(${index})" class="btn btn-primary"><i class="bi bi-eye"></i> Ver</button></td>
         <td><button onclick="eliminarFactura(${index})" class="btn btn-danger"><i class="bi bi-trash"></i> Eliminar</button></td>
       `;

        tbody.appendChild(tr);
    });
}


    function verFactura(index) {
        const factura = facturas[index];
        document.querySelector('#cliente').value = factura.cliente;
        document.querySelector('#fecha').value = factura.fecha;

        const tbody = document.querySelector('#tablaArticulos tbody');
        tbody.innerHTML = '';

        factura.articulos.forEach(a => agregarArticulo(a));
        calcularTotal();
}

    function limpiarFormulario() {
        document.querySelector('#cliente').value = '';
        document.querySelector('#fecha').value = '';
        document.querySelector('#tablaArticulos tbody ').innerHTML = '';

        calcularTotal();
}

    function mostrarError(mensaje) {
        document.querySelector('#error').innerHTML = mensaje;
}

   



function eliminarArticulo(boton) {
    const fila = boton.parentElement.parentElement;
    fila.remove();
    calcularTotal();
}

function imprimir() {
    const imprimir = document.querySelector('#imprimir');
    imprimir.style.display = 'none';
    imprimir.innerHTML = '<i class="bi bi-check-circle"></i> Imprimiendo...';

    window.print();

    imprimir.style.display = 'block';
    imprimir.innerHTML = '<i class="bi bi-printer"></i> Imprimir';

}

function eliminarFactura(index) {
    const confirmar = confirm('¿Está seguro de eliminar esta factura?');

    if (!confirmar) return;

    facturas.splice(index, 1); // elimina 1 elemento
    localStorage.setItem('facturas', JSON.stringify(facturas));

    cargarHistorial();
}



 cargarHistorial();