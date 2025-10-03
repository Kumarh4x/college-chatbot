// DOM Elements
const loginPage = document.getElementById('login-page');
const chatPage = document.getElementById('chat-page');
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout-btn');
const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');

// Application State
let currentUser = null;

// Initialize application
document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
    checkAuthStatus();
    setupEventListeners();
}

function checkAuthStatus() {
    const userData = localStorage.getItem('askDeviUser');
    
    if (userData) {
        currentUser = JSON.parse(userData);
        showChatPage();
        addBotMessage("Welcome back! I'm Ask Devi 👋 How can I help you today?");
    } else {
        showLoginPage();
    }
}

function setupEventListeners() {
    // Login form submission
    loginForm.addEventListener('submit', handleLogin);
    
    // Logout button
    logoutBtn.addEventListener('click', handleLogout);
    
    // Send message events
    sendBtn.addEventListener('click', handleSendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });
}

function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    
    // Save user data to localStorage
    currentUser = { username, email };
    localStorage.setItem('askDeviUser', JSON.stringify(currentUser));
    
    showChatPage();
    addBotMessage("Hi there! I'm Ask Devi 👋 Your friendly AI assistant. What would you like to know?");
}

function handleLogout() {
    localStorage.removeItem('askDeviUser');
    currentUser = null;
    showLoginPage();
    loginForm.reset();
}

function handleSendMessage() {
    const message = messageInput.value.trim();
    
    if (!message) return;
    
    // Add user message to chat
    addUserMessage(message);
    messageInput.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Simulate bot response delay
    setTimeout(() => {
        removeTypingIndicator();
        
        // Get bot response
        const botResponse = sendMessageToRasa(message);
        addBotMessage(botResponse);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
}

/**
 * TODO: Connect this function to Rasa server
 * This is a placeholder function that will be replaced with actual Rasa API integration
 * Example implementation for future integration:
 * 
 * async function sendMessageToRasa(message) {
 *     try {
 *         const response = await fetch("http://localhost:5005/webhooks/rest/webhook", {
 *             method: "POST",
 *             headers: {
 *                 "Content-Type": "application/json",
 *             },
 *             body: JSON.stringify({
 *                 sender: currentUser.username,
 *                 message: message
 *             })
 *         });
 *         
 *         const data = await response.json();
 *         return data[0]?.text || "I'm sorry, I didn't understand that.";
 *     } catch (error) {
 *         console.error("Error connecting to Rasa:", error);
 *         return "I'm having trouble connecting right now. Please try again later.";
 *     }
 * }
 */
function sendMessageToRasa(message) {
    // Placeholder responses for demo purposes
    const responses = [
        "That's an interesting question! I'm Ask Devi, your AI assistant. How can I help you today?",
        "Thanks for your message! I'm still learning, but I'll do my best to help.",
        "I understand you're asking about that. Could you provide more details?",
        "That's a great point! As Ask Devi, I'm here to assist with your questions.",
        "I appreciate your message. What else would you like to know?"
    ];
    
    // Return a random response for demo purposes
    // In production, this will be replaced with actual Rasa API call
    return responses[Math.floor(Math.random() * responses.length)];
}

// UI Management Functions
function showLoginPage() {
    chatPage.classList.remove('active');
    loginPage.classList.add('active');
}

function showChatPage() {
    loginPage.classList.remove('active');
    chatPage.classList.add('active');
    // Clear previous messages when showing chat page
    chatMessages.innerHTML = '';
    // Focus on input field
    messageInput.focus();
}

function addUserMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message user-message';
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
    scrollToBottom();
}

function addBotMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message bot-message';
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
    scrollToBottom();
}

function showTypingIndicator() {
    const typingElement = document.createElement('div');
    typingElement.className = 'typing-indicator bot-message';
    typingElement.id = 'typing-indicator';
    
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.className = 'typing-dot';
        typingElement.appendChild(dot);
    }
    
    chatMessages.appendChild(typingElement);
    scrollToBottom();
}

function removeTypingIndicator() {
    const typingElement = document.getElementById('typing-indicator');
    if (typingElement) {
        typingElement.remove();
    }
}

function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Export for potential module usage (if needed in future)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { sendMessageToRasa };
}