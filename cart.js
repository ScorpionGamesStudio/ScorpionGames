/*
 * Gestione semplice del carrello
 * Salva i prodotti selezionati nel localStorage e li visualizza nella pagina carrello.
 */

// Carica il carrello dal localStorage
function loadCart() {
  const cart = localStorage.getItem('cartItems');
  return cart ? JSON.parse(cart) : [];
}

// Salva il carrello nel localStorage
function saveCart(cart) {
  localStorage.setItem('cartItems', JSON.stringify(cart));
}

// Aggiunge un elemento al carrello
function addToCart(item) {
  const cart = loadCart();
  const existing = cart.find((c) => c.name === item.name);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }
  saveCart(cart);
}

// Visualizza gli elementi del carrello nella pagina carrello
function renderCart() {
  const container = document.getElementById('cart-items');
  const totalElem = document.getElementById('cart-total');
  const actions = document.getElementById('cart-actions');
  const cart = loadCart();
  if (!container || !totalElem || !actions) return;
  container.innerHTML = '';
  if (cart.length === 0) {
    container.innerHTML = '<p>Il tuo carrello è vuoto.</p>';
    totalElem.textContent = '';
    actions.style.display = 'none';
    return;
  }
  let total = 0;
  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <div><strong>${item.name}</strong> ×${item.quantity} - €${item.price.toFixed(2)}</div>
      <button type="button" class="btn remove-item" data-index="${index}">Rimuovi</button>
    `;
    container.appendChild(div);
  });
  totalElem.textContent = 'Totale: €' + total.toFixed(2);
  actions.style.display = 'flex';
}

document.addEventListener('DOMContentLoaded', () => {
  // Aggiungi al carrello dai pulsanti nella pagina giochi
  const addButtons = document.querySelectorAll('.add-to-cart');
  addButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const name = btn.getAttribute('data-name');
      const price = parseFloat(btn.getAttribute('data-price'));
      const image = btn.getAttribute('data-image');
      addToCart({ name, price, image });
      alert(`${name} è stato aggiunto al carrello.`);
    });
  });

  // Se siamo nella pagina carrello, renderizza i contenuti e gestisci le azioni
  if (document.getElementById('cart-items')) {
    renderCart();
    // Rimozione di un elemento
    document.getElementById('cart-items').addEventListener('click', (e) => {
      if (e.target.classList.contains('remove-item')) {
        const index = parseInt(e.target.getAttribute('data-index'), 10);
        const cart = loadCart();
        cart.splice(index, 1);
        saveCart(cart);
        renderCart();
      }
    });
    // Svuota carrello
    const clearBtn = document.getElementById('clear-cart');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        localStorage.removeItem('cartItems');
        renderCart();
      });
    }
    // Checkout (placeholder)
    const checkoutBtn = document.getElementById('checkout');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        alert('Funzionalità di pagamento non ancora implementata. Contattaci per finalizzare l’acquisto.');
      });
    }
  }
});