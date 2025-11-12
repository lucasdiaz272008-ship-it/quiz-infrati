const preguntas = [
  {
    pregunta: "¿Qué es un servidor?",
    opciones: ["Un router", "Una computadora que brinda servicios", "Un antivirus"],
    respuestaCorrecta: 1
  },
  {
    pregunta: "¿Qué significa 'infraestructura de TI'?",
    opciones: ["Solo computadoras", "Hardware, software y redes", "Solo internet"],
    respuestaCorrecta: 1
  },
  {
    pregunta: "¿Qué es una red LAN?",
    opciones: ["Red inalámbrica", "Red local", "Red global"],
    respuestaCorrecta: 1
  },
  {
    pregunta: "¿Qué dispositivo asigna direcciones IP?",
    opciones: ["Switch", "Router", "Servidor"],
    respuestaCorrecta: 1
  },
  {
    pregunta: "¿Qué es un firewall?",
    opciones: ["Sistema de seguridad", "Software de edición", "Tipo de cable"],
    respuestaCorrecta: 0
  },
  {
    pregunta: "¿Qué es la virtualización?",
    opciones: ["Conectar redes", "Crear máquinas virtuales", "Eliminar virus"],
    respuestaCorrecta: 1
  },
  {
    pregunta: "¿De qué se encarga el administrador de red?",
    opciones: ["Gestionar y mantener la red", "Diseñar páginas web", "Reparar hardware"],
    respuestaCorrecta: 0
  },
  {
    pregunta: "¿De qué se encarga el administrador de sistemas?",
    opciones: ["Diseñar redes LAN", "Instalar antivirus", "Configurar y mantener servidores"],
    respuestaCorrecta: 2
  },
  {
    pregunta: "¿Cuál es el objetivo principal de una red?",
    opciones: ["Evitar virus", "Compartir recursos e información", "Crear páginas web"],
    respuestaCorrecta: 1
  },
  {
    pregunta: "¿Qué es una dirección IP?",
    opciones: ["Tipo de cable", "Antivirus", "Identificador de red"],
    respuestaCorrecta: 2
  }
];

let actual = 0;
let tiempo = 15;
let intervalo;
let puntos = 0;

document.getElementById("botonInicio").onclick = () => {
  const nombre = document.getElementById("nombre").value.trim();
  if (nombre === "") {
    alert("Por favor ingresa tu nombre.");
    return;
  }
  document.getElementById("inicio").style.display = "none";
  document.getElementById("juego").style.display = "block";
  actual = 0;
  puntos = 0;
  tiempo = 15;
  mostrarPregunta();
  iniciarTemporizador();
};

function mostrarPregunta() {
  const p = preguntas[actual];
  document.getElementById("pregunta").textContent = p.pregunta;
  const opcionesDiv = document.getElementById("opciones");
  opcionesDiv.innerHTML = "";
  p.opciones.forEach((opcion, i) => {
    const btn = document.createElement("button");
    btn.textContent = opcion;
    btn.onclick = () => verificar(i);
    opcionesDiv.appendChild(btn);
  });
  document.getElementById("feedback").textContent = "";
  document.getElementById("tiempo").textContent = tiempo;
}

function verificar(i) {
  clearInterval(intervalo);
  const correcta = preguntas[actual].respuestaCorrecta;
  const feedback = document.getElementById("feedback");
  if (i === correcta) {
    puntos++;
    feedback.textContent = "✅ ¡Correcto!";
  } else {
    feedback.textContent = `❌ Incorrecto. La respuesta era: ${preguntas[actual].opciones[correcta]}`;
  }
  actual++;
  if (actual < preguntas.length) {
    setTimeout(() => {
      tiempo = 15;
      mostrarPregunta();
      iniciarTemporizador();
    }, 1500);
  } else {
    document.getElementById("juego").style.display = "none";
    document.getElementById("resultado").style.display = "block";
    document.getElementById("resultado").innerHTML = `<h2>🎉 ¡Juego terminado!</h2><p>Tu puntuación: ${puntos} de ${preguntas.length}</p>`;
  }
}

function iniciarTemporizador() {
  intervalo = setInterval(() => {
    tiempo--;
    document.getElementById("tiempo").textContent = tiempo;
    if (tiempo === 0) {
      clearInterval(intervalo);
      verificar(-1); // tiempo agotado
    }
  }, 1000);
}