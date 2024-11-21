const axios = require('axios');

class ApiService {
   constructor(baseURL, username) {
      this.client = axios.create({ baseURL });
      this.username = username;
      this.token = null;
   }

   async init() {
      console.log('Регистрация пользователя...');
      try {
         this.token = await this.registerUser();
         return this.token;
      } catch (error) {
         if (error.response && error.response.status === 400) {
            console.log('Пользователь уже существует. Попытка авторизации...');
            return this.authorizeUser();
         }
         throw new Error(`Ошибка при инициализации: ${error.message}`);
      }
   }

   async registerUser() {
      const response = await this.client.post('/auth/registration', {
         username: this.username,
      });
      
      console.log('Пользователь успешно зарегистрирован.');
      return response.data.token;
   }

   async authorizeUser() {
      try {
         const response = await this.client.post('/auth/login', {
            username: this.username,
         });
         console.log('Авторизация успешна.');
         return response.data.token;
      } catch (error) {
         throw new Error(`Ошибка при авторизации: ${error.message}`);
      }
   }

   async getClients(token, limit = 1000, offset = 0) {
      try {
         
         const response = await this.client.get('/clients', {
            headers: { Authorization: `${token}` },
            params: { limit, offset }
         });
         return response.data;
      } catch (error) {
         throw new Error(`Ошибка при получении данных клиентов: ${error.message}`);
      }
   }
}

module.exports = ApiService;
