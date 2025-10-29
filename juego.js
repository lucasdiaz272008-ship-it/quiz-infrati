const preguntas = [
  { pregunta: "¿Qué es un servidor?", opciones: ["Software", "Dispositivo que provee servicios", "Protocolo", "App móvil"], respuesta: 1 },
  { pregunta: "¿Qué significa LAN?", opciones: ["Local Area Network", "Large Access Node", "Long Active Network", "Low Area Net"], respuesta: 0 },
  { pregunta: "¿Qué dispositivo conecta redes diferentes?", opciones: ["Switch", "Router", "Firewall", "Hub"], respuesta: 1 },
  { pregunta: "¿Qué es una IP?", opciones: ["Cable", "Dirección única", "Sistema operativo", "Antivirus"], respuesta: 1 },
  { pregunta: "¿Qué hace un firewall?", opciones: ["Acelera la red", "Protege contra amenazas", "Conecta dispositivos", "Almacena datos"], respuesta: 1 },
  { pregunta: "¿Qué es un switch?", opciones: ["Dispositivo de red", "Antivirus", "Sistema operativo", "Cable"], respuesta: 0 },
  { pregunta: "¿Qué protocolo se usa para transferir archivos?", opciones: ["HTTP", "FTP", "SMTP", "IP"], respuesta: 1 },
  { pregunta: "¿Qué es la nube?", opciones: ["Un servidor local", "Un tipo de cable", "Infraestructura remota", "Un sistema operativo"], respuesta: 2 }
];

let nombreJugador = "";
let puntaje = 0;
let preguntaActual = 0;
let ranking = [];
let tiempoRestante = 15;
let temporizador;

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("botonInicio").addEventListener("click", comenzarJuego);
});

function comenzarJuego() {
  nombreJugador = document.getElementById("nombre").value.trim();
  if (!nombreJugador) return alert("Por favor ingresa tu nombre");
  document.getElementById("inicio").style.display = "none";
  document.getElementById("juego").style.display = "block";
  cargarRanking();
  mostrarPregunta();
}

function mostrarPregunta() {
  tiempoRestante = 15;
  document.getElementById("tiempo").innerText = tiempoRestante;
  document.getElementById("feedback").innerText = "";
  temporizador = setInterval(actualizarTemporizador, 1000);

  const p = preguntas[preguntaActual];
  document.getElementById("pregunta").innerText = p.pregunta;
  document.getElementById("opciones").innerHTML = "";
  p.opciones.forEach((opcion, i) => {
    const btn = document.createElement("button");
    btn.innerText = opcion;
    btn.onclick = () => verificarRespuesta(i);
    document.getElementById("opciones").appendChild(btn);
  });
}

function actualizarTemporizador() {
  tiempoRestante--;
  document.getElementById("tiempo").innerText = tiempoRestante;
  if (tiempoRestante <= 0) {
    clearInterval(temporizador);
    verificarRespuesta(-1); // tiempo agotado
  }
}

function verificarRespuesta(i) {
  clearInterval(temporizador);
  const correcta = preguntas[preguntaActual].respuesta;
  const opciones = preguntas[preguntaActual].opciones;

  let mensaje = "";
  if (i === correcta) {
    puntaje++;
    mensaje = `✅ ¡Correcto! "${opciones[correcta]}" es la respuesta correcta.`;
  } else if (i === -1) {
    mensaje = `⏱️ Tiempo agotado. La respuesta correcta era: "${opciones[correcta]}".`;
  } else {
    mensaje = `❌ Incorrecto. Elegiste "${opciones[i]}". La respuesta correcta era: "${opciones[correcta]}".`;
  }

  document.getElementById("feedback").innerText = mensaje;

  preguntaActual++;
  if (preguntaActual < preguntas.length) {
    setTimeout(mostrarPregunta, 2000);
  } else {
    setTimeout(terminarJuego, 2000);
  }
}

function terminarJuego() {
  document.getElementById("juego").style.display = "none";
  document.getElementById("resultado").style.display = "block";
  document.getElementById("resultado").innerText = `¡Bien hecho, ${nombreJugador}! Tu puntaje fue: ${puntaje}/${preguntas.length}`;
  ranking.push({ nombre: nombreJugador, puntaje });
  ranking.sort((a, b) => b.puntaje - a.puntaje);
  ranking = ranking.slice(0, 10);
  localStorage.setItem("ranking", JSON.stringify(ranking));
  mostrarRanking();
}

function cargarRanking() {
  const guardado = localStorage.getItem("ranking");
  if (guardado) {
    ranking = JSON.parse(guardado);
  }
}

function mostrarRanking() {
  document.getElementById("ranking").style.display = "block";
  let html = "<h2>🏆 Mejores Puntajes</h2><ol>";
  ranking.forEach(j => {
    html += `<li>${j.nombre} - ${j.puntaje} pts</li>`;
  });
  html += "</ol><p>Creador el juego Lucas Díaz</p>";
  document.getElementById("ranking").innerHTML = html;
}