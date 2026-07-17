# ارسال پیامک OTP با Node.js — آرتا پیامک

این مخزن شامل نمونه‌ای ساده و کاربردی برای ارسال [پیامک OTP](https://artapayamak.com/otp-sms/) با استفاده از Node.js است. در این مثال، درخواست ارسال پیامک از طریق API و با کمک کتابخانه `axios` به سرویس IPPanel Edge فرستاده می‌شود.

[آرتا پیامک](https://artapayamak.com/) ارائه‌دهنده پنل ارسال پیامک و راهکارهای پیامکی برای توسعه‌دهندگان و کسب‌وکارهای ایرانی است. با استفاده از API آرتا پیامک می‌توانید قابلیت‌هایی مانند ارسال رمز یک‌بارمصرف، پیامک‌های خدماتی و اطلاع‌رسانی‌های سیستمی را به نرم‌افزار خود اضافه کنید.

## کاربرد این نمونه

این نمونه برای توسعه‌دهندگانی مناسب است که می‌خواهند ارسال کد تأیید را در پروژه Node.js خود پیاده‌سازی کنند. از این قابلیت می‌توان در فرایندهای زیر استفاده کرد:

- ورود یا ثبت‌نام با شماره موبایل
- تأیید شماره تلفن همراه
- بازیابی رمز عبور
- تأیید تراکنش یا عملیات حساس
- احراز هویت دومرحله‌ای

برای آشنایی بیشتر با این سرویس، صفحه [API ارسال پیامک OTP](https://artapayamak.com/sms-otp-api/) را مطالعه کنید.

## پیش‌نیازها

برای اجرای این نمونه به موارد زیر نیاز دارید:

- Node.js نسخه `18` یا بالاتر
- مدیر بسته `npm`
- کتابخانه `axios`
- کتابخانه `dotenv`
- حساب فعال در آرتا پیامک
- توکن معتبر API
- الگوی تأییدشده برای ارسال OTP
- شماره فرستنده فعال

## نصب و راه‌اندازی

ابتدا یک پروژه جدید Node.js ایجاد کنید:

```bash
mkdir artapayamak-otp-nodejs
cd artapayamak-otp-nodejs
npm init -y
```

سپس کتابخانه‌های موردنیاز را نصب کنید:

```bash
npm install axios dotenv
```

## تنظیم توکن API

برای حفظ امنیت، توکن API نباید مستقیماً داخل سورس‌کد نوشته شود. یک فایل با نام `.env` در مسیر اصلی پروژه ایجاد کنید:

```env
IPPANEL_API_TOKEN=your_api_token_here
```

سپس یک فایل با نام `.env.example` ایجاد کنید تا نام متغیرهای محیطی موردنیاز پروژه مشخص باشد:

```env
IPPANEL_API_TOKEN=your_api_token_here
```

فایل `.env.example` فقط یک راهنما است و نباید شامل توکن واقعی باشد.

> پکیج `dotenv` مقادیر موجود در فایل `.env` را خوانده و در اختیار `process.env` قرار می‌دهد. بدون اجرای `require('dotenv').config()`، فایل `.env` در حالت عادی به‌صورت خودکار توسط Node.js بارگذاری نمی‌شود.

## نمونه کد ارسال OTP

فایل زیر را با نام `send_otp.js` ایجاد کنید:

```javascript
require('dotenv').config();

const axios = require('axios');

const url = 'https://edge.ippanel.com/v1/api/send';
const apiToken = process.env.IPPANEL_API_TOKEN;

if (!apiToken) {
  throw new Error(
    'The IPPANEL_API_TOKEN environment variable is not set.'
  );
}

const payload = {
  sending_type: 'pattern',
  from_number: '+983000505',
  code: 'xxxxxxxxxxxxxxx',
  recipients: ['+989120000000'],
  params: {
    code: '458921'
  }
};

const headers = {
  Authorization: apiToken,
  'Content-Type': 'application/json'
};

async function sendOtp() {
  try {
    const response = await axios.post(url, payload, {
      headers,
      timeout: 15000
    });

    console.log(response.data);
  } catch (error) {
    if (error.response) {
      console.error('API request failed:', {
        status: error.response.status,
        data: error.response.data
      });
    } else if (error.request) {
      console.error('No response was received from the API.');
    } else {
      console.error('OTP request failed:', error.message);
    }

    process.exitCode = 1;
  }
}

sendOtp();
```

## اجرای نمونه

پس از ایجاد فایل `.env` و قرار دادن توکن API، نمونه را با دستور زیر اجرا کنید:

```bash
node send_otp.js
```

در صورت معتبر بودن توکن، شناسه الگو، شماره فرستنده و شماره گیرنده، نتیجه درخواست در ترمینال نمایش داده می‌شود.

## توضیح مرحله‌به‌مرحله کد

برای جلوگیری از به‌هم‌ریختگی نمایش متن فارسی و عبارت‌های فنی، هر قسمت از کد به‌صورت جداگانه توضیح داده شده است.

### ۱. بارگذاری متغیرهای محیطی

```javascript
require('dotenv').config();
```

این دستور پکیج `dotenv` را اجرا می‌کند تا مقادیر موجود در فایل `.env` در اختیار `process.env` قرار بگیرند.

### ۲. وارد کردن Axios

```javascript
const axios = require('axios');
```

کتابخانه `axios` برای ارسال درخواست HTTP به API استفاده می‌شود.

این نمونه از ساختار `CommonJS` و تابع `require()` استفاده می‌کند.

### ۳. مشخص کردن آدرس API

```javascript
const url = 'https://edge.ippanel.com/v1/api/send';
```

ثابت `url` آدرس endpoint مربوط به ارسال پیامک را نگه می‌دارد. درخواست `POST` به این آدرس ارسال خواهد شد.

### ۴. خواندن توکن API

```javascript
const apiToken = process.env.IPPANEL_API_TOKEN;
```

توکن API از متغیر محیطی `IPPANEL_API_TOKEN` خوانده می‌شود. با این روش، اطلاعات حساس داخل سورس‌کد قرار نمی‌گیرند.

### ۵. بررسی وجود توکن

```javascript
if (!apiToken) {
  throw new Error(
    'The IPPANEL_API_TOKEN environment variable is not set.'
  );
}
```

این قسمت بررسی می‌کند که توکن API تنظیم شده باشد. اگر توکن وجود نداشته باشد، برنامه پیش از ارسال درخواست متوقف می‌شود و پیام خطای مشخصی نمایش می‌دهد.

### ۶. ساخت اطلاعات درخواست

```javascript
const payload = {
  sending_type: 'pattern',
  from_number: '+983000505',
  code: 'xxxxxxxxxxxxxxx',
  recipients: ['+989120000000'],
  params: {
    code: '458921'
  }
};
```

شیء `payload` اطلاعات موردنیاز برای ارسال OTP را نگه می‌دارد. Axios این شیء جاوااسکریپت را هنگام ارسال درخواست به JSON تبدیل می‌کند.

### ۷. تعیین نوع ارسال

```javascript
sending_type: 'pattern'
```

مقدار `pattern` مشخص می‌کند که پیامک با استفاده از الگوی ازپیش‌تعریف‌شده ارسال شود. ارسال الگویی برای پیامک‌های OTP و پیام‌های خدماتی کاربرد دارد.

### ۸. تعیین شماره فرستنده

```javascript
from_number: '+983000505'
```

مقدار `from_number` شماره‌ای است که پیامک از طریق آن ارسال می‌شود. این مقدار را با شماره فرستنده فعال حساب خود جایگزین کنید.

### ۹. تعیین شناسه الگو

```javascript
code: 'xxxxxxxxxxxxxxx'
```

این `code` شناسه الگوی پیامکی ثبت‌شده در پنل است. مقدار نمونه را با شناسه واقعی الگوی تأییدشده خود جایگزین کنید.

این فیلد با مقدار OTP داخل `params` تفاوت دارد:

- مقدار `payload.code` شناسه الگوی پیامک است.
- مقدار `payload.params.code` رمز یک‌بارمصرفی است که برای کاربر ارسال می‌شود.

### ۱۰. تعیین شماره گیرنده

```javascript
recipients: ['+989120000000']
```

فیلد `recipients` آرایه‌ای از شماره‌های دریافت‌کننده پیامک است. شماره موبایل باید با فرمت مورد قبول API وارد شود.

در این نمونه، شماره با پیش‌شماره بین‌المللی ایران یعنی `+98` نوشته شده است.

### ۱۱. مقداردهی متغیرهای الگو

```javascript
params: {
  code: '458921'
}
```

فیلد `params` مقادیر متغیرهای داخل الگوی پیامک را تعیین می‌کند.

در این نمونه، متغیر `code` داخل الگو با مقدار `458921` جایگزین می‌شود. در یک پروژه واقعی، این مقدار باید به‌صورت امن و پویا تولید شود.

نام کلیدهای `params` باید دقیقاً با نام متغیرهای تعریف‌شده در الگوی پیامک مطابقت داشته باشد.

### ۱۲. ساخت هدرهای درخواست

```javascript
const headers = {
  Authorization: apiToken,
  'Content-Type': 'application/json'
};
```

هدر `Authorization` توکن API را برای احراز هویت درخواست ارسال می‌کند.

هدر `Content-Type` نیز مشخص می‌کند که محتوای درخواست در قالب JSON فرستاده می‌شود.

### ۱۳. تعریف تابع ارسال OTP

```javascript
async function sendOtp() {
```

تابع `sendOtp` به‌صورت `async` تعریف شده است تا بتوان داخل آن از `await` برای منتظر ماندن تا دریافت پاسخ API استفاده کرد.

استفاده از `async/await` باعث می‌شود ساختار کد نسبت به زنجیره‌های متعدد `then()` و `catch()` خواناتر باشد.

### ۱۴. ارسال درخواست

```javascript
const response = await axios.post(url, payload, {
  headers,
  timeout: 15000
});
```

متد `axios.post()` درخواست را به API ارسال می‌کند.

آرگومان‌های این متد عبارت‌اند از:

- `url`: آدرس API
- `payload`: اطلاعات درخواست
- `headers`: هدرهای احراز هویت و نوع محتوا
- `timeout`: حداکثر زمان انتظار برای دریافت پاسخ

مقدار `15000` به میلی‌ثانیه است و حداکثر زمان انتظار را روی ۱۵ ثانیه قرار می‌دهد.

### ۱۵. نمایش پاسخ API

```javascript
console.log(response.data);
```

Axios محتوای پاسخ API را در ویژگی `response.data` قرار می‌دهد. این دستور نتیجه درخواست را در ترمینال نمایش می‌دهد.

### ۱۶. مدیریت پاسخ‌های خطای API

```javascript
if (error.response) {
  console.error('API request failed:', {
    status: error.response.status,
    data: error.response.data
  });
}
```

اگر API پاسخی با وضعیت ناموفق مانند `400`، `401` یا `422` برگرداند، Axios اطلاعات آن را در `error.response` قرار می‌دهد.

این قسمت کد وضعیت HTTP و جزئیات خطای بازگردانده‌شده توسط API را نمایش می‌دهد.

### ۱۷. مدیریت دریافت نشدن پاسخ

```javascript
else if (error.request) {
  console.error('No response was received from the API.');
}
```

اگر درخواست ارسال شده باشد اما هیچ پاسخی دریافت نشود، اطلاعات درخواست در `error.request` قرار می‌گیرد.

این وضعیت ممکن است در اثر اختلال شبکه، در دسترس نبودن سرویس یا پایان زمان انتظار رخ دهد.

### ۱۸. مدیریت سایر خطاها

```javascript
else {
  console.error('OTP request failed:', error.message);
}
```

اگر خطا پیش از ارسال درخواست یا هنگام پیکربندی Axios ایجاد شود، پیام آن از طریق `error.message` نمایش داده می‌شود.

### ۱۹. تنظیم کد خروج برنامه

```javascript
process.exitCode = 1;
```

این دستور مشخص می‌کند که برنامه با وضعیت ناموفق خاتمه یافته است.

برخلاف `process.exit(1)`، تنظیم `process.exitCode` به Node.js اجازه می‌دهد عملیات در حال انتظار، مانند نوشتن خروجی در ترمینال، به‌شکل عادی تکمیل شود.

### ۲۰. اجرای تابع

```javascript
sendOtp();
```

در پایان، تابع `sendOtp` فراخوانی می‌شود تا درخواست ارسال OTP اجرا شود.

## شخصی‌سازی نمونه

پیش از اجرای کد، مقادیر نمونه زیر را با اطلاعات واقعی حساب خود جایگزین کنید:

| مقدار نمونه | کاربرد |
|---|---|
| `+983000505` | شماره فرستنده فعال |
| `xxxxxxxxxxxxxxx` | شناسه الگوی تأییدشده |
| `+989120000000` | شماره موبایل گیرنده |
| `458921` | کد یک‌بارمصرف تولیدشده توسط برنامه |

توکن API نباید در این جدول یا داخل سورس‌کد قرار بگیرد و باید از متغیر محیطی خوانده شود.

## ساختار پیشنهادی پروژه

ساختار فایل‌های پروژه می‌تواند به شکل زیر باشد:

```text
artapayamak-otp-nodejs/
├── .env.example
├── .gitignore
├── README.md
├── package.json
├── package-lock.json
└── send_otp.js
```

فایل `.env` در این ساختار نمایش داده نشده است؛ زیرا حاوی توکن واقعی است و نباید در Git ثبت شود.

## تنظیم فایل `.gitignore`

فایلی با نام `.gitignore` ایجاد کرده و موارد زیر را داخل آن قرار دهید:

```gitignore
node_modules/
.env
.env.*
!.env.example
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.DS_Store
```

خط `!.env.example` باعث می‌شود فایل نمونه تنظیمات در Git ثبت شود، در حالی که فایل‌های واقعی محیطی نادیده گرفته می‌شوند.

## نکات امنیتی

- توکن API را مستقیماً داخل سورس‌کد ننویسید.
- فایل‌های حاوی اطلاعات محرمانه را در Git ثبت نکنید.
- کد OTP را با یک مولد تصادفی امن ایجاد کنید.
- برای کد OTP زمان انقضا در نظر بگیرید.
- تعداد تلاش‌های ناموفق برای وارد کردن OTP را محدود کنید.
- توکن API را در لاگ‌ها و پیام‌های خطا نمایش ندهید.
- شماره گیرنده را پیش از ارسال درخواست اعتبارسنجی کنید.
- کد OTP را پس از استفاده موفق باطل کنید.
- از ارسال تعداد نامحدود OTP به یک شماره جلوگیری کنید.
- برای endpoint درخواست OTP محدودیت نرخ یا `Rate Limiting` در نظر بگیرید.

اگر از فایل `.env` استفاده می‌کنید، حتماً آن را به `.gitignore` اضافه کنید:

```gitignore
.env
```

### تولید امن کد OTP

در محیط واقعی، کد OTP را به‌صورت ثابت داخل برنامه قرار ندهید. برای تولید کد شش‌رقمی می‌توانید از ماژول داخلی `crypto` استفاده کنید:

```javascript
const { randomInt } = require('crypto');

const otpCode = randomInt(100000, 1000000).toString();
```

سپس مقدار تولیدشده را در پارامترهای الگو قرار دهید:

```javascript
params: {
  code: otpCode
}
```

> تولید امن کد تنها بخشی از فرایند OTP است. کد باید در سمت سرور با زمان انقضای کوتاه ذخیره شود، تعداد دفعات بررسی آن محدود باشد و پس از استفاده موفق باطل شود.

## خطاهای رایج

### متغیر محیطی تنظیم نشده است

```text
The IPPANEL_API_TOKEN environment variable is not set.
```

بررسی کنید که فایل `.env` در مسیر اصلی پروژه وجود داشته باشد و متغیر زیر داخل آن تعریف شده باشد:

```env
IPPANEL_API_TOKEN=your_api_token_here
```

همچنین مطمئن شوید که `require('dotenv').config()` در ابتدای فایل اجرا شده است.

### خطای `401 Unauthorized`

این خطا معمولاً نشان می‌دهد که توکن API ارسال نشده، اشتباه است یا اعتبار ندارد.

موارد زیر را بررسی کنید:

- مقدار `IPPANEL_API_TOKEN` صحیح باشد.
- قبل یا بعد از توکن فاصله اضافی وجود نداشته باشد.
- هدر `Authorization` به‌درستی ارسال شود.
- توکن مربوط به حساب فعال باشد.

### خطای `400 Bad Request`

این پاسخ معمولاً به نامعتبر بودن ساختار درخواست یا یکی از فیلدهای آن مربوط است.

مقادیر `sending_type`، `from_number`، `code`، `recipients` و `params` را بررسی کنید.

### خطای `422 Unprocessable Entity`

این خطا ممکن است نشان دهد که ساختار درخواست درست است، اما یکی از مقادیر آن قابل پردازش نیست.

موارد زیر را بررسی کنید:

- شناسه الگو معتبر و تأییدشده باشد.
- کلیدهای `params` با متغیرهای الگو مطابقت داشته باشند.
- شماره فرستنده در حساب شما فعال باشد.
- شماره گیرنده با فرمت مورد قبول API ارسال شود.

### دریافت نشدن پاسخ از API

اگر پیام زیر نمایش داده شود:

```text
No response was received from the API.
```

موارد زیر را بررسی کنید:

- اتصال اینترنت برقرار باشد.
- آدرس API صحیح باشد.
- فایروال یا پراکسی درخواست را مسدود نکرده باشد.
- سرویس مقصد در دسترس باشد.
- مقدار `timeout` برای شرایط شبکه بیش از حد کوتاه نباشد.

### خطای پایان زمان انتظار

اگر API در مدت ۱۵ ثانیه پاسخ ندهد، Axios درخواست را متوقف می‌کند.

در برنامه‌های واقعی، برای خطاهای موقتی می‌توانید از راهکار `Retry` با تأخیر افزایشی استفاده کنید؛ اما درخواست ارسال OTP را نباید بدون کنترل چندین بار تکرار کرد، زیرا ممکن است باعث ارسال پیامک تکراری شود.

### شناسه الگوی اشتباه

مقدار زیر شناسه الگوی پیامکی است:

```javascript
code: 'xxxxxxxxxxxxxxx'
```

این مقدار را با کد OTP اشتباه نگیرید. رمز یک‌بارمصرف در بخش `params` قرار می‌گیرد:

```javascript
params: {
  code: '458921'
}
```

### نام متغیر الگو اشتباه است

نام کلیدهای موجود در `params` باید دقیقاً با نام متغیرهای تعریف‌شده در الگوی پیامک یکسان باشد.

برای مثال، اگر متغیر الگو `verification_code` است، درخواست نیز باید به این شکل باشد:

```javascript
params: {
  verification_code: '458921'
}
```

### شماره فرستنده نامعتبر است

مقدار `from_number` باید شماره فرستنده‌ای باشد که در حساب شما فعال است و اجازه ارسال با آن را دارید.

### فرمت شماره گیرنده صحیح نیست

شماره گیرنده را با فرمت مورد قبول API وارد کنید. در این نمونه از فرمت بین‌المللی ایران استفاده شده است:

```text
+989120000000
```

## مستندات و راهنماهای مرتبط

برای آشنایی بیشتر با سرویس‌های آرتا پیامک، راهنماهای زیر را مطالعه کنید:

- [آرتا پیامک](https://artapayamak.com/)
- [راهنمای پیامک OTP](https://artapayamak.com/otp-sms/)
- [مستندات API ارسال پیامک OTP](https://artapayamak.com/sms-otp-api/)
- [راهنمای ارسال پیامک در n8n](https://artapayamak.com/send-sms-n8n/)

## پشتیبانی

اگر هنگام دریافت توکن، تعریف الگو یا اجرای API با مشکلی مواجه شدید، از طریق [وب‌سایت آرتا پیامک](https://artapayamak.com/) با تیم پشتیبانی در ارتباط باشید.
````

فایل واقعی `send_otp.js` نیز باید شامل همین نسخه اصلاح‌شده باشد:

```javascript
require('dotenv').config();

const axios = require('axios');

const url = 'https://edge.ippanel.com/v1/api/send';
const apiToken = process.env.IPPANEL_API_TOKEN;

if (!apiToken) {
  throw new Error(
    'The IPPANEL_API_TOKEN environment variable is not set.'
  );
}

const payload = {
  sending_type: 'pattern',
  from_number: '+983000505',
  code: 'xxxxxxxxxxxxxxx',
  recipients: ['+989120000000'],
  params: {
    code: '458921'
  }
};

const headers = {
  Authorization: apiToken,
  'Content-Type': 'application/json'
};

async function sendOtp() {
  try {
    const response = await axios.post(url, payload, {
      headers,
      timeout: 15000
    });

    console.log(response.data);
  } catch (error) {
    if (error.response) {
      console.error('API request failed:', {
        status: error.response.status,
        data: error.response.data
      });
    } else if (error.request) {
      console.error('No response was received from the API.');
    } else {
      console.error('OTP request failed:', error.message);
    }

    process.exitCode = 1;
  }
}

sendOtp();
```

نکته مهم این نسخه، تفکیک دو مقدار هم‌نام `code` است:

- `payload.code` شناسه الگوی ثبت‌شده در پنل است.
- `payload.params.code` مقدار OTP ارسال‌شده برای کاربر است.
