const API_URL = "http://localhost:3000/api";

// Registro de usuario
document.getElementById("userForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch(`${API_URL}/users/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            alert("Usuario registrado con éxito.");
        } else {
            alert("Error al registrar usuario.");
        }
    } catch (err) {
        console.error(err);
        alert("Error en la conexión al servidor.");
    }
});

// Registro de perro
document.getElementById("dogForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const dogName = document.getElementById("dogName").value;
    const dogAge = document.getElementById("dogAge").value;

    try {
        const response = await fetch(`${API_URL}/dogs`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: dogName, age: dogAge }),
        });

        if (response.ok) {
            alert("Perro registrado con éxito.");
        } else {
            alert("Error al registrar perro.");
        }
    } catch (err) {
        console.error(err);
        alert("Error en la conexión al servidor.");
    }
});

// Envío del formulario de contacto
document.getElementById("contactForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const contactName = document.getElementById("contactName").value;
    const contactEmail = document.getElementById("contactEmail").value;
    const contactMessage = document.getElementById("contactMessage").value;

    alert(`Gracias, ${contactName}. Hemos recibido tu mensaje: "${contactMessage}"`);
    e.target.reset();
});
