// PROYECTO: MATERIALES EL VILLAR
// Cambia aquí los números cuando los encargados de ventas lo autoricen.
// No es necesaria una base de datos: se prepara una consulta por WhatsApp.
const proveedores = {
  'Ladrillos': { empresa: 'INCERPAZ', celular: '70818065' },
  'Cemento': { empresa: 'FANCESA', celular: '70878527' },
  'Fierros': { empresa: 'Las Lomas', celular: '68680813' },
  'Cerámicas': { empresa: 'Cerámica COBOCE', celular: '61902530' },
  'Tuberías': { empresa: 'Providencia', celular: '70357931' },
  'Calaminas': { empresa: 'Proveedor por confirmar', celular: '' }
};

const material = document.getElementById('material');
const nombreEmpresa = document.getElementById('nombreEmpresa');
const numeroEmpresa = document.getElementById('numeroEmpresa');
const proveedorCaja = document.getElementById('proveedor');
const aviso = document.getElementById('mensajeEstado');
const boton = document.getElementById('enviar');

function actualizarProveedor() {
  const elegido = proveedores[material.value];
  aviso.textContent = '';
  document.querySelectorAll('.producto').forEach(function(tarjeta) {
    tarjeta.classList.toggle('activo', tarjeta.dataset.material === material.value);
  });
  if (!elegido) {
    nombreEmpresa.textContent = 'Selecciona un material';
    numeroEmpresa.textContent = 'Aquí aparecerá su WhatsApp';
    proveedorCaja.classList.add('proveedor-vacio');
    boton.disabled = false;
    return;
  }
  nombreEmpresa.textContent = elegido.empresa;
  numeroEmpresa.textContent = elegido.celular ? 'WhatsApp: +591 ' + elegido.celular : 'Aún no contamos con un número de ventas';
  proveedorCaja.classList.toggle('proveedor-vacio', !elegido.celular);
  boton.disabled = !elegido.celular;
  if (!elegido.celular) aviso.textContent = 'Estamos buscando un proveedor de calaminas. Por el momento no es posible enviar esta consulta.';
}

function elegirMaterial(nombre) {
  material.value = nombre;
  actualizarProveedor();
  document.getElementById('consulta').scrollIntoView({ behavior: 'smooth' });
}

document.querySelectorAll('.producto').forEach(function(tarjeta) {
  tarjeta.addEventListener('click', function() {
    elegirMaterial(tarjeta.dataset.material);
  });
});
material.addEventListener('change', actualizarProveedor);

document.getElementById('buscador').addEventListener('input', function() {
  const busqueda = this.value.toLowerCase().trim();
  let visibles = 0;
  document.querySelectorAll('.producto').forEach(function(tarjeta) {
    const coincide = tarjeta.textContent.toLowerCase().includes(busqueda);
    tarjeta.hidden = !coincide;
    if (coincide) visibles++;
  });
  document.getElementById('sinResultados').hidden = visibles !== 0;
});

document.getElementById('formulario').addEventListener('submit', function(evento) {
  evento.preventDefault();
  const elegido = proveedores[material.value];
  if (!elegido || !elegido.celular) {
    aviso.textContent = 'Este material todavía no tiene un encargado de ventas configurado.';
    return;
  }
  const nombre = document.getElementById('nombre').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const cantidad = document.getElementById('cantidad').value;
  const detalle = document.getElementById('detalle').value.trim();
  const entrega = document.getElementById('entrega').value.trim();
  const observaciones = document.getElementById('observaciones').value.trim();
  if (!/^[67]\d{7}$/.test(telefono.replace(/\s|-/g, ''))) {
    aviso.textContent = 'Ingresa un celular boliviano válido de 8 dígitos.';
    return;
  }
  const mensaje = 'Hola, equipo de ' + elegido.empresa + '. Quisiera solicitar una cotización.\n\n' +
    'Cliente: ' + nombre + '\n' +
    'Celular: ' + telefono + '\n' +
    'Material: ' + material.value + '\n' +
    'Cantidad aproximada: ' + cantidad + '\n' +
    (detalle ? 'Tipo o medida: ' + detalle + '\n' : '') +
    'Lugar de entrega: ' + (entrega || 'El Villar, Chuquisaca') + '\n' +
    (observaciones ? 'Observaciones: ' + observaciones + '\n' : '') +
    '\n¿Podrían indicarme el precio, la disponibilidad y si realizan entregas hasta El Villar? ¿Cuál sería el costo de transporte? Muchas gracias.';
  aviso.textContent = 'Tu consulta está preparada. Confirma el envío cuando se abra WhatsApp.';
  const enlace = 'https://wa.me/591' + elegido.celular + '?text=' + encodeURIComponent(mensaje);
  // window.location.href funciona de forma sencilla incluso si el navegador bloquea ventanas emergentes.
  window.location.href = enlace;
});

actualizarProveedor();
