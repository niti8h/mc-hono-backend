export const Home = () => {
    return (
        <>
            <section id="list">
                <h2 class="section-title">The Current Roster</h2>
                <div class="grid">
                    <div class="card">
                        <span class="tag">Tier 1 Menace</span>
                        <img src="https://picsum.photos/400/300?random=11" alt="Rahul" />
                        <h3>Rahul "The Ghoster"</h3>
                        <p style="color: #888;">Promised to return the drill machine in 2022. Moved cities. Changed his
                            name. Still hasn't returned the drill.</p>
                    </div>

                    <div class="card">
                        <span class="tag">Legendary Snake</span>
                        <img src="https://picsum.photos/400/300?random=12" alt="Simran" />
                        <h3>Simran (The Ex)</h3>
                        <p style="color: #888;">Told me she loved my playlist, then blocked me and started listening to
                            "phonk" with a guy named Kyle.</p>
                    </div>

                    <div class="card">
                        <span class="tag">Public Nuisance</span>
                        <img src="https://picsum.photos/400/300?random=13" alt="HR Manager" />
                        <h3>The HR Manager</h3>
                        <p style="color: #888;">Said "We are a family" right before denying my 2-day leave for my own
                            wedding. Absolute legend.</p>
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
                    Madarchod.tech started as a late-night epiphany after a particularly bad encounter with a customer
                    support bot. We realized the internet needed a place for the <span class="highlight">unfiltered
                        truth</span>. We aren't just a website; we are a digital museum of people who really should have
                    known better.
                </p>
            </section>

            <section class="info-box" style="border-color: #ff0055;">
                <h2 class="section-title" style="color: #ff0055;">Want Your Name Removed?</h2>
                <p>Look, we get it. Being famous isn't for everyone. If you want off the list, you have to find the
                    <strong>Admin</strong>. He’s usually hiding in a dark room drinking lukewarm coffee.</p>
                <br />
                <p style="background: rgba(255,0,85,0.1); padding: 20px; border-radius: 15px; border: 1px dashed #ff0055;">
                    <strong>Pro-Tip:</strong> Send him a request. He sometimes agrees to remove a name—but only if your
                    story is truly pathetic. Like, if you got your <strong>asshole stuck in a plastic chair's
                        paddle</strong> while trying to reach for a remote, he might feel enough pity to hit the delete key.
                    No promises though.
                </p>
            </section>
        </>
    );
}
