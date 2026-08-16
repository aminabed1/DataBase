# راهنمای جامع بک‌اند - GangOfThree

این مستند شامل توضیحات کامل در خصوص نحوه راه‌اندازی سرور بک‌اند، اتصال به پایگاه داده و Redis، لیست کامل APIها به همراه پارامترهای ورودی و خروجی و نحوه تست آن‌هاست.

---

## ۱. نحوه راه‌اندازی و اجرای سرور بک‌اند

پروژه بک‌اند با استفاده از **Spring Boot** و جاوا توسعه داده شده است. برای اجرای پروژه، شما دو راه پیش رو دارید:

### روش اول: استفاده از Docker Compose (پیشنهادی)
با استفاده از این روش، پایگاه داده (PostgreSQL) و بک‌اند و فرانت‌اند به صورت خودکار اجرا می‌شوند.
1. در ریشه پروژه (جایی که فایل `docker-compose.yml` قرار دارد) دستور زیر را اجرا کنید:
   ```bash
   docker-compose up --build -d
   ```
2. سرور بک‌اند روی پورت `8081` اجرا خواهد شد.

### روش دوم: اجرای دستی با Gradle / Maven
در صورتی که قصد توسعه (Development) دارید:
1. مطمئن شوید پایگاه داده PostgreSQL، سرویس Redis و Elasticsearch در حال اجرا هستند.
2. وارد پوشه `backend` شوید.
3. برنامه را از طریق IDE (مثل IntelliJ IDEA یا VSCode) یا با دستور زیر اجرا کنید:
   ```bash
   ./gradlew bootRun
   ```

---

## ۲. نحوه اتصال به پایگاه داده، Redis و تنظیمات

تنظیمات اصلی پروژه در فایل `backend/src/main/resources/application.yaml` قرار دارد.

### پایگاه داده (PostgreSQL)
- **آدرس پایگاه داده (URL):** `jdbc:postgresql://localhost:5432/postgres` (در داکر: `gangofthree-postgres`)
- **نام کاربری (Username):** `postgres`
- **رمز عبور (Password):** `aminamin`

### کش و مدیریت سشن‌ها (Redis)
- **میزبان (Host):** `localhost` (در داکر: `redis-gangofthree`)
- **پورت (Port):** `6379`

### موتور جستجو (Elasticsearch)
- **آدرس (URI):** `http://localhost:9200` (در داکر: `http://gangofthree-elasticsearch:9200`)

---

## ۳. لیست تمامی APIها به همراه توضیحات

در این بخش مسیر تمام APIهای سیستم به تفکیک کنترلرها آورده شده است. همه خروجی‌ها در قالب `ApiResponse<T>` برگردانده می‌شوند. توکن‌های احراز هویت (JWT) باید در هدر `Authorization: Bearer <token>` ارسال شوند.

### 🔐 احراز هویت (AuthController) - `/api/auth`
- `POST /register`: ثبت‌نام کاربر جدید. (ورودی: `RegisterRequest` شامل اطلاعات پایه / خروجی: توکن و اطلاعات کاربر)
- `POST /login`: ورود کاربر. (ورودی: `LoginRequest` شامل ایمیل/شماره و رمز عبور / خروجی: توکن احراز هویت)
- `POST /verify-otp`: تأیید کد یکبار مصرف. (ورودی: `OtpRequest` / خروجی: توکن احراز هویت)
- `POST /forgot-password`: درخواست فراموشی رمز عبور. (ورودی: ایمیل یا شماره موبایل)
- `POST /forgot-password/verify-otp`: تأیید OTP فراموشی رمز.
- `POST /forgot-password/reset`: تنظیم رمز عبور جدید. (ورودی: `ResetPasswordRequest`)

### 👥 مدیریت کاربران (UserController) - `/api/users/me`
- `POST /email/change/old/send-otp`: ارسال کد تأیید به ایمیل فعلی جهت تغییر ایمیل.
- `POST /email/change/old/verify-otp`: تأیید کد ایمیل فعلی. (ورودی: `OtpRequest`)
- `POST /email/change/new/send-otp`: ارسال کد به ایمیل جدید. (نیاز به توکن تأیید مرحله قبل در هدر `X-Email-Change-Token`)
- `POST /email/change/new/verify-otp`: تأیید ایمیل جدید و اعمال تغییر.
- *(همین ۴ مرحله برای تغییر شماره موبایل در مسیر `/phone/change/...` نیز وجود دارد)*
- `PATCH /password`: تغییر رمز عبور. (ورودی: رمز فعلی و رمز جدید)

