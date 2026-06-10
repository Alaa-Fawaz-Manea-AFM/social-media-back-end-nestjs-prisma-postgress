import AuthDecorator from './decorator/auth.decorator';
import { Controller, Get, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import * as os from 'os';

@Controller('')
export class HomeController {
  constructor(private configService: ConfigService) {}

  @AuthDecorator()
  @Get()
  getDocs(@Res() res: Response) {
    const nonce = res.locals.nonce;
    const BASE_URL =
      this.configService.get('API_URL') || 'http://localhost:3000';
    const serverStatus = this.getServerStatus();

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Social Media API Documentation</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        :root {
            --primary: #4f46e5;
            --primary-dark: #4338ca;
            --secondary: #10b981;
            --danger: #ef4444;
            --warning: #f59e0b;
            --info: #3b82f6;
            --dark: #1f2937;
            --light: #f9fafb;
            --border: #e5e7eb;
            --code-bg: #1e293b;
            --text-muted: #6b7280;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; background: var(--light); color: var(--dark); line-height: 1.5; }
        .container { max-width: 1400px; margin: 0 auto; padding: 2rem; }
        .header {
            background: white;
            border-bottom: 1px solid var(--border);
            padding: 1rem 2rem;
            position: sticky;
            top: 0;
            z-index: 100;
            backdrop-filter: blur(8px);
            background: rgba(255,255,255,0.95);
        }
        .header-content {
            max-width: 1400px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 1rem;
        }
        .logo h1 {
            font-size: 1.5rem;
            font-weight: 700;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .status {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            background: var(--light);
            padding: 0.5rem 1rem;
            border-radius: 2rem;
            font-size: 0.875rem;
        }
        .status-badge {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: var(--secondary);
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.2); }
            100% { opacity: 1; transform: scale(1); }
        }
        .base-url {
            font-family: monospace;
            background: var(--light);
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            font-size: 0.875rem;
        }
        .main { display: flex; gap: 2rem; margin-top: 2rem; }
        .sidebar {
            width: 280px;
            flex-shrink: 0;
            position: sticky;
            top: 90px;
            height: fit-content;
            background: white;
            border-radius: 1rem;
            padding: 1.5rem;
            border: 1px solid var(--border);
        }
        .sidebar nav ul { list-style: none; }
        .sidebar nav ul li { margin-bottom: 0.5rem; }
        .sidebar nav ul li a {
            text-decoration: none;
            color: var(--dark);
            display: block;
            padding: 0.5rem 0.75rem;
            border-radius: 0.5rem;
            transition: all 0.2s;
            font-weight: 500;
        }
        .sidebar nav ul li a:hover { background: var(--light); color: var(--primary); }
        .content { flex: 1; min-width: 0; }
        .section {
            background: white;
            border-radius: 1rem;
            border: 1px solid var(--border);
            margin-bottom: 2rem;
            overflow: hidden;
        }
        .section-header {
            padding: 1rem 1.5rem;
            background: white;
            border-bottom: 1px solid var(--border);
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: 600;
            font-size: 1.25rem;
        }
        .section-header:hover { background: var(--light); }
        .section-content { padding: 1.5rem; }
        .section-content.collapsed { display: none; }
        .endpoint {
            margin-bottom: 2rem;
            border-left: 3px solid var(--border);
            padding-left: 1rem;
        }
        .endpoint-method {
            display: inline-block;
            font-weight: 700;
            padding: 0.25rem 0.75rem;
            border-radius: 0.375rem;
            font-size: 0.75rem;
            margin-right: 0.75rem;
        }
        .method-get { background: #d1fae5; color: #065f46; }
        .method-post { background: #fed7aa; color: #92400e; }
        .method-put { background: #fef3c7; color: #b45309; }
        .method-patch { background: #c7d2fe; color: #3730a3; }
        .method-delete { background: #fee2e2; color: #991b1b; }
        .endpoint-path { font-family: monospace; font-size: 1rem; font-weight: 500; }
        .endpoint-desc { color: var(--text-muted); margin: 0.5rem 0; font-size: 0.875rem; }
        .details { margin-top: 1rem; }
        .details summary { cursor: pointer; font-weight: 500; color: var(--primary); margin-bottom: 0.5rem; }
        pre {
            background: var(--code-bg);
            color: #e2e8f0;
            padding: 1rem;
            border-radius: 0.5rem;
            overflow-x: auto;
            font-size: 0.875rem;
            margin: 0.5rem 0;
            position: relative;
        }
        .copy-btn {
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            background: #334155;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 0.75rem;
            padding: 0.25rem 0.5rem;
            border-radius: 0.25rem;
        }
        .copy-btn:hover { background: #475569; }
        .badge {
            display: inline-block;
            background: var(--light);
            padding: 0.25rem 0.5rem;
            border-radius: 0.375rem;
            font-size: 0.75rem;
            font-weight: 500;
            margin-right: 0.5rem;
        }
        footer {
            text-align: center;
            margin-top: 3rem;
            padding: 1.5rem;
            color: var(--text-muted);
            font-size: 0.875rem;
            border-top: 1px solid var(--border);
        }
        @media (max-width: 768px) {
            .main { flex-direction: column; }
            .sidebar { width: 100%; position: static; margin-bottom: 1rem; }
            .container { padding: 1rem; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="header-content">
            <div class="logo"><h1><i class="fas fa-hashtag"></i> Social Media API</h1></div>
            <div class="status"><span class="status-badge"></span><span>Server: ${serverStatus.status}</span><span>Uptime: ${serverStatus.uptime}</span></div>
            <div class="base-url"><i class="fas fa-link"></i> Base URL: <code>${BASE_URL}</code></div>
        </div>
    </div>
    <div class="container">
        <div class="main">
            <aside class="sidebar">
                <nav><ul>
                    <li><a href="#auth">🔐 Authentication</a></li>
                    <li><a href="#users">👥 Users</a></li>
                    <li><a href="#posts">📝 Posts</a></li>
                    <li><a href="#likes">❤️ Likes</a></li>
                    <li><a href="#followers">👥 Followers</a></li>
                    <li><a href="#saves">💾 Saves</a></li>
                    <li><a href="#common">📦 Common & Errors</a></li>
                </ul></nav>
            </aside>
            <main class="content">
                <!-- ==================== AUTH ==================== -->
                <div class="section" id="auth">
                    <div class="section-header" onclick="toggleSection(this)">
                        <span><i class="fas fa-key"></i> Authentication</span><i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="section-content">
                        <div class="endpoint"><div><span class="endpoint-method method-post">POST</span><span class="endpoint-path">/auth/signup</span></div><div class="endpoint-desc">Create a new account. Returns user profile and sets <code>accessToken</code> cookie.</div><details class="details"><summary>Request & Response</summary><p><strong>Request Body:</strong></p><pre><code>{
  "name": "John Doe",
  "userName": "johndoe",
  "bio": "Software developer",
  "email": "john@example.com",
  "password": "StrongPass123"
}</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre><p><strong>Response (201):</strong></p><pre><code>{
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "userName": "johndoe",
    "bio": "Software developer"
  },
  "message": "Logged in successfully"
}</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre><p><strong>cURL:</strong></p><pre><code>curl -X POST '${BASE_URL}/auth/signup' -H 'Content-Type: application/json' -d '{"name":"John Doe","userName":"johndoe","bio":"Software developer","email":"john@example.com","password":"StrongPass123"}'</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre></details></div>
                        <div class="endpoint"><div><span class="endpoint-method method-post">POST</span><span class="endpoint-path">/auth/login</span></div><div class="endpoint-desc">Login with email and password. Returns user profile and sets cookie.</div><details class="details"><summary>Request & Response</summary><pre><code>{"email":"john@example.com","password":"StrongPass123"}</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre><pre><code>{
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "userName": "johndoe",
    "bio": "Software developer"
  },
  "message": "Logged in successfully"
}</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre></details></div>
                        <div class="endpoint"><div><span class="endpoint-method method-post">POST</span><span class="endpoint-path">/auth/logout</span><span class="badge">🔒 Auth required</span></div><div class="endpoint-desc">Clear authentication cookies.</div><details class="details"><summary>Response</summary><pre><code>{"data":null,"message":"Logged out successfully"}</code></pre></details></div>
                        <div class="endpoint"><div><span class="endpoint-method method-patch">PATCH</span><span class="endpoint-path">/auth/change-password</span><span class="badge">🔒 Auth required</span></div><div class="endpoint-desc">Change password (old password must be valid, new one must be strong).</div><details class="details"><summary>Request body</summary><pre><code>{"oldPassword":"StrongPass123","newPassword":"NewStrongPass456"}</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre></details></div>
                        <div class="endpoint"><div><span class="endpoint-method method-get">GET</span><span class="endpoint-path">/auth/me</span><span class="badge">🔒 Auth required</span></div><div class="endpoint-desc">Get basic profile of the authenticated user.</div><details class="details"><summary>Response</summary><pre><code>{
  "data": { "id": "uuid", "name": "...", "userName": "...", "bio": "..." },
  "message": "User data successfully"
}</code></pre></details></div>
                        <div class="endpoint"><div><span class="endpoint-method method-get">GET</span><span class="endpoint-path">/auth/profile</span><span class="badge">🔒 Auth required</span></div><div class="endpoint-desc">Get full profile including post counts, follower counts, and latest 2 posts.</div><details class="details"><summary>Response</summary><pre><code>{
  "data": {
    "user": { "id": "...", "name": "...", "postCounts": 5, "followerCounts": 10, ... },
    "posts": [{ "id": "...", "imageUrl": "...", "likeCounts": 3, ... }]
  },
  "message": "User data successfully"
}</code></pre></details></div>
                    </div>
                </div>

                <!-- ==================== USERS ==================== -->
                <div class="section" id="users">
                    <div class="section-header" onclick="toggleSection(this)">
                        <span><i class="fas fa-users"></i> Users</span><i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="section-content">
                        <div class="endpoint"><div><span class="endpoint-method method-get">GET</span><span class="endpoint-path">/users</span></div><div class="endpoint-desc">Get all users (paginated, excludes current user if authenticated). Query: <code>?page=1&limit=10</code></div><details class="details"><summary>Example response</summary><pre><code>{
  "data": {
    "meta": { "limit": 10, "totalPage": 5 },
    "users": [{ "id": "...", "name": "...", "userName": "...", "isFollow": false }]
  },
  "message": "Get All Users successfully"
}</code></pre></details></div>
                        <div class="endpoint"><div><span class="endpoint-method method-get">GET</span><span class="endpoint-path">/users/:userId</span></div><div class="endpoint-desc">Get user profile by ID, including follow status (if authenticated) and user's posts.</div><details class="details"><summary>Response</summary><pre><code>{
  "data": {
    "user": { "id": "...", "name": "...", "isFollow": false },
    "posts": [{ "id": "...", "imageUrl": "...", "likeCounts": 0, "isLiked": false, "isSaved": false }]
  },
  "message": "User retrieved successfully"
}</code></pre></details></div>
                        <div class="endpoint"><div><span class="endpoint-method method-patch">PATCH</span><span class="endpoint-path">/users</span><span class="badge">🔒 Auth required</span></div><div class="endpoint-desc">Update own profile (name, userName, bio).</div><details class="details"><summary>Request body (partial)</summary><pre><code>{ "name": "New Name", "bio": "Updated bio" }</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre><p><strong>Response:</strong> <code>{"data":null,"message":"User updated successfully"}</code></p></details></div>
                        <div class="endpoint"><div><span class="endpoint-method method-delete">DELETE</span><span class="endpoint-path">/users</span><span class="badge">🔒 Auth required</span></div><div class="endpoint-desc">Delete own account permanently.</div><details class="details"><summary>Response</summary><pre><code>{"data":null,"message":"User deleted successfully"}</code></pre></details></div>
                    </div>
                </div>

                <!-- ==================== POSTS ==================== -->
                <div class="section" id="posts">
                    <div class="section-header" onclick="toggleSection(this)">
                        <span><i class="fas fa-newspaper"></i> Posts</span><i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="section-content">
                        <div class="endpoint"><div><span class="endpoint-method method-get">GET</span><span class="endpoint-path">/posts/home-page</span><span class="badge">🔒 Auth required</span></div><div class="endpoint-desc">Feed with cursor pagination. Query: <code>?curseId=uuid&limit=3&targetUserId=optional</code></div><details class="details"><summary>Example response</summary><pre><code>{
  "data": {
    "meta": { "curseId": "next-uuid" },
    "posts": [{ "id": "...", "caption": "...", "isLiked": false, "isSaved": true }]
  },
  "message": "Posts retrieved successfully"
}</code></pre></details></div>
                        <div class="endpoint"><div><span class="endpoint-method method-get">GET</span><span class="endpoint-path">/posts</span></div><div class="endpoint-desc">Get all posts with pagination and optional search by caption. Query: <code>?page=1&limit=9&caption=hello</code></div><details class="details"><summary>Response</summary><pre><code>{
  "data": {
    "meta": { "totalPage": 5 },
    "posts": [/* posts with isLiked/isSaved */]
  },
  "message": "Posts retrieved successfully"
}</code></pre></details></div>
                        <div class="endpoint"><div><span class="endpoint-method method-get">GET</span><span class="endpoint-path">/posts/:postId/:userId</span></div><div class="endpoint-desc">Get a single post and 6 more posts from the same user (includes like/save status if authenticated).</div><details class="details"><summary>Response</summary><pre><code>{
  "data": {
    "post": { "id": "...", "caption": "...", "isLiked": false, "isSaved": false, "user": {...} },
    "posts": [/* related posts */]
  }
}</code></pre></details></div>
                        <div class="endpoint"><div><span class="endpoint-method method-post">POST</span><span class="endpoint-path">/posts</span><span class="badge">🔒 Auth required</span></div><div class="endpoint-desc">Create a new post (image from Cloudinary).</div><details class="details"><summary>Request body (JSON)</summary><pre><code>{
  "caption": "My awesome photo",
  "imageUrl": "https://cloudinary.com/image.jpg",
  "public_id": "cloudinary_public_id"
}</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre><p><strong>Response:</strong> <code>{"data": {...post}, "message": "Post created successfully"}</code></p></details></div>
                        <div class="endpoint"><div><span class="endpoint-method method-patch">PATCH</span><span class="endpoint-path">/posts/:postId</span><span class="badge">🔒 Auth required (owner only)</span></div><div class="endpoint-desc">Update post caption, imageUrl, public_id.</div><details class="details"><summary>Partial update</summary><pre><code>{"caption": "New caption"}</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre></details></div>
                        <div class="endpoint"><div><span class="endpoint-method method-delete">DELETE</span><span class="endpoint-path">/posts/:postId</span><span class="badge">🔒 Auth required (owner only)</span></div><div class="endpoint-desc">Delete a post (also removes from Cloudinary).</div><details class="details"><summary>Response</summary><pre><code>{"data":null,"message":"Post deleted successfully"}</code></pre></details></div>
                    </div>
                </div>

                <!-- ==================== LIKES ==================== -->
                <div class="section" id="likes">
                    <div class="section-header" onclick="toggleSection(this)">
                        <span><i class="fas fa-heart"></i> Likes</span><i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="section-content">
                        <div class="endpoint"><div><span class="endpoint-method method-get">GET</span><span class="endpoint-path">/likes</span><span class="badge">🔒 Auth required</span></div><div class="endpoint-desc">Get all posts liked by the current user (with post details).</div><details class="details"><summary>Response</summary><pre><code>{
  "data": [{ "post": { "id": "...", "caption": "...", "imageUrl": "..." } }],
  "message": "Get All Liked Successfully"
}</code></pre></details></div>
                        <div class="endpoint"><div><span class="endpoint-method method-post">POST</span><span class="endpoint-path">/likes/:id</span><span class="badge">🔒 Auth required</span></div><div class="endpoint-desc">Toggle like on a post (add or remove). Returns boolean and message.</div><details class="details"><summary>Response</summary><pre><code>{ "data": true, "message": "Post liked successfully" }</code></pre></details></div>
                    </div>
                </div>

                <!-- ==================== FOLLOWERS ==================== -->
                <div class="section" id="followers">
                    <div class="section-header" onclick="toggleSection(this)">
                        <span><i class="fas fa-user-plus"></i> Followers</span><i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="section-content">
                        <div class="endpoint"><div><span class="endpoint-method method-post">POST</span><span class="endpoint-path">/followers/:targetUserId</span><span class="badge">🔒 Auth required</span></div><div class="endpoint-desc">Follow or unfollow a user. Updates follower/following counts.</div><details class="details"><summary>Response</summary><pre><code>{ "data": true, "message": "User followed successfully" }</code></pre></details></div>
                    </div>
                </div>

                <!-- ==================== SAVES ==================== -->
                <div class="section" id="saves">
                    <div class="section-header" onclick="toggleSection(this)">
                        <span><i class="fas fa-bookmark"></i> Saves</span><i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="section-content">
                        <div class="endpoint"><div><span class="endpoint-method method-get">GET</span><span class="endpoint-path">/saves</span><span class="badge">🔒 Auth required</span></div><div class="endpoint-desc">Get saved posts (paginated). Query: <code>?page=1&limit=9</code></div><details class="details"><summary>Response</summary><pre><code>{
  "data": {
    "meta": { "totalPage": 2 },
    "saved": [{ "post": { "id": "...", "caption": "...", "imageUrl": "...", "user": {...} } }]
  },
  "message": "Get All Saved Suuccessfully"
}</code></pre></details></div>
                        <div class="endpoint"><div><span class="endpoint-method method-post">POST</span><span class="endpoint-path">/saves/:id</span><span class="badge">🔒 Auth required</span></div><div class="endpoint-desc">Save or unsave a post.</div><details class="details"><summary>Response</summary><pre><code>{ "data": true, "message": "Post saved successfully" }</code></pre></details></div>
                    </div>
                </div>

                <!-- ==================== COMMON & ERRORS ==================== -->
                <div class="section" id="common">
                    <div class="section-header" onclick="toggleSection(this)">
                        <span><i class="fas fa-cubes"></i> Common DTOs & Error Handling</span><i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="section-content">
                        <h4>Standard Response Format</h4>
                        <pre><code>{ "data": any | null, "message": string }</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre>
                        <h4>Authentication</h4>
                        <p>All endpoints marked with <span class="badge">🔒 Auth required</span> expect a valid <code>accessToken</code> cookie (HttpOnly, SameSite=Strict, Secure in production). The cookie is automatically set after login/signup.</p>
                        <h4>Common HTTP Errors</h4>
                        <ul>
                            <li><strong>400 Bad Request</strong> – Validation error, email already exists, weak password, etc.</li>
                            <li><strong>401 Unauthorized</strong> – Missing or invalid token.</li>
                            <li><strong>404 Not Found</strong> – User or post not found.</li>
                        </ul>
                        <h4>Important DTOs</h4>
                        <ul>
                            <li><strong>SignUpAuthDto</strong> – name, userName, bio, email, password</li>
                            <li><strong>CreatePostDto</strong> – caption, imageUrl, public_id</li>
                            <li><strong>CurseDto</strong> – cursorId, targetUserId, limit (for pagination)</li>
                            <li><strong>QuerySearchDto</strong> – page, limit, caption (search)</li>
                        </ul>
                    </div>
                </div>
            </main>
        </div>
        <footer><p>Social Media API v1 | Documentation generated from source code | © ${new Date().getFullYear()}</p></footer>
    </div>
    <script nonce="${nonce}">
        function toggleSection(header) {
            const content = header.nextElementSibling;
            content.classList.toggle('collapsed');
            const icon = header.querySelector('i:last-child');
            icon.classList.toggle('fa-chevron-down');
            icon.classList.toggle('fa-chevron-right');
        }

        function copyToClipboard(btn) {
            const pre = btn.closest('pre');
            if (pre) {
                const code = pre.querySelector('code');
                const text = code ? code.innerText : pre.innerText;
                navigator.clipboard.writeText(text).then(() => {
                    btn.innerHTML = '✓ Copied!';
                    setTimeout(() => btn.innerHTML = 'Copy', 2000);
                }).catch(err => {
                    alert('Failed to copy. Select and copy manually.');
                });
            }
        }

        window.toggleSection = toggleSection;
        window.copyToClipboard = copyToClipboard;

        // Smooth sidebar navigation
        document.querySelectorAll('.sidebar a').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const target = document.getElementById(targetId);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                    history.pushState(null, null, '#' + targetId);
                }
            });
        });

        // Dark mode toggle
        const darkToggle = document.createElement('button');
        darkToggle.innerHTML = '<i class="fas fa-moon"></i> Dark mode';
        darkToggle.className = 'status';
        darkToggle.style.cursor = 'pointer';
        darkToggle.style.marginLeft = '10px';
        document.querySelector('.header-content').appendChild(darkToggle);
        darkToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark');
            localStorage.setItem('darkMode', document.body.classList.contains('dark'));
            darkToggle.innerHTML = document.body.classList.contains('dark') ? '<i class="fas fa-sun"></i> Light mode' : '<i class="fas fa-moon"></i> Dark mode';
        });
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark');
            darkToggle.innerHTML = '<i class="fas fa-sun"></i> Light mode';
        }
    </script>
</body>
</html>`;
    res.send(html);
  }

  private getServerStatus() {
    const uptime = os.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    return {
      status: 'online',
      uptime: `${days}d ${hours}h ${minutes}m`,
      timestamp: new Date().toISOString(),
      nodeVersion: process.version,
      env: process.env.NODE_ENV || 'development',
    };
  }
}
