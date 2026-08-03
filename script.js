class GithubProfileFinder {
    constructor() {
        this.searchBtn = document.getElementById("searchBtn");
        this.searchInput = document.getElementById("searchInput");
        this.loading = document.getElementById("loading");
        this.profile = document.getElementById("profileContainer");

        this.events();
    }

    events() {
        this.searchBtn.addEventListener("click", () => {
            let username = this.searchInput.value.trim();

            if (username === "") {
                alert("Please enter a username");
                return;
            }

            this.fetchProfile(username);
        });

        this.searchInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                this.searchBtn.click();
            }
        });
    }

    async fetchProfile(username) {
        this.loading.classList.remove("hidden");
        this.profile.innerHTML = "";

        try {
            const response = await fetch(`https://api.github.com/users/${username}`);

            if (response.status === 404) {
                this.loading.classList.add("hidden");
                this.profile.innerHTML = `
                    <div class="bg-red-500 text-white rounded-lg p-5 text-center shadow-lg">
                        <i class="fa-solid fa-circle-xmark text-3xl mb-2"></i>
                        <p class="font-semibold text-lg">User Not Found</p>
                    </div>`;
                return;
            }

            if (response.status === 403) {
                this.loading.classList.add("hidden");
                this.profile.innerHTML = `
                    <div class="bg-yellow-500 text-black rounded-lg p-5 text-center shadow-lg">
                        <i class="fa-solid fa-triangle-exclamation text-3xl mb-2"></i>
                        <p class="font-semibold">GitHub API rate limit exceeded.<br>Please try again later.</p>
                    </div>`;
                return;
            }

            const data = await response.json();

            this.loading.classList.add("hidden");

            this.profile.innerHTML = `
                <div class="bg-gray-800 rounded-xl shadow-lg p-6 text-center text-white border border-gray-700">
                    <img
                        src="${data.avatar_url}"
                        alt="${data.login}'s avatar"
                        class="w-28 h-28 rounded-full mx-auto border-4 border-blue-500 shadow-md">

                    <h2 class="text-2xl font-bold mt-4">
                        ${data.name || data.login}
                    </h2>

                    <p class="text-gray-400">
                        @${data.login}
                    </p>

                    <p class="mt-3 text-gray-300">
                        ${data.bio || "No Bio Available"}
                    </p>

                    <div class="mt-5 text-left space-y-2 text-sm text-gray-300">
                        <p>
                            <i class="fa-solid fa-location-dot text-blue-400 w-6"></i>
                            ${data.location || "Unknown"}
                        </p>
                        <p>
                            <i class="fa-solid fa-building text-blue-400 w-6"></i>
                            ${data.company || "Not Available"}
                        </p>
                        <p>
                            <i class="fa-solid fa-envelope text-blue-400 w-6"></i>
                            ${data.email || "Private"}
                        </p>
                        <p>
                            <i class="fa-brands fa-x-twitter text-blue-400 w-6"></i>
                            ${data.twitter_username || "Not Available"}
                        </p>
                        <p>
                            <i class="fa-solid fa-user text-blue-400 w-6"></i>
                            ${data.type}
                        </p>
                        <p>
                            <i class="fa-solid fa-calendar text-blue-400 w-6"></i>
                            Joined ${new Date(data.created_at).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric"
                            })}
                        </p>
                    </div>

                    <div class="grid grid-cols-2 gap-3 mt-6">
                        <div class="bg-gray-700 rounded-lg p-3">
                            <p class="text-2xl font-bold text-blue-400">${data.followers}</p>
                            <p class="text-xs text-gray-300">Followers</p>
                        </div>
                        <div class="bg-gray-700 rounded-lg p-3">
                            <p class="text-2xl font-bold text-blue-400">${data.following}</p>
                            <p class="text-xs text-gray-300">Following</p>
                        </div>
                        <div class="bg-gray-700 rounded-lg p-3">
                            <p class="text-2xl font-bold text-blue-400">${data.public_repos}</p>
                            <p class="text-xs text-gray-300">Repositories</p>
                        </div>
                        <div class="bg-gray-700 rounded-lg p-3">
                            <p class="text-2xl font-bold text-blue-400">${data.public_gists}</p>
                            <p class="text-xs text-gray-300">Gists</p>
                        </div>
                    </div>

                    ${data.blog ? `
                    <a
                        href="${data.blog.startsWith("http") ? data.blog : "https://" + data.blog}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="block bg-purple-600 hover:bg-purple-700 transition rounded-lg py-3 mt-6 font-semibold">
                        Visit Website
                    </a>` : ""}

                    <a
                        href="${data.html_url}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="block bg-green-600 hover:bg-green-700 transition rounded-lg py-3 mt-3 font-semibold">
                        View GitHub Profile
                    </a>

                    <a
                        href="https://github.com/${data.login}?tab=repositories"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="block bg-blue-600 hover:bg-blue-700 transition rounded-lg py-3 mt-3 font-semibold">
                        View Repositories
                    </a>
                </div>
            `;
        } catch (error) {
            console.error(error);
            this.loading.classList.add("hidden");
            this.profile.innerHTML = `
                <div class="bg-red-500 rounded-lg text-white p-5 text-center shadow-lg">
                    <p class="font-semibold">Something Went Wrong</p>
                </div>`;
        }
    }
}

new GithubProfileFinder();
