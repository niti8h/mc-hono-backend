import { Hono } from 'hono'
import { Layout } from './components/Layout'
import auth from './routes/auth'

const app = new Hono()

// 1. Home Page Route - Shows full rich content block
app.route("/auth", auth)

app.get('/', (c) => {
    return c.html(
        <Layout title="MADARCHOD.TECH | The Permanent Archive of Spite & Pettiness"
            description="Welcome to the official registry of unfiltered truth. Explore a digital museum dedicated to tracking tier 1 menaces, public nuisances, and toxic snakes."
            keywords="madarchod tech, madarchod.tech, the void registry, permanent archive, petty people database, snake list, digital museum of spite"
            currentRoute="/"
            showLogoInMenuBar={true}>
            <header>
                <div class="logo">MADARCHOD.<span>TECH</span></div>
                <p style="color: #666; letter-spacing: 5px; margin-top: 10px;">THE PERMANENT ARCHIVE</p>
            </header>


            <section id="list">
                <h2 class="section-title">The Current Roster</h2>
                <div class="grid">
                    <div class="card">
                        <span class="tag">Tier 1 Menace</span>
                        <img src="https://picsum.photos/400/300?random=11" alt="Rahul" />
                        <h3>Rahul "The Ghoster"</h3>
                        <p style="color: #888;">Promised to return the drill machine in 2022. Moved cities. Changed his name. Still hasn't returned the drill.</p>
                    </div>
                    <div class="card">
                        <span class="tag">Legendary Snake</span>
                        <img src="https://picsum.photos/400/300?random=12" alt="Simran" />
                        <h3>Simran (The Ex)</h3>
                        <p style="color: #888;">Told me she loved my playlist, then blocked me and started listening to "phonk" with a guy named Kyle.</p>
                    </div>
                    <div class="card">
                        <span class="tag">Public Nuisance</span>
                        <img src="https://picsum.photos/400/300?random=13" alt="HR" />
                        <h3>The HR Manager</h3>
                        <p style="color: #888;">Said "We are a family" right before denying my 2-day leave for my own wedding. Absolute legend.</p>
                    </div>
                </div>
            </section>
            <section class="info-box">
                <h2 class="section-title">Why Choose Us?</h2>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; text-align: left;">
                    <p><strong>1. Unmatched Pettiness:</strong> We don't forgive, and we definitely don't forget. Our
                        servers are powered by pure, unadulterated spite.</p>
                    <p><strong>2. 99.9% Salt Content:</strong> While other sites offer "reviews," we offer digital monuments
                        to your failures as a human being.</p>
                    <p><strong>3. SEO Optimized Grudges:</strong> We make sure that when someone Googles your name, the
                        first thing they see is why you're a piece of work.</p>
                    <p><strong>4. Dark Mode Always:</strong> Because your deeds are too dark for a white background anyway.
                    </p>
                </div>
            </section>


            <section style="text-align: center; max-width: 700px; margin: 120px auto;">
                <h2 class="section-title">About the Project</h2>
                <p style="font-size: 1.2rem; color: #aaa;">
                    Madarchod.tech started as a late-night epiphany after a particularly bad encounter with a customer support bot. We realized the internet needed a place for the <span style="color: #7000ff; font-weight: bold;">unfiltered truth</span>. We aren't just a website; we are a digital museum of people who really should have known better.
                </p>
            </section>


            <section class="info-box" style="border-color: #ff0055;">
                <h2 class="section-title" style="color: #ff0055;">Want Your Name Removed?</h2>
                <p>Look, we get it. Being famous isn't for everyone. If you want off the list, you have to find the <strong>Admin</strong>. He’s usually hiding in a dark room drinking lukewarm coffee.</p>
                <br />
                <p style="background: rgba(255,0,85,0.1); padding: 20px; border-radius: 15px; border: 1px dashed #ff0055;">
                    <strong>Pro-Tip:</strong> Send him a request. He sometimes agrees to remove a name—but only if your story is truly pathetic. Like, if you got your <strong>asshole stuck in a plastic chair's paddle</strong> while trying to reach for a remote, he might feel enough pity to hit the delete key. No promises though.
                </p>
            </section>
        </Layout>
    )
})

