const user = document.querySelector('[data-user]');
const mail = document.querySelector('[data-mail]');
const password = document.querySelector('[data-password]');
const signUpButton = document.querySelector('[data-button]');
const apiResult = document.querySelector('[data-api]');

function signUpUser() {
    const newUser = {
        user_name: user.value,
        mail: mail.value,
        password: password.value,
    };

    // Verificar si el usuario ya existe
    fetch(`http://127.0.0.1:8000/users/exists/${newUser.user_name}`)
        .then(response => {
            if (!response.ok) {
                // Si el usuario no existe, procede con el registro
                return fetch('http://127.0.0.1:8000/users/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newUser),
                });
            } else {
                // Si el usuario ya existe, muestra un mensaje
                throw new Error('User already exists. Please choose another username.');
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error de la API: ${response.status} - ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            // Registro exitoso, almacena el userId y redirige al dashboard
            localStorage.setItem('userId', data.id);
            window.location.href = '/pages/dashboard.html';
        })
        .catch((error) => {
            apiResult.innerHTML = error.message;
        });
}

// Asociar la función de registro al evento clic del botón "Sig Up"
signUpButton.addEventListener('click', signUpUser);
