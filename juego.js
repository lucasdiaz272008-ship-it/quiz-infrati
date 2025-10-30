let preguntas = [
  { pregunta: "¿Qué es una computadora?", opciones: ["Electrodoméstico", "Procesador de datos", "Lámpara", "Juguete"], respuesta: 1 },
  { pregunta: "¿Qué hace un router?", opciones: ["Imprime", "Distribuye internet", "Reproduce música", "Carga batería"], respuesta: 1 },
  { pregunta: "¿Qué es el Wi-Fi?", opciones: ["Cable", "Red inalámbrica", "Virus", "App"], respuesta: 1 },
  { pregunta: "¿Qué guarda archivos?", opciones: ["Monitor", "Teclado", "Disco duro", "Mouse"], respuesta: 2 },
  { pregunta: "¿Qué es un servidor?", opciones: ["Cable", "Software", "Computadora que brinda servicios", "Antivirus"], respuesta: 2 },
  { pregunta: "¿Qué significa IP?", opciones: ["Internet Protocol", "Identificador Personal", "Instalación Privada", "Interfaz Pública"], respuesta: 0 },
  { pregunta: "¿Qué es un switch?", opciones: ["Conecta computadoras", "Mouse", "Software", "Impresora"], respuesta: 0 },
  { pregunta: "¿Qué es la nube?", opciones: ["Lugar físico", "Refrigeración", "Almacenamiento en internet", "Cable especial"], respuesta: 2 },
  { pregunta: "¿Qué es MAC?", opciones: ["Maquillaje", "Dirección física de red", "Sistema operativo", "Virus"], respuesta: 1 },
  { pregunta: "¿Qué hace un firewall?", opciones: ["Protege la red", "Imprime", "Reproduce música", "Conecta redes"], respuesta: 0 }
];

let indice = 0, puntaje = 0, tiempo = 15, temporizador, nombreJugador = "";

document.getElementById("botonInicio").onclick = () => {
  nombreJugador = document.getElementById("nombre").value.trim();
  if (nombreJugador === "") return alert("Ingresa tu nombre");
  document.getElementById("inicio").style.display = "none";
  document.getElementById("juego").style.display = "block";
  mostrarPregunta();
  iniciarTemporizador();
};

function mostrarPregunta() {
  let p = preguntas[indice];
  document.getElementById("pregunta").textContent = p.pregunta;
  document.getElementById("opciones").innerHTML = "";
  p.opciones.forEach((opcion, i) => {
    let btn = document.createElement("button");
    btn.textContent = opcion;
    btn.onclick = () => verificarRespuesta(i);
    document.getElementById("opciones").appendChild(btn);
  });
  document.getElementById("feedback").textContent = "";
}

function verificarRespuesta(i) {
  let correcta = preguntas[indice].respuesta;
  if (i === correcta) {
    puntaje += 1;
    document.getElementById("feedback").textContent = "✅ ¡Correcto!";
  } else {
    document.getElementById("feedback").textContent = "❌ Incorrecto";
  }
  clearInterval(temporizador);
  setTimeout(() => {
    indice++;
    if (indice < preguntas.length) {
      tiempo = 15;
      mostrarPregunta();
      iniciarTemporizador();
    } else {
      finalizarJuego();
    }
  }, 1000);
}

function iniciarTemporizador() {
  document.getElementById("tiempo").textContent = tiempo;
  temporizador = setInterval(() => {
    tiempo--;
    document.getElementById("tiempo").textContent = tiempo;
    if (tiempo === 0) {
      clearInterval(temporizador);
      verificarRespuesta(-1);
    }
  }, 1000);
}

function finalizarJuego() {
  document.getElementById("juego").style.display = "none";
  document.getElementById("resultado").style.display = "block";
  let puntajeFinal = Math.round((puntaje / preguntas.length) * 100);
  document.getElementById("resultado").innerHTML = `<h3>${nombreJugador}, tu puntaje es: ${puntajeFinal}%</h3>`;
  mostrarConfeti();
  const medalla = obtenerMedalla(puntajeFinal);
  document.getElementById("resultado").innerHTML += `<p>Tu medalla: ${medalla}</p>`;
  document.getElementById("resultado").innerHTML += `<p>${emojiAleatorio()} ¡Gracias por jugar!</p>`;
  guardarPuntaje(nombreJugador, puntajeFinal);
}

function mostrarConfeti() {
  const confeti = document.createElement("div");
  confeti.innerHTML = "🎉 ¡Felicitaciones!";
  confeti.style.fontSize = "2em";
  confeti.style.textAlign = "center";
  confeti.style.marginTop = "20px";
  document.getElementById("resultado").appendChild(confeti);
}

function obtenerMedalla(puntaje) {
  if (puntaje >= 90) return "🥇 Oro";
  if (puntaje >= 70) return "🥈 Plata";
  if (puntaje >= 50) return "🥉 Bronce";
  return "🎓 Participación";
}

function emojiAleatorio() {
  const emojis = ["🚀", "🧠", "🔥", "🎯", "💡", "🏆"];
  return emojis[Math.floor(Math.random() * emojis.length)];
}

function guardarPuntaje(nombre, puntaje) {
  db.collection("ranking").add({ nombre, puntaje, fecha: new Date() }).then(() => {
    mostrarRanking();
  });
}

function mostrarRanking() {
  document.getElementById("ranking").style.display = "block";
  db.collection("ranking")
    .orderBy("puntaje", "desc")
    .limit(15)
    .get()
    .then(snapshot => {
      let html = "<h3>🏆 Top 15 jugadores</h3><ol>";
      snapshot.forEach(doc => {
        let data = doc.data();
        html += `<li><span style="color:#2e7d32;">${data.nombre}</span>: <strong>${data.puntaje}%</strong></li>`;
      });
      html += "</ol>";
      html += `
        <div style="margin-top:30px; font-size:18px;">
          <p><strong style="color:#d32f2f; font-size:20px;">🎮 Creador del juego: Lucas Díaz</strong></p>
          <p style="font-style:italic; color:#555;">📚 Exposición de la profesora Eugenia</p>
        </div>
      `;
      document.getElementById("ranking").innerHTML = html;
    });
}

// Mostrar ranking automáticamente al entrar
window.onload = () => {
  mostrarRanking();
};