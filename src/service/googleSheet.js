const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library')
const creds = require('../secrets/cred.json');


class GoogleSheetService {
   constructor(sheetId) {
      this.sheetId = sheetId;
      this.doc = null;
   }

   async authorize() {
      const SCOPES = [
         'https://www.googleapis.com/auth/spreadsheets',
         'https://www.googleapis.com/auth/drive.file',
      ];

      const jwt = new JWT({
         email: creds.client_email,
         key: creds.private_key,
         scopes: SCOPES,
      });
      this.doc = new GoogleSpreadsheet(this.sheetId, jwt);

      await this.doc.loadInfo();
   }



   async clearAndSetHeaders(headers) {
      const sheet = this.doc.sheetsByIndex[0];
      await sheet.clear();
      await sheet.setHeaderRow(headers);
   }

   async appendRows(rows) {
      const sheet = this.doc.sheetsByIndex[0];
      await sheet.addRows(rows);
   }
}

module.exports = GoogleSheetService;
