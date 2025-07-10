# Git-Captain Architecture Diagrams

This document provides multiple visual representations of the Git-Captain v2.0 architecture using different diagramming tools that render well on GitHub.

## 1. Mermaid Diagrams (GitHub Native Support)

Mermaid is built into GitHub and renders automatically. Here are several diagram types:

### System Architecture Overview

```mermaid
graph TB
    subgraph "Client Layer"
        Browser[🌐 Web Browser]
        OAuth[GitHub OAuth]
    end

    subgraph "Proxy Layer"
        Proxy[🔄 Reverse Proxy<br/>nginx/Apache/ALB]
    end

    subgraph "Application Layer"
        App[🚀 Node.js App<br/>Express Server<br/>Port 3000]
        
        subgraph "Security Middleware"
            Helmet[🛡️ Helmet]
            CORS[🔗 CORS]
            RateLimit[⏱️ Rate Limiting]
            Auth[🔐 Authentication]
        end
        
        subgraph "Core Services"
            Router[📍 Express Router]
            Validation[✅ Input Validation]
            Logger[📝 Winston Logger]
        end
    end

    subgraph "External APIs"
        GitHub[🐙 GitHub API<br/>api.github.com]
    end

    subgraph "Storage"
        Logs[📄 Log Files]
        Static[📁 Static Assets]
    end

    Browser -->|HTTPS/443| Proxy
    OAuth -->|OAuth Callback| Proxy
    Proxy -->|HTTPS/3000| App
    App -->|API Calls| GitHub
    App -->|Write| Logs
    App -->|Serve| Static

    classDef client fill:#e1f5fe
    classDef proxy fill:#f3e5f5
    classDef app fill:#e8f5e8
    classDef security fill:#fff3e0
    classDef service fill:#f1f8e9
    classDef external fill:#fce4ec
    classDef storage fill:#f5f5f5

    class Browser,OAuth client
    class Proxy proxy
    class App app
    class Helmet,CORS,RateLimit,Auth security
    class Router,Validation,Logger service
    class GitHub external
    class Logs,Static storage
```

### Data Flow Diagram

```mermaid
sequenceDiagram
    participant U as User
    participant B as Browser
    participant P as Proxy
    participant A as App
    participant G as GitHub API

    Note over U,G: OAuth Authentication Flow
    U->>B: Access Git-Captain
    B->>P: HTTPS Request
    P->>A: Forward Request
    A->>B: Redirect to GitHub OAuth
    B->>G: OAuth Authorization
    G->>B: Authorization Code
    B->>A: POST /gitCaptain/getToken
    A->>G: Exchange Code for Token
    G->>A: Access Token
    A->>B: Success Response

    Note over U,G: Branch Operations Flow
    U->>B: Create/Search Branch
    B->>A: POST /gitCaptain/{operation}
    A->>A: Validate Input
    A->>A: Rate Limit Check
    A->>G: GitHub API Call
    G->>A: API Response
    A->>A: Log Response
    A->>B: JSON Response
    B->>U: Display Result
```

### Component Architecture

```mermaid
graph LR
    subgraph "Frontend Components"
        Index[index.html]
        Auth[authenticated.html]
        CSS[styles.css]
        JS[JavaScript Modules]
    end

    subgraph "Backend Components"
        Server[server.js]
        Config[config.js]
        Middleware[middleware.js]
        Validation[validation.js]
        Logger[logger.js]
        HttpClient[httpClient.js]
        Security[security.js]
    end

    subgraph "External Integrations"
        GitHubAPI[GitHub API]
        OAuth[GitHub OAuth]
    end

    Index --> Server
    Auth --> Server
    JS --> Server
    
    Server --> Config
    Server --> Middleware
    Server --> Validation
    Server --> Logger
    Server --> HttpClient
    Server --> Security
    
    HttpClient --> GitHubAPI
    Server --> OAuth

    classDef frontend fill:#e3f2fd
    classDef backend fill:#e8f5e8
    classDef external fill:#fce4ec

    class Index,Auth,CSS,JS frontend
    class Server,Config,Middleware,Validation,Logger,HttpClient,Security backend
    class GitHubAPI,OAuth external
```

## 2. PlantUML Diagrams

PlantUML is widely supported and can be rendered by many tools. Here's the same architecture:

