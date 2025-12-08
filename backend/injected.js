// =======================================================
// CONFIGURACIÓN CLAVE: CAMBIA ESTA URL
// =======================================================
// Si el backend está en tu máquina (para pruebas locales):
const URL_BACKEND = 'http://localhost:3000'; 

// Si el backend está desplegado públicamente (para producción):
// const URL_BACKEND = 'https://api.tudominio.com'; 

// Asegúrate de que la librería Socket.io Client esté cargada
// antes de que se ejecute este script (ej. <script src="/socket.io/socket.io.js"></script>)
if (typeof io === 'undefined') {
    console.error('Socket.io client library is missing. Cannot initialize connection.');
} else {
    iniciarConexionBackend();
}
// =======================================================


function obtenerElementoEstado() {
    // Busca el elemento en el DOM que muestra el estado del backend.
    // NECESITAS REEMPLAZAR 'backend-status' con el ID o selector real de tu elemento.
    // (En tu caso, es probable que esté cerca del botón rojo "Backend Desconectado").
    return document.getElementById('backend-status'); 
}


function actualizarEstadoVisual(estado) {
    const elemento = obtenerElementoEstado();
    const mensaje = estado === 'conectado' ? 'Backend Conectado' : 'Backend Desconectado';
    
    if (elemento) {
        elemento.textContent = mensaje;
        elemento.style.backgroundColor = estado === 'conectado' ? '#4CAF50' : '#FF5733'; // Verde o Rojo
    }
    console.log(`[DogeNode] Estado del Backend: ${mensaje}`);
}


function iniciarConexionBackend() {
    try {
        // 1. INTENTO DE CONEXIÓN
        const socket = io(URL_BACKEND, {
            // Se puede agregar un timeout si es necesario
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });

        // 2. MANEJO DE EVENTOS DE CONEXIÓN
        
        // El socket se conecta con éxito
        socket.on('connect', () => {
            console.log(`✅ Socket.io conectado al backend en: ${URL_BACKEND}`);
            actualizarEstadoVisual('conectado');
            
            // Puedes emitir un evento de inicio al backend aquí, si es necesario
            // socket.emit('clientReady', { userId: 'guest' });
        });

        // El socket se desconecta (por error del servidor, red, o timeout)
        socket.on('disconnect', (reason) => {
            console.warn(`❌ Socket.io desconectado. Razón: ${reason}`);
            actualizarEstadoVisual('desconectado');
        });

        // Manejo de errores de conexión (ej. CORS, rechazo del servidor)
        socket.on('connect_error', (error) => {
            console.error(`🛑 Error de conexión al backend:`, error);
            console.warn(`Verifica la URL (${URL_BACKEND}) y la configuración CORS en server.js.`);
            actualizarEstadoVisual('desconectado');
        });
        
        // 3. RECIBIR DATOS DEL BACKEND (Ejemplo)
        socket.on('blockchainUpdate', (data) => {
            console.log('Recibida actualización del blockchain:', data);
            // Lógica para actualizar la interfaz con los datos recibidos
        });
        
    } catch (e) {
        console.error('Error fatal al intentar inicializar Socket.io:', e);
        actualizarEstadoVisual('desconectado');
    }
}
