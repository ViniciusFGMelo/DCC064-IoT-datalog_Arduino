const express = require('express');
const fs = require('fs');
const path = require('path');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(__dirname)); 

let ultimaTemperatura = null;

// Função para formatar data no formato DD/MM/AAAA HH:MM:SS
function formatarData(date) {
  const pad = (n) => n.toString().padStart(2, '0');
  const dia = pad(date.getDate());
  const mes = pad(date.getMonth() + 1);
  const ano = date.getFullYear();
  const horas = pad(date.getHours());
  const minutos = pad(date.getMinutes());
  const segundos = pad(date.getSeconds());

  return `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`;
}

// Configuração da porta serial (ajuste a porta se necessário)
const portaSerial = new SerialPort({ path: '/dev/ttyUSB0', baudRate: 9600 });
const parser = portaSerial.pipe(new ReadlineParser({ delimiter: '\r\n' }));

parser.on('data', (data) => {
  const temperatura = parseFloat(data);
  if (!isNaN(temperatura)) {
    console.log(`Temperatura lida: ${temperatura}°C`);

    ultimaTemperatura = temperatura;

    const agora = new Date();
    const dataHora = formatarData(agora);

    const log = `${dataHora} - Temperatura: ${temperatura}°C\n`;
    fs.appendFile('log.txt', log, (err) => {
      if (err) console.error('Erro ao salvar no log:', err);
    });
  } else {
    console.log('Dado inválido da serial:', data);
  }
});

// Endpoint REST para obter a última temperatura
app.get('/temperatura', (req, res) => {
  if (ultimaTemperatura !== null) {
    res.json({
      temperatura: ultimaTemperatura,
      timestamp: formatarData(new Date())
    });
  } else {
    res.status(404).json({ error: 'Nenhuma temperatura disponível ainda.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