```plantuml
@startuml Git-Captain Architecture
!theme plain

skinparam backgroundColor #FFFFFF
skinparam componentStyle rectangle

package "Client Layer" {
    [Web Browser] as browser
    [GitHub OAuth] as oauth
}

package "Infrastructure" {
    [Reverse Proxy] as proxy
}

package "Application Layer" {
    package "Security Middleware" {
        [Helmet] as helmet
        [CORS] as cors
        [Rate Limiting] as rateLimit
        [Authentication] as auth
    }
    
    package "Core Application" {
        [Express Server] as server
        [Request Router] as router
        [Input Validation] as validation
        [Logger] as logger
        [HTTP Client] as httpClient
    }
}

package "External Services" {
    [GitHub API] as github
}

package "Storage" {
    [Log Files] as logs
    [Static Assets] as static
}

browser -right-> proxy : HTTPS/443
oauth -right-> proxy : OAuth Callback
proxy -down-> server : HTTPS/3000

server -down-> helmet
server -down-> cors
server -down-> rateLimit
server -down-> auth

server -right-> router
server -right-> validation
server -right-> logger
server -right-> httpClient

httpClient -right-> github : API Calls
logger -down-> logs
server -down-> static

@enduml
```

## 3. Excalidraw (JSON Export)

Excalidraw is great for hand-drawn style diagrams. While you can't embed the live diagram in GitHub, you can export as SVG:

### System Overview (Excalidraw Style)

```
┌─────────────────────────────────────────────────────────────────┐
│                    Git-Captain v2.0 System                     │
└─────────────────────────────────────────────────────────────────┘

    👤 User
     │
     │ HTTPS
     ▼
┌─────────────┐     ┌──────────────────────────────────────┐
│   Browser   │────▶│          Reverse Proxy               │
│             │     │       (nginx/Apache/ALB)            │
└─────────────┘     └──────────────────────────────────────┘
                                     │
                                     │ HTTPS/3000
                                     ▼
                    ┌──────────────────────────────────────┐
                    │         Node.js Application          │
                    │                                      │
                    │  🛡️ Security Layer                   │
                    │  ├─ Helmet (Security Headers)        │
                    │  ├─ CORS (Cross-Origin)             │
                    │  ├─ Rate Limiting                    │
                    │  └─ Authentication                   │
                    │                                      │
                    │  🚀 Application Layer                │
                    │  ├─ Express Router                   │
                    │  ├─ Input Validation                 │
                    │  ├─ Winston Logger                   │
                    │  └─ HTTP Client (Axios)             │
                    └──────────────────────────────────────┘
                                     │
                                     │ HTTPS API
                                     ▼
                    ┌──────────────────────────────────────┐
                    │           GitHub API                 │
                    │      (api.github.com)               │
                    └──────────────────────────────────────┘
```

## 4. Draw.io/Diagrams.net (Recommended)

Draw.io has excellent GitHub integration and can embed SVG directly:

### Architecture Layers

```xml
<!-- This would be the draw.io XML that can be imported -->
<!-- The SVG export renders beautifully in GitHub -->
```

## 5. Lucidchart Integration

For professional diagrams, you can embed Lucidchart diagrams as images:

```markdown
![Git-Captain Architecture](https://lucid.app/publicSegments/view/your-diagram-id)
```

## Best Practices for GitHub Diagrams

1. **Use Mermaid for simple diagrams** - Native GitHub support, version controlled
2. **Use PlantUML for complex UML** - Wide tool support, good for technical documentation
3. **Export SVG from visual tools** - Draw.io, Lucidchart for professional appearance
4. **Keep diagrams in `/docs`** - Centralized documentation
5. **Use consistent styling** - Colors, fonts, shapes across all diagrams
6. **Add alt text** - For accessibility
7. **Version your diagrams** - Keep source files in repo when possible

## Tools Comparison

| Tool | GitHub Native | Complexity | Best For |
|------|---------------|------------|----------|
| Mermaid | ✅ Yes | Medium | Flow charts, sequences |
| PlantUML | ❌ No | High | UML diagrams |
| Draw.io | ❌ No | Low | General purpose |
| Lucidchart | ❌ No | Low | Professional docs |
| Excalidraw | ❌ No | Low | Sketchy style |

## Next Steps

1. Choose your preferred diagramming tool
2. Update this document with your selected diagrams
3. Add diagrams to README.md for quick reference
4. Consider creating a `/diagrams` folder for source files
