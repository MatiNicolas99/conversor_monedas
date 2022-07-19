//SELECTORES
const btn = document.querySelector('.btn');
const valorResultado = document.getElementById('valor-resultado');
const cantidadBuscada = document.getElementById('cantidad-buscada');
const mensaje_error = document.getElementById('error');
let miCanvas = document.getElementById('grafica-monedas').getContext('2d');
let myChart

//FUNCION QUE TRAE LOS DATOS DEL ENDPOINT
const fetchDatos = async (moneda) => {
    try {

        const fetch_datos = await fetch(`https://mindicador.cl/api/${moneda}`);
        const datos = await fetch_datos.json();
        const datoActual = datos.serie[0].valor;
        const serieDatos = datos.serie.splice(0, 10);

        transformarDato(datoActual, moneda);
        ordenandoDatos(serieDatos);

    } catch (error) {

        mensaje_error.classList.toggle('hide');
        mensaje_error.innerHTML = error;
        setTimeout(() => mensaje_error.classList.toggle('hide'), 6000);     

    };

};

//FUNCION QUE TRANSFORMA LOS DATOS Y LOS IMPRIME EN PANTALLA
const transformarDato = (dato, moneda) => {

    const valorInput = document.querySelector('#input-number').value
    let valorTransformado
    let valorFinal

    if (valorInput < 0 || valorInput === NaN || valorInput === undefined || valorInput == "") {
        alert("La cantidad ingresada es incorrecta, favor intenta nuevamente")
        cantidadBuscada.innerHTML = ""
        valorResultado.innerHTML = ""
        
    } else {

        if (moneda === "dolar") {
            valorTransformado = parseInt(valorInput) / parseInt(dato)
            valorFinal = `US$ ${valorTransformado.toFixed(2)}`
        } else if (moneda === "euro") {
            valorTransformado = parseInt(valorInput) / parseInt(dato)
            valorFinal = `EU$ ${valorTransformado.toFixed(2)}`
        } else if (moneda === "uf") {
            valorTransformado = parseInt(valorInput) / parseInt(dato)
            valorFinal = `UF ${valorTransformado.toFixed(2)}`
        }

        cantidadBuscada.innerHTML = valorInput;
        valorResultado.innerHTML = valorFinal;
    }
};

//FUNCION QUE ORDENA LOS DATOS POR FECHA 
const ordenandoDatos = (serieDatos) => {

    const datoOrdenado = serieDatos.sort((x, y) => {
        if (x.fecha < y.fecha) {
            return -1;
        }
        if (x.fecha > y.fecha) {
            return 1;
        }
        return 0;
    });

    const fechas = datoOrdenado.map(x => formateoFecha(x.fecha));
    const valorMoneda = datoOrdenado.map(x => x.valor);
    crearGrafico(valorMoneda, fechas);

};

//FUNCION QUE FORMATEA FECHA
const formateoFecha = (date) => {

    date = new Date(date);
    const año = date.getFullYear();
    const meses = date.getMonth() + 1;
    const dias = date.getDate();
    return `${año}-${meses}-${dias}`;
    
};

//FUNCION QUE CREA EL GRAFICO
const crearGrafico = (valores, fechas) => {

    if(myChart) {
        myChart.destroy();
    }

 myChart = new Chart(miCanvas, {
        type: 'line',
        data: {
            labels: fechas,
            datasets: [
                {
                    label: `Historial de valores en los últimos 10 días`,
                    data: valores,
                    borderColor: "rgb(0, 0, 110)",
                    
                }
            ]
        }
    })
};

//BOTON QUE TRAE LOS DATOS DEL ENPOINT
btn.addEventListener('click', () => {

    const option = document.querySelector('select').value;
    fetchDatos(option);
});