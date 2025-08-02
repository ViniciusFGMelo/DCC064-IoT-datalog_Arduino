// Criar partículas de fundo
function createParticles() {
  const particlesContainer = document.getElementById('particles');
  const numParticles = 50;
  
  for (let i = 0; i < numParticles; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 6 + 's';
    particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
    particlesContainer.appendChild(particle);
  }
}

let ultimaTemperatura = null;
let historicoTemp = [];

function determinarTendencia(novaTemp) {
  if (historicoTemp.length < 3) return '';
  
  const mediaRecente = historicoTemp.slice(-3).reduce((a, b) => a + b, 0) / 3;
  const mediaAnterior = historicoTemp.slice(-6, -3).reduce((a, b) => a + b, 0) / 3;
  
  if (novaTemp > mediaRecente + 0.5) {
    return '<span class="trend-arrow">↗️</span> Subindo';
  } else if (novaTemp < mediaRecente - 0.5) {
    return '<span class="trend-arrow">↘️</span> Descendo';
  } else {
    return '<span class="trend-arrow">➡️</span> Estável';
  }
}

function atualizarCorCirculo(temperatura) {
  const circle = document.querySelector('.temp-circle');
  if (temperatura < 20) {
    circle.style.background = 'linear-gradient(135deg, #74b9ff, #0984e3)';
    circle.style.boxShadow = '0 15px 30px rgba(116, 185, 255, 0.3)';
  } else if (temperatura < 30) {
    circle.style.background = 'linear-gradient(135deg, #00b894, #00a085)';
    circle.style.boxShadow = '0 15px 30px rgba(0, 184, 148, 0.3)';
  } else if (temperatura < 35) {
    circle.style.background = 'linear-gradient(135deg, #ffa726, #ff9800)';
    circle.style.boxShadow = '0 15px 30px rgba(255, 167, 38, 0.3)';
  } else {
    circle.style.background = 'linear-gradient(135deg, #ff6b6b, #e74c3c)';
    circle.style.boxShadow = '0 15px 30px rgba(255, 107, 107, 0.3)';
  }
}

async function buscarTemperatura() {
  const statusIndicator = document.getElementById('statusIndicator');
  const errorDiv = document.getElementById('error');
  
  try {
    statusIndicator.style.background = '#FFC107'; // Amarelo para carregando
    
    const response = await fetch('/temperatura');
    if (!response.ok) {
      throw new Error('Nenhuma temperatura disponível ainda.');
    }
    
    const data = await response.json();
    const temperatura = data.temperatura;
    
    // Atualizar display
    document.getElementById('temp').textContent = temperatura.toFixed(1) + '°C';
    document.getElementById('timestamp').textContent = 'Atualizado em: ' + data.timestamp;
    
    // Atualizar cor do círculo baseado na temperatura
    atualizarCorCirculo(temperatura);
    
    // Calcular tendência
    historicoTemp.push(temperatura);
    if (historicoTemp.length > 10) historicoTemp.shift(); // Manter apenas os últimos 10 valores
    
    const tendencia = determinarTendencia(temperatura);
    document.getElementById('tempTrend').innerHTML = tendencia;
    
    // Status OK
    statusIndicator.style.background = '#4CAF50';
    errorDiv.style.display = 'none';
    ultimaTemperatura = temperatura;
    
  } catch (err) {
    document.getElementById('temp').textContent = '--°C';
    document.getElementById('timestamp').textContent = '';
    document.getElementById('tempTrend').innerHTML = '';
    
    errorDiv.textContent = err.message;
    errorDiv.style.display = 'block';
    statusIndicator.style.background = '#f44336'; // Vermelho para erro
  }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
  createParticles();
  buscarTemperatura();
  setInterval(buscarTemperatura, 10000);
});