// 2. Auxiliary Routes - Renders blank view within the exact layout template framework
app.get('/roster', (c) => {
    return c.html(
        <Layout title="Roster Archive | The Void" showLogoInMenuBar={true} currentRoute="/roster">
            <section style="text-align: center; min-height: 400px; display: flex; flex-direction: column; justify-content: center;">
                <h2 class="section-title">The Roster Vault</h2>
                <p style="color: #666;">This sector of the void is currently empty.</p>
            </section>
        </Layout>
    )
})

app.get('/about', (c) => {
    return c.html(
        <Layout title="About Manifest | The Void" showLogoInMenuBar={true} currentRoute="/about">
            <section style="text-align: center; min-height: 400px; display: flex; flex-direction: column; justify-content: center;">
                <h2 class="section-title">The Manifest</h2>
                <p style="color: #666;">No logs documented here yet.</p>
            </section>
        </Layout>
    )
})
app.notFound((c) => {
    return c.html(
        <Layout title="404 Error | The Void" showLogoInMenuBar={true} currentRoute="/404">
            <section style="text-align: center; min-height: 400px; display: flex; flex-direction: column; justify-content: center;">
                <h2 class="section-title">404 Not Found</h2>
                <p style="color: #666;">Are you lost madarchod ?</p>
            </section>
        </Layout>
    )
});

app.get('/remove', (c) => {
    return c.html(
        <Layout title="Appeals Registry | The Void" showLogoInMenuBar={true} currentRoute="/remove">
            <section style="text-align: center; min-height: 400px; display: flex; flex-direction: column; justify-content: center;">
                <h2 class="section-title">Appeals Sector</h2>
                <p style="color: #666;">The admin is out of coffee. Try again later.</p>
            </section>
        </Layout>
    )
})
app.get('/auth', (c) => {
    const tab = c.req.query("tab") || "login"
    const type = c.req.query("type") || ""
    const message = c.req.query("message") || ""

    let alertElement = null
    if (message) {
        const alertClass = type === "success" ? "alert alert-success" : "alert alert-danger"
        alertElement = (
            <div class={alertClass}>
                {message}
            </div>
        )
    }

    return c.html(
        <Layout
            title="Access Protocol | MADARCHOD.TECH"
            description="Enter the void. Log in or create an account to contribute to the permanent archive of unfiltered truth."
            keywords="madarchod tech login, sign up, void registry access"
            currentRoute="/auth"
            showLogoInMenuBar={true}
        >
            <div class="auth-wrapper">
                <div class="auth-container">

                    <input
                        type="radio"
                        id="tab-login"
                        name="auth-tabs"
                        checked={tab !== "register"}
                        class="tab-switch"
                    />
                    <input
                        type="radio"
                        id="tab-register"
                        name="auth-tabs"
                        checked={tab === "register"}
                        class="tab-switch"
                    />

                    {/* Tab Labels */}
                    <div class="tab-headers">
                        <label for="tab-login" class="tab-label label-login">Sign In</label>
                        <label for="tab-register" class="tab-label label-register">Register</label>
                        <div class="tab-indicator"></div>
                    </div>

                    {/* Inject Alert Message Box here */}
                    {alertElement}

                    {/* Login Form Body */}
                    <div class="form-content login-form">
                        <h2>Welcome Back, Menace</h2>
                        <p class="form-subtitle">The admin manually verified your spot in hell.</p>

                        <form action="/auth/login" method="POST">
                            <div class="input-group">
                                <input type="text" name="username" required placeholder=" " />
                                <label>Username</label>
                            </div>
                            <div class="input-group">
                                <input type="password" name="password" required placeholder=" " />
                                <label>Password</label>
                            </div>
                            <button type="submit" class="auth-btn btn-login">Initiate Session</button>
                        </form>
                    </div>

                    {/* Register Form Body */}
                    <div class="form-content register-form">
                        <h2>Create New Record</h2>
                        <p class="form-subtitle">Prepare to contribute to the registry of spite.</p>

                        <form action="/auth/register" method="POST">
                            <div class="input-group">
                                <input type="text" name="username" required placeholder=" " />
                                <label>Chosen Username</label>
                            </div>

                            <div class="input-group">
                                <input type="password" name="password" required placeholder=" " />
                                <label>Create Password</label>
                            </div>
                            <button type="submit" class="auth-btn btn-register">Forge Account</button>
                        </form>
                    </div>

                </div>
            </div>
        </Layout>
    )
})
export default app