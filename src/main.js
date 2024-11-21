require('dotenv').config();
const ApiService = require('./service/api');
const GoogleSheetService = require('./service/googleSheet');

const {
   API_BASE_URL,
   SPREADSHEET_ID,
   USERNAME
} = process.env;

async function main() {
   const api = new ApiService(API_BASE_URL, USERNAME);
   const sheet = new GoogleSheetService(SPREADSHEET_ID);
   try {
      const token = await api.init();
      
      console.log('Получение данных клиентов...');
      const clients = await api.fetchClientsWithStatus(token);

      console.log('Подключение к Google Таблице...');
      await sheet.authorize();

      console.log('Обновление Google Таблицы...');
      const headers = ['id', 'firstName', 'lastName', 'gender', 'address', 'city', 'phone', 'email', 'status'];
      await sheet.clearAndSetHeaders(headers);

      const rows = clients.map(client => ({
         id: client.id,
         firstName: client.firstName,
         lastName: client.lastName,
         gender: client.gender,
         address: client.address,
         city: client.city,
         phone: client.phone,
         email: client.email,
         status: client.status
      }));
      await sheet.appendRows(rows);

      console.log('Данные успешно обновлены!');
   } catch (error) {
      console.error('Произошла ошибка:', error.message);
   }
}

main();
