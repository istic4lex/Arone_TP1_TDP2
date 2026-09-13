document.addEventListener('DOMContentLoaded', () => {
    
    const formulario = document.getElementById('conceptoForm');
    const listaConceptos = document.getElementById('listaConceptos');
    const btnBorrarTodo = document.getElementById('btnBorrarTodo'); 

    cargarConceptos();

    async function cargarConceptos() {
        try {
            const respuesta = await fetch('/api/conceptos');
            const conceptos = await respuesta.json();
            renderizarConceptos(conceptos);
        } catch (error) {
            console.error('Error al cargar conceptos:', error);
        }
    }


    function renderizarConceptos(conceptos) {
        listaConceptos.innerHTML = ''; 

        if (conceptos.length === 0) {
            listaConceptos.innerHTML = '<p class="mensaje-vacio">No hay conceptos cargados.</p>';
            return;
        }

        conceptos.forEach(concepto => {
          
            const tarjeta = document.createElement('div');
            tarjeta.className = 'tarjeta-concepto';
            
            
            tarjeta.innerHTML = `
                <h3>${concepto.nombre}</h3>
                <p>${concepto.desarrollo}</p>
                <button class="btn-eliminar" onclick="eliminarConcepto(${concepto.id})">Eliminar</button>
            `;
            
           
            listaConceptos.appendChild(tarjeta);
        });
    }


    formulario.addEventListener('submit', async (e) => {
        e.preventDefault(); 

        const nombre = document.getElementById('nombre').value;
        const desarrollo = document.getElementById('desarrollo').value;

        const data = { nombre, desarrollo };

        try {
            const respuesta = await fetch('/api/conceptos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (respuesta.ok) {
                formulario.reset(); 
                cargarConceptos();  
            }
        } catch (error) {
            console.error('Error al agregar concepto:', error);
        }
    });


    window.eliminarConcepto = async (id) => {
        try {
            const respuesta = await fetch(`/api/conceptos/${id}`, {
                method: 'DELETE'
            });

            if (respuesta.ok) {
                cargarConceptos(); 
            }
        } catch (error) {
            console.error('Error al eliminar concepto:', error);
        }
    };


    if (btnBorrarTodo) {
        btnBorrarTodo.addEventListener('click', async () => {
            if (confirm('¿Estás seguro de borrar todos los conceptos?')) {
                try {
                    const respuesta = await fetch('/api/conceptos', {
                        method: 'DELETE'
                    });

                    if (respuesta.ok) {
                        cargarConceptos(); 
                    }
                } catch (error) {
                    console.error('Error al borrar todo:', error);
                }
            }
        });
    }
});