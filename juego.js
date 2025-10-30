let preguntas = [
  {
    pregunta: "¿Qué es un servidor?",
    opciones: ["Un tipo de cable", "Una computadora que brinda servicios", "Un software de edición", "Una red social"],
    respuesta: 1
  },
  {
    pregunta: "¿Qué significa IP?",
    opciones: ["Internet Protocol", "Interfaz Pública", "Identificador Personal", "Instalación Privada"],
    respuesta: 0
  },
  {
    pregunta: "¿Qué dispositivo conecta redes diferentes?",
    opciones: ["Switch", "Router", "Monitor", "Teclado"],
    respuesta: 1
  }
];

let indice = 0;
let puntaje = 0;
let tiempo = 15;
let temporizador;
let nombreJugador = "";

document.getElementById("botonInicio").onclick = () => {
  nombreJugador = document.getElementById("nombre").value.trim();
  if (nombreJugador === "") return alert("Por favor ingresa tu nombre");
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
      verificarRespuesta(-1); // tiempo agotado
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

function guardarPuntaje(nombre, puntaje) {
  db.collection("ranking").add({ nombre, puntaje, fecha: new Date() }).then(() => {
    mostrarRanking();
  });
}

function mostrarRanking() {
  document.getElementById("ranking").style.display = "block";
  db.collection("ranking").orderBy("puntaje", "desc").limit(10).get().then(snapshot => {
    let html = "<h3>🏆 Ranking</h3><ol>";
    snapshot.forEach(doc => {
      let data = doc.data();
      html += `<li>${data.nombre}: ${data.puntaje}%</li>`;
    });
    html += "</ol>";
    document.getElementById("ranking").innerHTML = html;
  });
}