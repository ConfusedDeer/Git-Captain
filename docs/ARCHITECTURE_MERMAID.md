# Git-Captain v2.0 Architecture Diagrams

## 🏗️ High-Level System Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        Browser[🌐 Browser Client]
        UI[📱 User Interface]
    end
    
    subgraph "Network Layer"
        Proxy[🔄 Reverse Proxy - nginx/Apache/ALB]
        SSL[🔒 SSL/TLS]
    end
    
    subgraph "Application Layer"
        App[⚙️ Node.js Application - Port 3000]
        
        subgraph "Security Middleware"
            Rate[🚦 Rate Limiter - 200/min, 300/5min]
            CORS[🌐 CORS Protection]
            Helmet[🛡️ Security Headers]
            Validation[✅ Input Validation]
        end
        
        subgraph "Core Components"
            Router[🔀 Express Router]
            Auth[🔐 OAuth Handler]
            Branch[🌿 Branch Manager]
            PR[📋 PR Manager]
            Static[📁 Static Files]
        end
        
        subgraph "Infrastructure"
            HTTP[🌐 HTTP Client<br/>Axios]
            Logger[📝 Winston Logger]
            Config[⚙️ Configuration]
            Middleware[🔧 Middleware Stack]
        end
    end
    
    subgraph "External Services"
        GitHub[🐙 GitHub API]
        OAuth[🔑 GitHub OAuth]
    end
    
    Browser --> Proxy
    Proxy --> SSL
    SSL --> App
    App --> Rate
    Rate --> CORS
    CORS --> Helmet
    Helmet --> Validation
    Validation --> Router
    Router --> Auth
    Router --> Branch
    Router --> PR
    Router --> Static
    Auth --> HTTP
    Branch --> HTTP
    PR --> HTTP
    HTTP --> GitHub
    HTTP --> OAuth
    
    classDef client fill:#e1f5fe
    classDef security fill:#fff3e0
    classDef core fill:#f3e5f5
    classDef external fill:#e8f5e8
    
    class Browser,UI client
    class Rate,CORS,Helmet,Validation security
    class Router,Auth,Branch,PR,Static,HTTP,Logger,Config,Middleware core
    class GitHub,OAuth external
```

## 🔄 Request Flow Architecture

```mermaid
sequenceDiagram
    participant U as 👤 User
    participant B as 🌐 Browser
    participant S as 🛡️ Security Layer
    participant A as ⚙️ Application
    participant G as 🐙 GitHub API
    
    U->>B: Click "Search Branches"
    B->>S: HTTPS Request
    S->>S: Rate Limiting Check
    S->>S: CORS Validation
    S->>S: Security Headers
    S->>S: Input Validation
    S->>A: Validated Request
    A->>A: Route to Handler
    A->>G: GitHub API Call
    G-->>A: API Response
    A->>A: Format Response
    A-->>S: JSON Response
    S-->>B: Secure Response
    B->>B: Update UI
    B-->>U: Display Results
```

## 🔒 Security Layer Architecture

```mermaid
graph TD
    Internet[🌍 Internet Traffic] --> Layer1
    
    subgraph "Security Layers"
        Layer1[🔒 Layer 1: Network Security<br/>• HTTPS/TLS<br/>• SSL Certificates<br/>• Port Restrictions]
        Layer2[🚦 Layer 2: Rate Limiting<br/>• 200 req/min General<br/>• 300 req/5min Auth<br/>• 25 req/5min Sensitive]
        Layer3[🌐 Layer 3: CORS Protection<br/>• Origin Validation<br/>• Method Restrictions<br/>• Credential Handling]
        Layer4[🛡️ Layer 4: Security Headers<br/>• Content Security Policy<br/>• X-Frame-Options<br/>• HSTS]
        Layer5[✅ Layer 5: Input Validation<br/>• Schema Validation<br/>• Input Sanitization<br/>• Type Checking]
        Layer6[🔐 Layer 6: Application Logic<br/>• OAuth Validation<br/>• Session Management<br/>• Audit Logging]
    end
    
    Application[⚙️ Application Core]
    
    Layer1 --> Layer2
    Layer2 --> Layer3
    Layer3 --> Layer4
    Layer4 --> Layer5
    Layer5 --> Layer6
    Layer6 --> Application
    
    classDef security fill:#ffebee
    class Layer1,Layer2,Layer3,Layer4,Layer5,Layer6 security
```

## 🌐 OAuth 2.0 Flow

```mermaid
sequenceDiagram
    participant U as 👤 User
    participant B as 🌐 Browser
    participant A as ⚙️ Git-Captain
    participant G as 🐙 GitHub OAuth
    participant API as 📡 GitHub API
    
    U->>B: Click "Login with GitHub"
    B->>G: Redirect to GitHub OAuth
    G->>U: Show Authorization Page
    U->>G: Grant Permission
    G->>B: Redirect with code
    Note over B: /authenticated.html?code=xyz123
    B->>A: POST /getToken with code
    A->>G: Exchange code for token
    G-->>A: Return access_token
    A-->>B: Return token to client
    B->>B: Store token in memory
    
    loop API Operations
        B->>A: API Request + token
        A->>API: GitHub API Call + token
        API-->>A: API Response
        A-->>B: Formatted Response
        B->>B: Update UI
    end
