// login.js
const user = document.querySelector('[data-user]');
const password = document.querySelector('[data-password]');
const btn = document.querySelector('[data-button]');
const apiResult = document.querySelector('[data-api]');

// Obtener información de un usuario por nombre de usuario
function getUserByUserName() {
    const userName = user.value;
    // Realizar una solicitud GET para obtener información del usuario
    fetch(`http://127.0.0.1:8000/users/${userName}`)
    .then(response => response.json())
    .then(data => {
        console.log('Información del usuario:', data);
        
        // Verificar si la información del usuario es correcta
        if (data && data.password === password.value) {
            // Almacenar el ID del usuario en el almacenamiento local
            localStorage.setItem('userId', data.id);

            // Redirigir a la siguiente sección o página
            window.location.href = '/pages/dashboard.html';
        } else {
            // Mostrar un mensaje de error si la información no es correcta
            apiResult.innerHTML = 'Nombre de usuario o contraseña incorrectos';
        }
    })
    .catch((error) => {
        console.error('Error al obtener información del usuario:', error);
    });
}

// Ejemplo de uso
btn.addEventListener('click', getUserByUserName);