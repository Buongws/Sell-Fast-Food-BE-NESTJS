# Fast Food Shop - Authentication System

## Tổng quan

Hệ thống authentication hoàn chỉnh được xây dựng với NestJS, sử dụng JWT (JSON Web Tokens) để xác thực và phân quyền người dùng.

## Tính năng

### 🔐 Authentication

- **Đăng ký tài khoản**: Tạo tài khoản mới với validation
- **Đăng nhập**: Xác thực và trả về JWT tokens
- **Đăng xuất**: Hủy phiên đăng nhập
- **Refresh Token**: Làm mới access token

### 🔒 Authorization

- **Role-based Access Control**: Phân quyền dựa trên vai trò
- **JWT Guards**: Bảo vệ các routes cần xác thực
- **Role Guards**: Kiểm tra quyền truy cập

### 👤 User Management

- **Xem profile**: Lấy thông tin cá nhân
- **Cập nhật profile**: Sửa đổi thông tin cá nhân
- **Đổi mật khẩu**: Thay đổi mật khẩu với xác thực
- **Quên mật khẩu**: Gửi email reset mật khẩu (placeholder)

## Cấu trúc API

### Public Endpoints (Không cần xác thực)

```
POST /api/v1/auth/register     - Đăng ký tài khoản
POST /api/v1/auth/login        - Đăng nhập
POST /api/v1/auth/forgot-password - Quên mật khẩu
POST /api/v1/auth/reset-password  - Reset mật khẩu
```

### Protected Endpoints (Cần xác thực)

```
POST /api/v1/auth/logout       - Đăng xuất
POST /api/v1/auth/refresh      - Refresh token
PUT  /api/v1/auth/change-password - Đổi mật khẩu
GET  /api/v1/auth/profile      - Xem profile
PUT  /api/v1/auth/profile      - Cập nhật profile
```

### User Endpoints

```
GET  /api/v1/users/profile     - Xem profile
PUT  /api/v1/users/profile     - Cập nhật profile
PUT  /api/v1/users/change-password - Đổi mật khẩu
```

### Admin Only Endpoints

```
GET  /api/v1/auth/admin/users  - Xem tất cả users (Admin)
GET  /api/v1/auth/admin/stats  - Xem thống kê (Admin)
GET  /api/v1/users/admin/all   - Xem tất cả users (Admin)
```

## Cài đặt và Cấu hình

### 1. Cài đặt dependencies

```bash
npm install @nestjs/jwt @nestjs/passport passport passport-jwt passport-local @nestjs/config
```

### 2. Tạo file .env

```bash
cp env.example .env
```

Cập nhật các giá trị trong file `.env`:

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
```

### 3. Khởi động ứng dụng

```bash
npm run dev
```

## Sử dụng

### 1. Đăng ký tài khoản

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123!",
    "name": "John Doe",
    "phone": "0123456789"
  }'
```

### 2. Đăng nhập

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123!"
  }'
```

Response sẽ chứa `accessToken` và `refreshToken`.

### 3. Sử dụng API được bảo vệ

```bash
curl -X GET http://localhost:3000/api/v1/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 4. Refresh Token

```bash
curl -X POST http://localhost:3000/api/v1/auth/refresh \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Bảo mật

### JWT Configuration

- **Secret Key**: Sử dụng biến môi trường `JWT_SECRET`
- **Access Token**: Hết hạn sau 1 giờ (có thể cấu hình)
- **Refresh Token**: Hết hạn sau 7 ngày (có thể cấu hình)

### Password Security

- Mật khẩu được hash bằng bcrypt với salt rounds = 10
- Validation mật khẩu: ít nhất 8 ký tự, chứa chữ hoa, chữ thường, số và ký tự đặc biệt

### Role-based Access Control

- **CUSTOMER**: Người dùng thông thường
- **ADMIN**: Quản trị viên với quyền truy cập đầy đủ

## Guards và Decorators

### @Public()

Đánh dấu route không cần xác thực:

```typescript
@Public()
@Post('login')
async login() { ... }
```

### @Roles()

Chỉ định quyền truy cập:

```typescript
@Roles(UserRole.ADMIN)
@Get('admin/users')
async getAllUsers() { ... }
```

### JwtAuthGuard

Bảo vệ route cần xác thực:

```typescript
@UseGuards(JwtAuthGuard)
@Get('profile')
async getProfile() { ... }
```

### RolesGuard

Kiểm tra quyền truy cập:

```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Get('admin/stats')
async getStats() { ... }
```

## Database Models

### User Model

```typescript
{
  id: number;
  email: string;
  password: string;
  name: string;
  avatar?: string;
  phone?: string;
  role: UserRole;
  provider?: string;
}
```

### UserRole Enum

```typescript
enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
}
```

## Error Handling

Hệ thống sử dụng global exception filter để xử lý lỗi một cách nhất quán:

- **400 Bad Request**: Dữ liệu đầu vào không hợp lệ
- **401 Unauthorized**: Token không hợp lệ hoặc hết hạn
- **403 Forbidden**: Không có quyền truy cập
- **404 Not Found**: Tài nguyên không tồn tại
- **409 Conflict**: Email đã tồn tại

## Swagger Documentation

API documentation có sẵn tại: `http://localhost:3000/api/v1`

- Sử dụng `@ApiBearerAuth('JWT-auth')` để bảo vệ endpoints
- Tất cả DTOs được validate và documented
- Bearer token authentication được cấu hình sẵn

## Testing

### Unit Tests

```bash
npm run test
```

### E2E Tests

```bash
npm run test:e2e
```

## Deployment

### Production

```bash
npm run build
npm run start:prod
```

### Environment Variables

Đảm bảo cấu hình đúng các biến môi trường trong production:

- `JWT_SECRET`: Secret key mạnh và duy nhất
- `JWT_EXPIRES_IN`: Thời gian hết hạn token phù hợp
- `NODE_ENV`: Đặt là `production`

## Lưu ý

1. **JWT Secret**: Luôn sử dụng secret key mạnh và duy nhất trong production
2. **Token Expiration**: Cấu hình thời gian hết hạn token phù hợp với yêu cầu bảo mật
3. **Password Reset**: Chức năng reset mật khẩu hiện tại là placeholder, cần implement email service
4. **Token Blacklisting**: Có thể implement token blacklisting để tăng cường bảo mật
5. **Rate Limiting**: Cân nhắc thêm rate limiting cho các endpoints authentication

## Hỗ trợ

Nếu có vấn đề hoặc câu hỏi, vui lòng tạo issue hoặc liên hệ team development.
