const axios = require('axios');

axios.post(
  'https://edge.ippanel.com/v1/api/send',
  {
    sending_type: 'pattern',
    from_number: '+983000505',
    code: 'xxxxxxxxxxxxxxx',
    recipients: ['+989120000000'],
    params: {
      code: '458921'
    }
  },
  {
    headers: {
      Authorization: process.env.IPPANEL_API_TOKEN,
      'Content-Type': 'application/json'
    }
  }
).then(response => {
  console.log(response.data);
}).catch(error => {
  console.error(error.response ? error.response.data : error.message);
});
