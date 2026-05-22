import { html } from 'hono/html'

interface LayoutProps {
    title: string
    children: any
    showLogoInMenuBar?: boolean
    currentRoute: string

    description: string
    keywords: string
}

export const Layout = (props: LayoutProps) => {
    return html`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
 
    <title>${props.title}</title>
    <meta name="description" content="${props.description}">
    <meta name="keywords" content="${props.keywords}">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="https://madarchod.tech${props.currentRoute}">

    <!-- Dynamic Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://madarchod.tech${props.currentRoute}">
    <meta property="og:title" content="${props.title}">
    <meta property="og:description" content="${props.description}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;500;700&display=swap" rel="stylesheet">

    <style>
        :root {
            --bg: #020202;
            --glass: rgba(15, 15, 15, 0.7);
            --accent-gradient: linear-gradient(90deg, #ff0055, #7000ff);
            --border: rgba(255, 255, 255, 0.1);
            --text: #e0e0e0;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        html, body {
            width: 100%;
            min-height: 100vh;
            background-color: var(--bg);
            color: var(--text);
            font-family: 'Space Grotesk', sans-serif;
            overflow-x: hidden;
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
        }

        body::after {
            content: " ";
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%),
                linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
            background-size: 100% 4px, 3px 100%;
            pointer-events: none;
            z-index: 10;
        }

        /* Top Menu Bar Styles */
        .menubar {
            position: sticky;
            top: 0;
            width: 100%;
            background: rgba(2, 2, 2, 0.8);
            backdrop-filter: blur(12px);
            border-bottom: 1px solid var(--border);
            z-index: 100;
        }

        .menubar-container {
            max-width: 1100px;
            margin: 0 auto;
            padding: 15px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .menu-logo {
            font-size: 1.2rem;
            font-weight: 700;
            letter-spacing: -1px;
            text-decoration: none;
            color: var(--text);
            visibility: ${props.showLogoInMenuBar ? 'visible' : 'hidden'};
        }

        .menu-logo span {
            background: var(--accent-gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .nav-links {
            display: flex;
            gap: 20px;
        }

        .nav-links a {
            color: #888;
            text-decoration: none;
            font-size: 0.9rem;
            font-weight: 500;
            transition: color 0.3s ease;
        }

        .nav-links a:hover, .nav-links a.active {
            color: #fff;
        }

        /* Page Layout Container */
        .container {
            max-width: 1100px;
            width: 100%;
            margin: 0 auto;
            padding: 40px 20px;
        }

        /* Main Page Typography & Layout Elements mapping exact design */
        header { text-align: center; padding: 60px 0 60px; }
        .logo { font-size: 3.5rem; font-weight: 700; letter-spacing: -3px; }
        .logo span { background: var(--accent-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(0 0 10px rgba(112, 0, 255, 0.5)); }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 25px; margin-top: 50px; width: 100%; }
        .card { background: var(--glass); backdrop-filter: blur(10px); border: 1px solid var(--border); border-radius: 20px; padding: 30px; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); position: relative; }
        .card:hover { transform: scale(1.03); border-color: #7000ff; box-shadow: 0 0 30px rgba(112, 0, 255, 0.2); }
        .card img { width: 100%; height: 200px; object-fit: cover; border-radius: 12px; margin-bottom: 20px; filter: grayscale(100%) contrast(1.2); }
        .card:hover img { filter: grayscale(0%); }
        .tag { font-size: 0.7rem; font-weight: bold; padding: 4px 10px; border-radius: 5px; background: rgba(255, 0, 85, 0.2); color: #ff0055; text-transform: uppercase; margin-bottom: 10px; display: inline-block; }
        section { margin-top: 120px; width: 100%; }
        .section-title { font-size: 2rem; margin-bottom: 40px; text-align: center; color: #fff; }
        .info-box { background: linear-gradient(145deg, #0a0a0a, #111); border: 1px solid var(--border); padding: 50px; border-radius: 30px; text-align: center; width: 100%; }
        footer { margin-top: 150px; padding: 60px 20px; background: rgba(5, 5, 5, 0.8); border-top: 1px solid var(--border); position: relative; width: 100%; }
        /* Auth Centering Wrapper */
.auth-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 70vh;
    padding: 20px 0;
}

/* Glassmorphic Form Container */
.auth-container {
    background: var(--glass);
    backdrop-filter: blur(15px);
    border: 1px solid var(--border);
    border-radius: 24px;
    width: 100%;
    max-width: 450px;
    padding: 40px 30px;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
    overflow: hidden;
    position: relative;
}

/* Tab Layout Systems */
.tab-headers {
    display: flex;
    position: relative;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 5px;
    margin-bottom: 35px;
}

.tab-label {
    flex: 1;
    text-align: center;
    padding: 12px 0;
    cursor: pointer;
    font-weight: 500;
    font-size: 0.95rem;
    color: #666;
    z-index: 2;
    transition: color 0.3s ease;
}

.tab-switch {
    display: none;
}

/* Sliding Background Tab Indicator */
.tab-indicator {
    position: absolute;
    top: 5px;
    left: 5px;
    width: calc(50% - 5px);
    height: calc(100% - 10px);
    background: rgba(255, 255, 255, 0.07);
    border-radius: 8px;
    transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1);
    z-index: 1;
}

/* Tab Switching Rules via CSS Selectors */
#tab-login:checked ~ .tab-headers .label-login { color: #fff; }
#tab-register:checked ~ .tab-headers .label-register { color: #fff; }
#tab-register:checked ~ .tab-headers .tab-indicator { transform: translateX(100%); }

.form-content {
    display: none;
}

#tab-login:checked ~ .login-form { display: block; }
#tab-register:checked ~ .register-form { display: block; }

/* Typography inside forms */
.form-content h2 {
    font-size: 1.6rem;
    color: #fff;
    font-weight: 700;
    letter-spacing: -0.5px;
    margin-bottom: 5px;
}

.form-subtitle {
    color: #666;
    font-size: 0.85rem;
    margin-bottom: 30px;
}

/* Floating Label Inputs */
.input-group {
    position: relative;
    margin-bottom: 22px;
}

.input-group input {
    width: 100%;
    padding: 14px 16px;
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid var(--border);
    border-radius: 12px;
    color: #fff;
    font-family: inherit;
    font-size: 0.95rem;
    outline: none;
    transition: all 0.3s ease;
}

.input-group input:focus {
    border-color: #7000ff;
    box-shadow: 0 0 15px rgba(112, 0, 255, 0.15);
}

.input-group label {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: #555;
    pointer-events: none;
    transition: all 0.25s ease;
    font-size: 0.95rem;
}

/* Floating Trigger Rules */
.input-group input:focus ~ label,
.input-group input:not(:placeholder-shown) ~ label {
    top: 0;
    font-size: 0.75rem;
    color: #7000ff;
    background: #090909;
    padding: 0 6px;
    transform: translateY(-50%) translateX(-4px);
}

/* Action Buttons */
.auth-btn {
    width: 100%;
    padding: 14px;
    border-radius: 12px;
    border: none;
    font-family: inherit;
    font-weight: 700;
    font-size: 1rem;
    cursor: pointer;
    color: #fff;
    margin-top: 10px;
    transition: all 0.3s ease;
}

.btn-login {
    background: linear-gradient(90deg, #7000ff, #5000b8);
    box-shadow: 0 4px 15px rgba(112, 0, 255, 0.3);
}

.btn-login:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(112, 0, 255, 0.5);
}

.btn-register {
    background: linear-gradient(90deg, #ff0055, #c00040);
    box-shadow: 0 4px 15px rgba(255, 0, 85, 0.3);
}

.btn-register:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 0, 85, 0.5);
}
    .alert {
    padding: 14px 16px;
    border-radius: 12px;
    font-size: 0.9rem;
    font-weight: 500;
    margin-bottom: 25px;
    text-align: left;
    border: 1px solid;
}
.alert-success {
    background: rgba(112, 0, 255, 0.1);
    border-color: rgba(112, 0, 255, 0.3);
    color: #b070ff;
}
.alert-danger {
    background: rgba(255, 0, 85, 0.1);
    border-color: rgba(255, 0, 85, 0.3);
    color: #ff5085;
}

/* Responsive Media Queries */
@media (max-width: 768px) {
    .logo {
        font-size: 2.5rem;
        letter-spacing: -1.5px;
    }
    
    .menu-logo {
        font-size: 1.1rem;
    }

    .menubar-container {
        flex-direction: column;
        gap: 12px;
        padding: 12px 15px;
    }

    .nav-links {
        flex-wrap: wrap;
        justify-content: center;
        gap: 12px;
    }

    .nav-links a {
        font-size: 0.85rem;
    }

    .container {
        padding: 20px 15px;
    }

    header {
        padding: 30px 0 40px;
    }

    .section-title {
        font-size: 1.6rem;
        margin-bottom: 30px;
    }

    .info-box {
        padding: 25px 15px;
        border-radius: 20px;
    }

    .info-box div[style*="grid-template-columns"] {
        grid-template-columns: 1fr !important;
        gap: 15px !important;
    }

    .card {
        padding: 20px;
    }

    footer {
        margin-top: 80px;
        padding: 40px 15px;
    }

    .auth-container {
        padding: 30px 20px;
    }
    
    .tab-label {
        font-size: 0.85rem;
    }
}
</style>
</head>
<body>

    <!-- Menu Bar at the Top -->
    <nav class="menubar">
        <div class="menubar-container">
            <a href="/" class="menu-logo">MADARCHOD.<span>TECH</span></a>
            <div class="nav-links">
                <a href="/" class="${props.currentRoute === '/' ? 'active' : ''}">Home</a>
                <a href="/roster" class="${props.currentRoute === '/roster' ? 'active' : ''}">Roster</a>
                <a href="/about" class="${props.currentRoute === '/about' ? 'active' : ''}">About</a>
                <a href="/remove" class="${props.currentRoute === '/remove' ? 'active' : ''}">Appeals</a>
                <a href="/auth" class="${props.currentRoute === '/auth' ? 'active' : ''}">Login/Register</a>
            </div>
        </div>
    </nav>

    <div class="container">
        ${props.children}
        
    <!-- Final Copyright Section -->
        <footer
            style="margin-top: 150px; padding: 60px 20px; background: rgba(5, 5, 5, 0.8); border-top: 1px solid var(--border); position: relative;">
            <div style="max-width: 800px; margin: 0 auto; text-align: center;">

                <!-- The Big Logo Mark -->
                <div style="font-size: 1.5rem; font-weight: 700; margin-bottom: 20px; opacity: 0.8;">
                    MADARCHOD.<span
                        style="background: var(--accent-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">TECH</span>
                </div>

                <!-- The "Legal" Humor -->
                <div
                    style="background: rgba(255, 255, 255, 0.03); padding: 30px; border-radius: 15px; border: 1px solid rgba(255, 255, 255, 0.05); text-align: left; font-size: 0.85rem; color: #777; line-height: 1.8;">
                    <p
                        style="margin-bottom: 15px; color: #aaa; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">
                        © 2026 Madarchod.tech Official Registry. All Rights Reserved (unfortunately).</p>

                    <p><strong>Copyright & Intellectual Property:</strong> Any attempt to copy this website's design,
                        code, or our curated collection of idiots will result in immediate karmic retribution. Our
                        lawyers are just three raccoons in a trench coat, but they are very aggressive and highly
                        litigious.</p>

                    <p style="margin-top: 15px;"><strong>Data Protection:</strong> We don't use cookies because we
                        prefer to remember your mistakes manually. All data is stored on a server located in a volcano.
                        Unauthorized access is strictly prohibited unless you bring pizza (pepperoni only).</p>

                    <p
                        style="margin-top: 15px; font-style: italic; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 15px;">
                        Warning: Prolonged exposure to this website may cause sudden outbursts of "I knew it!", extreme
                        levels of pettiness, and the urge to buy more domain names to spite your neighbors. Use at your
                        own risk.
                    </p>
                </div>

                <p style="margin-top: 30px; font-size: 0.7rem; color: #444; letter-spacing: 2px;">DESIGNED BY SPITE •
                    POWERED BY CHAOS • HOSTED IN THE VOID</p>
            </div>
        </footer>
    </div>
</body>
</html>`
}