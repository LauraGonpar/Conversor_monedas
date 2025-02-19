async function getMoneda() {
  const monto = document.querySelector("#monto").value;
  const moneda = document.querySelector("#moneda").value;
  const resultado = document.querySelector("#resultado");
  const apiURL = "https://mindicador.cl/api/";
  const simbolos = {
    euro: "€",
    dolar: "$",
  };
  if (!monto || !moneda) {
    resultado.textContent =
      "Por favor, ingrese un monto y seleccione una moneda";
    return;
  }
  try {
    const res = await fetch(apiURL + moneda);
    if (!res.ok) throw new Error("Error al obtener los datos");

    const data = await res.json();
    const valor = data.serie[0].valor;
    const conversion = (monto / valor).toFixed(1);
    resultado.textContent = `Resultado: ${
      simbolos[moneda] || ""
    } ${conversion}`;

    getGrafico(data.serie);
  } catch (error) {
    resultado.textContent = "No se pudo obtener los datos. Intente más tarde.";
    console.error(error);
  }
}
async function getGrafico(serie) {
  const etiquetas = serie
    .slice(0, 10)
    .map((d) => d.fecha.split("T")[0])
    .reverse();
  const valores = serie
    .slice(0, 10)
    .map((d) => d.valor)
    .reverse();

  const myChart = document.querySelector("#myChart").getContext("2d");

  myChart = new Chart(myChart, {
    type: "line",
    data: {
      labels: etiquetas,
      datasets: [
        {
          label: "Valor del Dólar últimos 10 días",
          data: valores,
          borderColor: "blue",
          backgroundColor: "rgba(0, 0, 255, 0.2)",
          fill: "origin",
        },
      ],
    },
  });
}
