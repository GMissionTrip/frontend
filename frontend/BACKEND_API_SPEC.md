# 둘러보기 (Others Journey) 백엔드 API 스펙

## 🎯 개요
사용자들이 여행 게시물을 공유하고, 좋아요, 댓글, 북마크, 신고 등의 기능을 사용할 수 있는 API입니다.

---

## 📝 API 엔드포인트

### 1. 게시물 목록 조회
```
GET /api/journey/posts
```

**Query Parameters:**
- `type`: "feed" | "popular" (기본값: "feed")
- `page`: number (기본값: 1)
- `limit`: number (기본값: 10)

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "userId": "string",
      "user": {
        "id": "string",
        "nickname": "string",
        "profileImage": "string?",
        "level": number,
        "gender": "male" | "female"
      },
      "title": "string",
      "content": "string",
      "location": "string",
      "tags": ["string"],
      "images": ["string"],
      "likes": number,
      "comments": number,
      "views": number,
      "isLiked": boolean,
      "isBookmarked": boolean,
      "createdAt": "ISO 8601",
      "updatedAt": "ISO 8601"
    }
  ]
}
```

---

### 2. 게시물 상세 조회
```
GET /api/journey/posts/:postId
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "userId": "string",
    "user": { },
    "title": "string",
    "content": "string",
    "location": "string",
    "tags": ["string"],
    "images": ["string"],
    "likes": number,
    "comments": number,
    "views": number,
    "isLiked": boolean,
    "isBookmarked": boolean,
    "createdAt": "ISO 8601",
    "updatedAt": "ISO 8601"
  }
}
```

**참고**: 이 API 호출 시 조회수가 자동으로 1 증가합니다.

---

### 3. 좋아요 토글
```
POST /api/journey/posts/:postId/like
```

**Request Body:** 없음

**Response 200:**
```json
{
  "success": true,
  "data": {
    "isLiked": boolean,
    "likes": number
  }
}
```

**로직**:
- 이미 좋아요를 누른 경우: 좋아요 취소 (likes -1)
- 좋아요를 누르지 않은 경우: 좋아요 추가 (likes +1)

---

### 4. 북마크 토글
```
POST /api/journey/posts/:postId/bookmark
```

**Request Body:** 없음

**Response 200:**
```json
{
  "success": true,
  "data": {
    "isBookmarked": boolean
  }
}
```

---

### 5. 댓글 목록 조회
```
GET /api/journey/posts/:postId/comments
```

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "postId": "string",
      "userId": "string",
      "user": {
        "id": "string",
        "nickname": "string",
        "profileImage": "string?",
        "level": number
      },
      "content": "string",
      "likes": number,
      "isLiked": boolean,
      "createdAt": "ISO 8601",
      "updatedAt": "ISO 8601"
    }
  ]
}
```

---

### 6. 댓글 작성
```
POST /api/journey/comments
```

**Request Body:**
```json
{
  "postId": "string",
  "content": "string"
}
```

