// Google Apps Script для записи ответов из формы в Google Таблицу.
// Как использовать:
// 1. Создайте Google Таблицу.
// 2. Откройте Расширения → Apps Script.
// 3. Вставьте этот код.
// 4. Укажите SHEET_NAME, если хотите другое название листа.
// 5. Нажмите Deploy / Развернуть → New deployment / Новое развертывание.
// 6. Type: Web app. Execute as: Me. Who has access: Anyone.
// 7. Скопируйте Web app URL и вставьте его в script.js в googleScriptUrl.

const SHEET_NAME = 'Ответы гостей';

function doPost(e) {
  const sheet = getOrCreateSheet_();
  const p = e.parameter || {};

  sheet.appendRow([
    new Date(),
    p.guest_name || '',
    p.attendance || '',
    p.guest_count || '',
    p.comment || '',
    p.page || '',
    p.sent_at || ''
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Дата получения',
      'Имя гостя',
      'Присутствие',
      'Количество гостей',
      'Комментарий',
      'Страница',
      'Дата отправки с сайта'
    ]);
  }

  return sheet;
}
