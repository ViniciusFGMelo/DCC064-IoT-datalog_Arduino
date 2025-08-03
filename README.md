# 🌡️ Monitor de Temperatura Web

Sistema de monitoramento de temperatura em tempo real usando Arduino, sensor DHT11 e interface web moderna.

## 📋 O que é o projeto

Este projeto lê a temperatura de um sensor DHT11 conectado ao Arduino e exibe os dados em uma página web em tempo real. O Arduino envia os dados via porta serial para um servidor Node.js, que disponibiliza uma API REST para a interface web consultar.

## 🛠️ Hardware Necessário

- **Arduino Uno** (ou compatível)
- **Sensor DHT11** 
- **Cabos jumper** para conexões
- **Cabo USB** para conectar Arduino ao computador

## 📥 Instalação

### 1. Hardware
- Conecte o DHT11 ao Arduino conforme o esquema de ligação
- Faça o upload do arquivo `temp.ino` para o Arduino usando a Arduino IDE

### 2. Software
```bash
npm install express serialport
node server.js
```

### 3. Configuração
No arquivo `server.js`, altere a porta serial se necessário:
```javascript
const portaSerial = new SerialPort({ path: '/dev/ttyUSB0', baudRate: 9600 });
```
**Nota:** `/dev/ttyUSB0` é a porta do meu Arduino. Altere para a porta do seu Arduino (ex: `COM3` no Windows).

## 📁 Arquivos do Projeto

- **`temp.ino`** - Código Arduino que lê o sensor DHT11
- **`server.js`** - Servidor Node.js que cria a API REST e serve os arquivos web
- **`index.html`** - Interface web principal
- **`style.css`** - Estilos visuais da página
- **`script.js`** - JavaScript que consome a API REST

## 🌐 API REST

O servidor Node.js cria um endpoint REST simples:
- **GET `/temperatura`** - Retorna a última temperatura lida em formato JSON

A página web faz requisições para este endpoint a cada 2 segundos para atualizar a temperatura exibida.

## 🚀 Como usar

1. Conecte o Arduino com o código carregado
2. Execute `npm install` (apenas na primeira vez)
3. Execute `node server.js`
4. Acesse `http://localhost:3000` no navegador

As temperaturas são automaticamente salvas no arquivo `log.txt`.

## 🐛 Problemas comuns

- **Erro de porta serial**: Verifique se a porta está correta no `server.js`
- **Dependências**: Execute `npm install` antes de iniciar o servidor
- **Arduino**: Certifique-se que o código foi carregado e o Arduino está conectado