### 💰 کیف پول و تراکنش‌ها (WalletController & PaymentController)
- **WalletController (`/api/wallets/me`)**
  - `POST /top-up`: شارژ کیف پول. (ورودی: مبلغ در `TopUpRequest` / خروجی: موجودی جدید `WalletResponse`)
  - `GET /transactions`: لیست تراکنش‌های کاربر.
- **PaymentController (`/api/payments`)**
  - `POST /checkout`: نهایی‌سازی پرداخت. (ورودی: `PaymentRequest`)
  - `GET /methods`: دریافت روش‌های پرداخت مجاز سیستم.

### 🎫 بلیت‌ها، رزرو و مسابقات
- **MatchController (`/api/matches`)**
  - `PUT /{id}`: بروزرسانی اطلاعات یک مسابقه.
  - `DELETE /{id}`: حذف مسابقه.
- **TicketController (`/api/tickets`)**
  - `GET /me`: لیست بلیت‌های خریداری شده توسط کاربر فعلی.
  - `GET /{matchId}/details`: دریافت جزئیات بلیت‌های یک مسابقه خاص.
- **ReservationController (`/api/reservations`)**
  - `GET /active`: دریافت رزروهای فعال کاربر.
  - `GET /history`: دریافت تاریخچه رزروها.
- **BookingController (`/api/bookings`)**
  - `GET /api/bookings?filter={ALL|...}`: دریافت لیست رزروها با اعمال فیلتر.
- **CancellationController (`/api/cancellations`)**
  - `GET /{reservationId}/penalty`: بررسی مبلغ جریمه کنسلی یک رزرو خاص.

### 📍 مکان‌ها (LocationController) - `/api/locations`
- `GET /provinces`: دریافت لیست استان‌ها.
- `GET /cities?provinceId={id}`: دریافت لیست شهرهای یک استان خاص.

### 🛠 گزارش مشکلات (ReportController) - `/api/reports`
- `POST /api/reports`: ثبت گزارش خرابی یا مشکل. (ورودی: `ReportIssueRequest` / خروجی: پیغام موفقیت)
- `GET /api/reports`: دریافت لیست گزارش‌های ارسال شده توسط کاربر.

### 👑 مدیریت (AdminController & AdminSearchController)
- `GET /api/admin/reports`: دریافت لیست تمامی گزارش‌های کاربران (مخصوص ادمین).
- `POST /api/admin/reports/{id}/reply`: ثبت پاسخ ادمین به یک گزارش.
- `GET /api/admin/payments/suspicious`: دریافت تراکنش‌های مشکوک.
- `POST /api/admin/reservations/{id}/force-cancel`: لغو اجباری یک رزرو توسط ادمین (همراه با پارامتر `reason`).
- `GET /api/admin/reservations/cancelled`: لیست رزروهای لغو شده.
- `POST /api/admin/search/reindex`: ایندکس کردن مجدد داده‌ها در Elasticsearch.

### 🔍 جستجو (SearchHealthController)
- `GET /api/search/health`: بررسی وضعیت سلامت اتصال به سرویس Elasticsearch.

---

## ۴. نحوه تست APIها (با Postman یا Curl)

شما می‌توانید برای تست APIها از ابزارهایی مانند Postman، Insomnia یا دستور `curl` در ترمینال استفاده کنید. در این پروژه ممکن است یک پوشه `.postman` یا `postman` وجود داشته باشد که کالکشن‌های آماده را نگهداری می‌کند و می‌توانید مستقیماً آن‌ها را در نرم‌افزار Postman ایمپورت کنید.

### نمونه تست با Curl (لاگین کاربر)
```bash
curl -X POST http://localhost:8081/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com", "password":"Password123"}'
```

### نمونه تست با Curl (دریافت لیست بلیت‌ها - نیاز به توکن)
پس از ورود به سیستم، یک توکن (Token) دریافت می‌کنید. آن توکن را باید در هدر درخواست‌های بعدی قرار دهید:

```bash
curl -X GET http://localhost:8081/api/tickets/me \
     -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
     -H "Content-Type: application/json"
```

### استفاده در Postman
1. یک **Request** جدید بسازید.
2. نوع متد (GET, POST, ...) را مشخص کنید.
3. آدرس (مثلاً `http://localhost:8081/api/auth/register`) را وارد کنید.
4. در تب **Body**، گزینه `raw` و سپس `JSON` را انتخاب کرده و دیتای ورودی را وارد کنید.
5. برای APIهایی که نیاز به احراز هویت دارند، به تب **Authorization** رفته، نوع را `Bearer Token` انتخاب کنید و توکن را در کادر مربوطه قرار دهید.
6. دکمه **Send** را بزنید و نتیجه را در قسمت Response مشاهده کنید.