**Validation:**
- `content`: 1자 이상, 500자 이하

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "postId": "string",
    "userId": "string",
    "user": { },
    "content": "string",
    "likes": 0,
    "isLiked": false,
    "createdAt": "ISO 8601",
    "updatedAt": "ISO 8601"
  }
}
```

---

### 7. 댓글 삭제
```
DELETE /api/journey/comments/:commentId
```

**Response 200:**
```json
{
  "success": true,
  "message": "댓글이 삭제되었습니다."
}
```

**권한**:
- 댓글 작성자 본인만 삭제 가능
- 관리자는 모든 댓글 삭제 가능

---

### 8. 댓글 좋아요 토글
```
POST /api/journey/comments/:commentId/like
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "isLiked": boolean,
    "likes": number
  }
}
```

---

### 9. 게시물 신고
```
POST /api/journey/reports
```

**Request Body:**
```json
{
  "postId": "string",
  "reason": "inappropriate" | "spam" | "harassment" | "fake" | "other",
  "description": "string?"
}
```

**Validation:**
- `reason`: 필수
- `description`: 선택, 최대 500자

**Response 201:**
```json
{
  "success": true,
  "message": "신고가 접수되었습니다."
}
```

**참고**:
- 중복 신고 방지: 동일 사용자가 동일 게시물에 대해 중복 신고 불가
- 신고 누적 시 게시물 자동 숨김 처리 (예: 5회 이상)

---

### 10. 내 아카이브에 추가
```
POST /api/journey/archive/add
```

**Request Body:**
```json
{
  "postId": "string",
  "archiveId": "string?"
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "아카이브에 추가되었습니다."
}
```

**로직**:
- `archiveId`가 없으면 기본 아카이브에 추가
- `archiveId`가 있으면 해당 아카이브에 추가
- 게시물의 스냅샷을 저장 (원본 게시물이 삭제되어도 아카이브에는 남음)

---

## 🗄️ 데이터베이스 스키마

### posts (게시물)
```sql
CREATE TABLE posts (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  location VARCHAR(100) NOT NULL,
  tags JSON,
  images JSON,
  likes INT DEFAULT 0,
  comments INT DEFAULT 0,
  views INT DEFAULT 0,
  status ENUM('active', 'hidden', 'deleted') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### post_likes (게시물 좋아요)
```sql
CREATE TABLE post_likes (
  id VARCHAR(36) PRIMARY KEY,
  post_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_like (post_id, user_id),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### comments (댓글)
```sql
CREATE TABLE comments (
  id VARCHAR(36) PRIMARY KEY,
  post_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  content TEXT NOT NULL,
  likes INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### comment_likes (댓글 좋아요)
```sql
CREATE TABLE comment_likes (
  id VARCHAR(36) PRIMARY KEY,
  comment_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_comment_like (comment_id, user_id),
  FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### bookmarks (북마크)
```sql
CREATE TABLE bookmarks (
  id VARCHAR(36) PRIMARY KEY,
  post_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_bookmark (post_id, user_id),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### reports (신고)
```sql
CREATE TABLE reports (
  id VARCHAR(36) PRIMARY KEY,
  post_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  reason ENUM('inappropriate', 'spam', 'harassment', 'fake', 'other') NOT NULL,
  description TEXT,
  status ENUM('pending', 'reviewed', 'resolved') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### archive_posts (아카이브 게시물)
```sql
CREATE TABLE archive_posts (
  id VARCHAR(36) PRIMARY KEY,
  archive_id VARCHAR(36),
  user_id VARCHAR(36) NOT NULL,
  original_post_id VARCHAR(36),
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  location VARCHAR(100),
  tags JSON,
  images JSON,
  snapshot_data JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## 🔐 인증 및 권한

모든 API는 JWT 인증이 필요합니다.

**Request Header:**
```
Authorization: Bearer {JWT_TOKEN}
```

**권한 규칙:**
- 게시물 조회: 모든 사용자
- 좋아요, 북마크, 댓글 작성: 로그인한 사용자
- 댓글 삭제: 작성자 본인 또는 관리자
- 게시물 신고: 로그인한 사용자 (중복 신고 방지)

---

## 📊 추가 기능 제안

1. **인기 게시물 알고리즘**:
   ```
   score = (likes * 2) + (comments * 3) + (views * 0.1) - (age_in_hours * 0.5)
   ```

2. **실시간 알림**:
   - 내 게시물에 좋아요/댓글이 달리면 푸시 알림
   - WebSocket 또는 Server-Sent Events 사용

3. **이미지 업로드**:
   - S3 또는 CloudFront 사용
   - 이미지 리사이징 및 최적화

4. **태그 자동 추천**:
   - 위치 기반 인기 태그 추천
   - 과거 작성한 게시물의 태그 분석

---

## 🧪 테스트 케이스

1. **좋아요 토글**:
   - 좋아요 추가 시 likes +1, isLiked true
   - 좋아요 취소 시 likes -1, isLiked false
   - 중복 좋아요 방지

2. **댓글 작성**:
   - 정상 댓글 작성
   - 빈 댓글 작성 시 에러
   - 500자 초과 시 에러

3. **신고**:
   - 신고 접수 성공
   - 중복 신고 방지
   - 5회 신고 시 자동 숨김

4. **조회수**:
   - 게시물 상세 조회 시 views +1
   - 동일 사용자 중복 조회 시 조회수 증가 안 함 (선택)

---

이 스펙을 기반으로 백엔드 개발을 진행하시면 됩니다! 🚀

