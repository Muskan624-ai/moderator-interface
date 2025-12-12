const container = document.getElementById('data-container');
const title = document.getElementById('page-title');
const loading = document.getElementById('loading');

// Helper function to fetch data from the API
async function fetchData(url) {
    loading.classList.remove('hidden'); // Show loading text
    container.innerHTML = ''; // Clear previous data
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        container.innerHTML = '<p style="color: red; text-align: center;">Error loading data. Please check your internet.</p>';
    } finally {
        loading.classList.add('hidden'); 
    }
}

// 1. Show Users (With Avatars!)
async function showUsers() {
    title.innerText = "User Management";
    const users = await fetchData('https://jsonplaceholder.typicode.com/users');
    
    if(users) {
        users.forEach(user => {
            const card = document.createElement('div');
            card.className = 'card';
            const initial = user.name.charAt(0);

            card.onclick = function() {
                showUserPosts(user.id, user.name);
            };

            card.innerHTML = `
                <div class="user-header">
                    <div class="avatar">${initial}</div>
                    <div>
                        <h3>${user.name}</h3>
                        <p class="email">${user.email}</p>
                    </div>
                </div>
                <p style="margin-top: 10px; border-top: 1px solid #fed7aa; padding-top: 10px;">
                    Company: <span class="company-name">${user.company.name}</span>
                </p>
            `;
            container.appendChild(card);
        });
    }
}

// 2. Show Specific User's Posts 
async function showUserPosts(userId, userName) {
    title.innerText = `Posts by ${userName}`; 
    const posts = await fetchData(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
    
    if(posts) {
        posts.forEach(post => {
            const card = document.createElement('div');
            card.className = 'card';
            
            // Fixed typo: removed the random 'a' after </div>
            card.innerHTML = `
                <div style="border-bottom: 1px solid #431407; padding-bottom: 10px; margin-bottom: 10px;">
                    <h3 style="color: #431407;">${post.title}</h3>
                </div>
                <p>${post.body}</p>
            `;
            container.appendChild(card);
        });
    }
    window.scrollTo(0, 0);
}

// 3. Show All Posts (With Author Names)
async function showPosts() {
    title.innerText = "All Recent Posts";
    
    // Step A: Fetch Users first so we know who is who
    const users = await fetchData('https://jsonplaceholder.typicode.com/users');
    const userMap = {};
    if(users) {
        users.forEach(user => {
            userMap[user.id] = user.name;
        });
    }

    // Step B: Fetch Posts
    const posts = await fetchData('https://jsonplaceholder.typicode.com/posts');
    
    if(posts) {
        // Slice to show only first 20 posts
        posts.slice(0, 20).forEach(post => {
            const card = document.createElement('div');
            card.className = 'card';
            
            // Look up the name using the ID
            const authorName = userMap[post.userId] || "Unknown Author";

            card.innerHTML = `
                <div style="border-bottom: 1px solid #fed7aa; padding-bottom: 10px; margin-bottom: 10px;">
                    <h3>${post.title}</h3>
                    <p class="post-author">By ${authorName}</p>
                </div>
                <p>${post.body}</p>
            `;
            container.appendChild(card);
        });
    }
}

// Load users by default when page opens
showUsers();