// ============================================================
// CONFIGURAÇÃO: edite aqui e vale para o site inteiro
// ============================================================
const WHATSAPP_NUMERO = '5545999131832'; // 55 + DDD + número, só dígitos
const ENDERECO = 'Av. Felipe Wandscheer, 2669, Sala 04 – Maracanã, Foz do Iguaçu – PR, 85852-352';
const MSG_PADRAO = 'Olá! Gostaria de falar com a Frontier Assessoria Contábil.';

const waLink = (texto) => 'https://wa.me/' + WHATSAPP_NUMERO + '?text=' + encodeURIComponent(texto);

document.querySelectorAll('.js-whatsapp').forEach(el => {
  el.href = waLink(MSG_PADRAO); el.target = '_blank'; el.rel = 'noopener';
});
document.querySelectorAll('.js-endereco').forEach(el => { el.textContent = ENDERECO; });
document.querySelectorAll('.js-mapa').forEach(el => {
  el.href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(ENDERECO);
});
const mapa = document.getElementById('mapa');
if (mapa) mapa.src = 'https://www.google.com/maps?q=' + encodeURIComponent(ENDERECO) + '&output=embed';

// Menu mobile (acessível, fecha com Esc)
const toggle = document.getElementById('menuToggle');
const menu = document.getElementById('menu');
function setMenu(aberto) {
  menu.classList.toggle('open', aberto);
  toggle.setAttribute('aria-expanded', String(aberto));
  toggle.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
  toggle.textContent = aberto ? '✕' : '☰';
}
toggle.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menu.classList.contains('open')) { setMenu(false); toggle.focus(); }
});

document.getElementById('ano').textContent = new Date().getFullYear();

// Formulário de agendamento -> WhatsApp (só na página de contato)
const form = document.getElementById('contactForm');
if (form) {
  const campoData = document.getElementById('data');
  const hoje = new Date();
  campoData.min = hoje.getFullYear() + '-' + String(hoje.getMonth() + 1).padStart(2, '0') + '-' + String(hoje.getDate()).padStart(2, '0');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const nome = document.getElementById('nome').value.trim();
    const tel = document.getElementById('telefone').value.trim();
    const periodo = document.getElementById('periodo').value;
    const msg = document.getElementById('mensagem').value.trim();
    const [a, m, d] = campoData.value.split('-');
    const linhas = [
      'Olá! Gostaria de agendar um atendimento.',
      'Nome: ' + nome,
      'Data preferida: ' + d + '/' + m + '/' + a,
      'Período: ' + periodo,
      'Meu WhatsApp: ' + tel
    ];
    if (msg) linhas.push('Mensagem: ' + msg);
    window.open(waLink(linhas.join('\n')), '_blank', 'noopener');
  });
}

// Formulário rápido da página inicial -> WhatsApp
const quick = document.getElementById('quickForm');
if (quick) {
  quick.addEventListener('submit', function (e) {
    e.preventDefault();
    const v = (id) => document.getElementById(id).value.trim();
    const linhas = ['Olá! Vim pelo site da Frontier.', 'Nome: ' + v('q-nome'), 'Assunto: ' + v('q-assunto'), 'Meu WhatsApp: ' + v('q-tel')];
    if (v('q-msg')) linhas.push('Mensagem: ' + v('q-msg'));
    window.open(waLink(linhas.join('\n')), '_blank', 'noopener');
  });
}