```

## 🗂️ Component Architecture

```mermaid
graph TB
    subgraph "Frontend (Browser)"
        HTML[📄 HTML Templates]
        CSS[🎨 CSS Styles]
        JS[📜 JavaScript Modules]
        
        subgraph "JS Modules"
            Tools[🔧 tools.js<br/>• AJAX calls<br/>• Auth management]
            Branch[🌿 branchUtils.js<br/>• Branch operations<br/>• Repository management]
            View[👁️ viewUtils.js<br/>• UI updates<br/>• Result display]
        end
    end
    
    subgraph "Backend (Node.js)"
        Server[🖥️ server.js<br/>Main Application]
        
        subgraph "Core Modules"
            HTTP[🌐 httpClient.js<br/>• Axios wrapper<br/>• GitHub API calls]
            Middleware[🛡️ middleware.js<br/>• Security stack<br/>• Rate limiting]
            Validation[✅ validation.js<br/>• Input schemas<br/>• Sanitization]
            Logger[📝 logger.js<br/>• Winston logging<br/>• File rotation]
            Config[⚙️ config.js<br/>• Environment vars<br/>• App settings]
        end
    end
    
    subgraph "External APIs"
        GitHubAPI[🐙 GitHub API<br/>• Repository management<br/>• Branch operations<br/>• OAuth services]
    end
    
    HTML --> JS
    CSS --> JS
    JS --> Tools
    JS --> Branch
    JS --> View
    
    Tools --> Server
    Branch --> Server
    View --> Server
    
    Server --> HTTP
    Server --> Middleware
    Server --> Validation
    Server --> Logger
    Server --> Config
    
    HTTP --> GitHubAPI
    
    classDef frontend fill:#e3f2fd
    classDef backend fill:#f3e5f5
    classDef external fill:#e8f5e8
    
    class HTML,CSS,JS,Tools,Branch,View frontend
    class Server,HTTP,Middleware,Validation,Logger,Config backend
    class GitHubAPI external
```

## 📊 Data Flow Diagram

```mermaid
flowchart TD
    Start([👤 User Action]) --> Input{🔍 Input Type}
    
    Input -->|Branch Search| Search[🌿 Search Branch]
    Input -->|Branch Create| Create[➕ Create Branch]
    Input -->|Branch Delete| Delete[🗑️ Delete Branch]
    Input -->|PR Search| PRSearch[📋 Search PRs]
    
    Search --> Validate[✅ Validate Input]
    Create --> Validate
    Delete --> Validate
    PRSearch --> Validate
    
    Validate --> Auth[🔐 Check Authentication]
    Auth --> RateLimit[🚦 Rate Limit Check]
    RateLimit --> GitHubCall[📡 GitHub API Call]
    
    GitHubCall --> Success{✅ Success?}
    Success -->|Yes| Format[📝 Format Response]
    Success -->|No| Error[❌ Handle Error]
    
    Format --> Display[🖥️ Update UI]
    Error --> Display
    
    Display --> End([🏁 Complete])
    
    classDef action fill:#e8f5e8
    classDef process fill:#fff3e0
    classDef decision fill:#ffebee
    classDef endpoint fill:#e3f2fd
    
    class Start,End action
    class Validate,Auth,RateLimit,Format,Error process
    class Input,Success decision
    class Search,Create,Delete,PRSearch,GitHubCall,Display endpoint
```

## 💾 File System Structure

```mermaid
graph TD
    Root[📁 Git-Captain/] --> Controllers[📁 controllers/]
    Root --> Public[📁 public/]
    Root --> Docs[📁 docs/]
    Root --> Logs[📁 logs/]
    Root --> Config[📄 Config Files]
    
    Controllers --> Server[🔧 server.js]
    Controllers --> HTTP[🌐 httpClient.js]
    Controllers --> Mid[🛡️ middleware.js]
    Controllers --> Val[✅ validation.js]
    Controllers --> Log[📝 logger.js]
    Controllers --> Cfg[⚙️ config.js]
    Controllers --> Env[🔐 .env]
    Controllers --> SSL[🔑 SSL Certificates]
    
    Public --> CSS[📁 css/]
    Public --> JS[📁 js/]
    Public --> Images[📁 images/]
    Public --> Views[📁 views/]
    
    JS --> Tools[🔧 tools.js]
    JS --> Branch[🌿 branchUtils.js]
    JS --> ViewUtils[👁️ viewUtils.js]
    
    Views --> Index[🏠 index.html]
    Views --> Auth[🔐 authenticated.html]
    
    Docs --> Deploy[📖 DEPLOYMENT.md]
    Docs --> Arch[🏗️ ARCHITECTURE.md]
    
    Config --> Package[📦 package.json]
    Config --> README[📖 README.md]
    Config --> Setup[⚡ SETUP.md]
    Config --> Updates[📋 MODULE_UPDATES.md]
    
    classDef folder fill:#fff3e0
    classDef backend fill:#f3e5f5
    classDef frontend fill:#e3f2fd
    classDef docs fill:#e8f5e8
    classDef config fill:#ffebee
    
    class Root,Controllers,Public,Docs,Logs folder
    class Server,HTTP,Mid,Val,Log,Cfg,Env,SSL backend
    class CSS,JS,Images,Views,Tools,Branch,ViewUtils,Index,Auth frontend
    class Deploy,Arch docs
    class Config,Package,README,Setup,Updates config
```

---

## 🎯 Why Mermaid is Perfect for GitHub:

✅ **Native GitHub Support** - Renders automatically in README.md
✅ **Version Control Friendly** - Text-based, easy to diff
✅ **Professional Looking** - Clean, modern diagrams
✅ **Interactive** - Clickable elements (in some contexts)
✅ **Responsive** - Scales well on mobile
✅ **Easy to Maintain** - Update diagrams with simple text changes

You can copy any of these Mermaid diagrams directly into your README.md or documentation files, and they'll render beautifully on GitHub! 🚢
