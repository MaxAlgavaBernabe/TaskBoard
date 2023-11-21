// profile.js
const userId = localStorage.getItem('userId');
const userNameInput = document.querySelector('[data-user]');
const mailInput = document.querySelector('[data-mail]');
const passwordInput = document.querySelector('[data-password]');
const saveButton = document.querySelector('[data-button]');
const apiResult = document.querySelector('[data-api]');

// Obtener información del usuario por ID
function getUserById() {
    // Realizar una solicitud GET para obtener información del usuario
    fetch(`http://127.0.0.1:8000/users/byId/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error API: ${response.status} - ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            

            // Llenar los campos de entrada con la información del usuario
            userNameInput.value = data.user_name;
            mailInput.value = data.mail;
            passwordInput.value = data.password;
        })
        .catch((error) => {
            
        });
}

// Actualizar la información del usuario al hacer clic en el botón Guardar
function updateUser() {
    const updatedUserData = {
        user_name: userNameInput.value,
        mail: mailInput.value,
        password: passwordInput.value,
    };

    // Realizar una solicitud PUT para actualizar la información del usuario
    fetch(`http://127.0.0.1:8000/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUserData),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error API: ${response.status} - ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            
            apiResult.innerHTML = 'User information successfully updated';
        })
        .catch((error) => {
            
            apiResult.innerHTML = 'Error updating user information.';
        });
}

// Cargar la información del usuario al cargar la página
document.addEventListener('DOMContentLoaded', getUserById);

// Asociar la función de actualización al evento clic del botón Guardar
saveButton.addEventListener('click', updateUser);