// ============================================================
// COOKIES (consentimento por categoria, guardado por 11 meses)
// ============================================================
(function () {
  const CHAVE = 'frontier_cookies';
  const CATS = [
    ['necessarios', 'Necessários', 'Essenciais para o funcionamento básico do site e para guardar a sua escolha de cookies.', true],
    ['funcionais', 'Funcionais', 'Ajudam em recursos como compartilhar conteúdo em redes sociais e usar ferramentas de terceiros.', false],
    ['desempenho', 'Desempenho', 'Ajudam a entender o desempenho do site para melhorar a experiência dos visitantes.', false],
    ['analiticos', 'Analíticos', 'Mostram como os visitantes usam o site: número de visitas, origem do tráfego etc.', false],
    ['publicidade', 'Publicidade', 'Usados para exibir anúncios e campanhas relevantes aos visitantes.', false],
    ['outros', 'Outros', 'Cookies ainda não classificados em nenhuma categoria.', false]
  ];
  const ler = () => { try { return JSON.parse(localStorage.getItem(CHAVE)); } catch (e) { return null; } };
  const salvar = (escolha) => {
    escolha.necessarios = true;
    escolha.data = new Date().toISOString();
    try { localStorage.setItem(CHAVE, JSON.stringify(escolha)); } catch (e) {}
    document.cookie = 'viewed_cookie_policy=yes; max-age=' + (60 * 60 * 24 * 335) + '; path=/; SameSite=Lax';
    window.dispatchEvent(new CustomEvent('frontier:cookies', { detail: escolha }));
  };
  const todos = (v) => { const o = {}; CATS.forEach(c => { o[c[0]] = c[3] ? true : v; }); return o; };

  const banner = document.createElement('div');
  banner.className = 'ck-banner'; banner.hidden = true;
  banner.setAttribute('role', 'dialog'); banner.setAttribute('aria-label', 'Aviso de cookies');
  banner.innerHTML = '<p>Usamos cookies para lembrar suas preferências e entender como o site é usado. Ao clicar em “Aceitar tudo”, você concorda com o uso de todos os cookies. Você também pode escolher quais aceitar em “Configurações”. <a href="politica-de-privacidade.html">Saiba mais</a></p>' +
    '<div class="ck-actions"><button type="button" class="btn btn-outline" data-ck="config">Configurações</button><button type="button" class="btn btn-outline" data-ck="rejeitar">Rejeitar tudo</button><button type="button" class="btn btn-primary" data-ck="aceitar">Aceitar tudo</button></div>';

  const overlay = document.createElement('div');
  overlay.className = 'ck-overlay'; overlay.hidden = true;
  overlay.innerHTML = '<div class="ck-modal" role="dialog" aria-modal="true" aria-labelledby="ckTitulo"><h2 id="ckTitulo">Configurações de cookies</h2>' +
    '<p>Escolha quais categorias de cookies você aceita. Os necessários ficam sempre ativos. Você pode mudar sua escolha a qualquer momento pelo rodapé do site.</p>' +
    CATS.map(c => '<div class="ck-cat"><label>' + c[1] + (c[3] ? '<span class="on">Sempre ativo</span>' : '<input type="checkbox" data-cat="' + c[0] + '" aria-label="' + c[1] + '" />') + '</label><p>' + c[2] + '</p></div>').join('') +
    '<div class="ck-actions"><button type="button" class="btn btn-outline" data-ck="fechar">Fechar</button><button type="button" class="btn btn-primary" data-ck="salvar">Salvar e aceitar</button></div></div>';
  document.body.append(banner, overlay);

  let ultimoFoco = null;
  const abrirConfig = () => {
    const atual = ler() || {};
    overlay.querySelectorAll('[data-cat]').forEach(i => { i.checked = !!atual[i.dataset.cat]; });
    ultimoFoco = document.activeElement; overlay.hidden = false;
    overlay.querySelector('[data-ck="salvar"]').focus();
  };
  const fecharConfig = () => { overlay.hidden = true; if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus(); };

  banner.addEventListener('click', (e) => {
    const a = e.target.dataset.ck; if (!a) return;
    if (a === 'aceitar') { salvar(todos(true)); banner.hidden = true; }
    if (a === 'rejeitar') { salvar(todos(false)); banner.hidden = true; }
    if (a === 'config') abrirConfig();
  });
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) return fecharConfig();
    const a = e.target.dataset.ck; if (!a) return;
    if (a === 'fechar') fecharConfig();
    if (a === 'salvar') {
      const o = todos(false);
      overlay.querySelectorAll('[data-cat]').forEach(i => { o[i.dataset.cat] = i.checked; });
      salvar(o); banner.hidden = true; fecharConfig();
    }
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !overlay.hidden) fecharConfig(); });
  const bt = document.getElementById('abrirCookies');
  if (bt) bt.addEventListener('click', abrirConfig);
  if (!ler()) banner.hidden = false;
})();
