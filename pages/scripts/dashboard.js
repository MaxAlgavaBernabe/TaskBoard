// dashboard.js

// Espera a que el DOM esté completamente cargado
$(document).ready(function () {
    // Función para obtener y mostrar las tareas al cargar la página
    function getAndDisplayTasks() {
        // Obtener el ID de usuario de algún lugar (por ejemplo, puedes pasarlo como parámetro desde el backend)
        const userId = localStorage.getItem('userId'); // Reemplaza esto con la lógica para obtener el ID del usuario actual

        // Realizar una solicitud GET para obtener las tareas del usuario
        $.ajax({
            url: `http://127.0.0.1:8000/tasks/?id_user=${userId}`,
            type: 'GET',
            success: function (tasks) {
                // Limpiar la lista actual de tareas
                $('.ul-task').empty();

                // Mostrar cada tarea en la lista
                tasks.forEach(task => {
                    appendTaskToList(task);
                });
            },
            error: function (error) {
                console.error('Error al obtener las tareas:', error);
            },
        });
    }

    // Llamar a la función para obtener y mostrar las tareas al cargar la página
    getAndDisplayTasks();

    // Manejar clic en el botón de agregar tarea
    $('.button-add').on('click', function () {
        const inputTask = $('.input-task');
        const taskName = inputTask.val();

        if (taskName.trim() !== '') {
            // Obtener el ID de usuario de algún lugar (por ejemplo, puedes pasarlo como parámetro desde el backend)
            const userId = localStorage.getItem('userId'); // Reemplaza esto con la lógica para obtener el ID del usuario actual

            // Crear una nueva tarea
            const newTask = {
                name: taskName,
                status: false,
                id_user: userId,
            };

            // Realizar una solicitud POST para agregar la tarea
            $.ajax({
                url: 'http://127.0.0.1:8000/tasks/',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(newTask),
                success: function (data) {
                    // Actualizar la interfaz de usuario después de agregar la tarea
                    appendTaskToList(data);
                    inputTask.val('');
                },
                error: function (error) {
                    
                },
            });
        }
    });

    // Manejar clic en el ícono de editar tarea
    $('.ul-task').on('click', '.fa-pen-to-square', function (event) {
        event.stopPropagation(); // Evitar que el clic se propague al elemento padre (li-task)

        const taskItem = $(this).closest('.li-task');
        const taskId = taskItem.data('task-id');
        const currentTaskName = taskItem.find('.task-name').text();

        const newTaskName = prompt('Ingrese el nuevo nombre de la tarea:', currentTaskName);

        if (newTaskName !== null) {
            // Realizar una solicitud PUT para actualizar el nombre de la tarea
            $.ajax({
                url: `http://127.0.0.1:8000/tasks/${taskId}`,
                type: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify({ name: newTaskName }),
                success: function (data) {
                    // Actualizar la interfaz de usuario después de editar la tarea
                    taskItem.find('.task-name').text(data.name);
                },
                error: function (error) {
                   
                },
            });
        }
    });

    // Manejar clic en el ícono de eliminar tarea
    $('.ul-task').on('click', '.fa-trash-can', function (event) {
        event.stopPropagation(); // Evitar que el clic se propague al elemento padre (li-task)

        const taskItem = $(this).closest('.li-task');
        const taskId = taskItem.data('task-id');

        // Realizar una solicitud DELETE para eliminar la tarea
        $.ajax({
            url: `http://127.0.0.1:8000/tasks/${taskId}`,
            type: 'DELETE',
            success: function () {
                // Actualizar la interfaz de usuario después de eliminar la tarea
                taskItem.remove();
            },
            error: function (error) {
                
            },
        });
    });

    // Resto del código para manejar clics en el botón de marcar como completada, etc.
});


// Función para agregar una tarea a la lista
function appendTaskToList(task) {
    const taskList = $('.ul-task');
    const checkboxId = `checkbox-${task.id}`;
    const statusIconClass = task.status ? 'fa-solid fa-square-check' : 'fa-regular fa-square-check';

    const taskItem = `<li class="li-task" data-task-id="${task.id}">
                        <i id="${checkboxId}" class="${statusIconClass}"></i>
                        <span class="task-name">${task.name}</span>
                        <i class="fa-regular fa-pen-to-square"></i>
                        <i class="fa-regular fa-trash-can"></i>
                     </li>`;
    taskList.append(taskItem);

    // Agregar manejador de eventos para el clic en el ícono del checkbox
    $(`#${checkboxId}`).on('click', function () {
        // Realizar una solicitud PUT para cambiar el estado de la tarea
        const taskId = $(this).closest('.li-task').data('task-id');
        const newStatus = !task.status; // Cambiar el estado
    
        // Agregar un parámetro único para evitar el caché
        const uniqueParam = new Date().getTime();
        const apiUrl = `http://127.0.0.1:8000/tasks/${taskId}?nocache=${uniqueParam}`;
    
        $.ajax({
            url: apiUrl,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({ status: newStatus }),
            success: function (data) {
                // Actualizar la clase del icono basándonos en el nuevo estado
                const newIconClass = newStatus ? 'fa-solid fa-square-check style="color: #ffff;"' : 'fa-regular fa-square-check';
                $(`#${checkboxId}`).attr('class', newIconClass);
                location.reload();
            },
            error: function (error) {
                
            },
        });
    });
}

