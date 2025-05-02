/**
 * Interactive elements for the Prompt Engineering course
 * This file contains functions for quizzes, drag-and-drop activities,
 * and the AI chat simulator
 */

// Quiz functionality
function initQuiz(quizId) {
    const quizContainer = document.getElementById(quizId);
    if (!quizContainer) return;
    
    const questions = quizContainer.querySelectorAll('.quiz-question');
    const submitButton = quizContainer.querySelector('.quiz-submit');
    const resultContainer = quizContainer.querySelector('.quiz-result');
    
    // Add click handlers to quiz options
    questions.forEach(question => {
        const options = question.querySelectorAll('.quiz-option');
        
        options.forEach(option => {
            option.addEventListener('click', () => {
                // Deselect other options in this question
                options.forEach(opt => opt.classList.remove('selected'));
                
                // Select this option
                option.classList.add('selected');
            });
        });
    });
    
    // Submit button handler
    submitButton.addEventListener('click', () => {
        let correctAnswers = 0;
        
        questions.forEach(question => {
            const selectedOption = question.querySelector('.quiz-option.selected');
            const options = question.querySelectorAll('.quiz-option');
            
            // Reset all options
            options.forEach(opt => {
                opt.classList.remove('correct', 'incorrect');
            });
            
            if (selectedOption) {
                const isCorrect = selectedOption.dataset.correct === 'true';
                
                if (isCorrect) {
                    selectedOption.classList.add('correct');
                    correctAnswers++;
                } else {
                    selectedOption.classList.add('incorrect');
                    
                    // Show the correct answer
                    options.forEach(opt => {
                        if (opt.dataset.correct === 'true') {
                            opt.classList.add('correct');
                        }
                    });
                }
            }
        });
        
        // Show results
        const totalQuestions = questions.length;
        resultContainer.innerHTML = `You got ${correctAnswers} out of ${totalQuestions} correct!`;
        resultContainer.style.display = 'block';
        
        // Show celebration if all correct
        if (correctAnswers === totalQuestions) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    });
}

// Drag and Drop functionality
function initDragDrop(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const draggables = container.querySelectorAll('.drag-item');
    const dropZones = container.querySelectorAll('.drop-zone');
    
    // Setup draggable items
    draggables.forEach(draggable => {
        draggable.setAttribute('draggable', 'true');
        
        draggable.addEventListener('dragstart', () => {
            draggable.classList.add('dragging');
        });
        
        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('dragging');
            
            // Check if all items are correctly placed
            checkCompletionStatus(container);
        });
    });
    
    // Setup drop zones
    dropZones.forEach(zone => {
        zone.addEventListener('dragover', e => {
            e.preventDefault();
            zone.classList.add('highlight');
        });
        
        zone.addEventListener('dragleave', () => {
            zone.classList.remove('highlight');
        });
        
        zone.addEventListener('drop', e => {
            e.preventDefault();
            zone.classList.remove('highlight');
            
            const draggable = container.querySelector('.dragging');
            if (draggable) {
                // Check if this is the correct zone
                const isCorrect = draggable.dataset.target === zone.dataset.id;
                
                // Add to the zone
                zone.appendChild(draggable);
                
                // Apply visual feedback
                if (isCorrect) {
                    draggable.classList.add('correct-placement');
                } else {
                    draggable.classList.add('incorrect-placement');
                }
            }
        });
    });
    
    // Function to check if activity is complete
    function checkCompletionStatus(container) {
        const totalItems = container.querySelectorAll('.drag-item').length;
        const correctItems = container.querySelectorAll('.drag-item.correct-placement').length;
        
        const completionMessage = container.querySelector('.completion-message');
        
        if (correctItems === totalItems) {
            completionMessage.textContent = 'Great job! All items are correctly placed!';
            completionMessage.style.display = 'block';
            
            // Add celebration effect
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        } else {
            completionMessage.style.display = 'none';
        }
    }
}

// AI Chat Simulator
function initChatSimulator(chatId) {
    const chatContainer = document.getElementById(chatId);
    if (!chatContainer) return;
    
    const messageContainer = chatContainer.querySelector('.chat-messages');
    const inputField = chatContainer.querySelector('.chat-input input');
    const sendButton = chatContainer.querySelector('.chat-input button');
    
    // Sample responses based on prompt patterns
    const responses = {
        'default': "I'm not sure how to respond to that. Could you try asking something about prompt engineering?",
        'hello': "Hello! I'm your AI assistant. How can I help you learn about prompt engineering today?",
        'what is': "That's a great question about definitions! When asking 'what is' questions, being specific helps AI give better answers.",
        'how to': "Good job using a 'how to' prompt! This format is excellent for getting step-by-step instructions.",
        'example': "Asking for examples is a smart prompt strategy! Examples help make concepts clearer.",
        'compare': "Nice comparison prompt! When you ask AI to compare things, you get organized information about similarities and differences.",
        'creative': "That's a creative prompt! I see you're asking for imagination-based content, which works well with AI systems."
    };
    
    // Add message to the chat
    function addMessage(text, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(isUser ? 'user-message' : 'ai-message');
        messageDiv.textContent = text;
        
        messageContainer.appendChild(messageDiv);
        messageContainer.scrollTop = messageContainer.scrollHeight;
    }
    
    // Generate AI response based on prompt
    function generateResponse(prompt) {
        const promptLower = prompt.toLowerCase();
        
        // Check for pattern matches
        for (const [pattern, response] of Object.entries(responses)) {
            if (pattern !== 'default' && promptLower.includes(pattern)) {
                return response;
            }
        }
        
        // Default response if no pattern matches
        return responses.default;
    }
    
    // Send message handler
    function sendMessage() {
        const message = inputField.value.trim();
        
        if (message) {
            // Add user message
            addMessage(message, true);
            
            // Clear input field
            inputField.value = '';
            
            // Simulate typing delay
            setTimeout(() => {
                // Generate and add AI response
                const response = generateResponse(message);
                addMessage(response, false);
            }, 1000);
        }
    }
    
    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Add initial greeting
    setTimeout(() => {
        addMessage("Hi there! I'm your AI assistant. Try asking me something using different prompt techniques!", false);
    }, 500);
}

// Initialize all interactive elements when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Init quizzes
    const quizzes = document.querySelectorAll('[id^="quiz-"]');
    quizzes.forEach(quiz => {
        initQuiz(quiz.id);
    });
    
    // Init drag-drop activities
    const dragDropActivities = document.querySelectorAll('[id^="drag-drop-"]');
    dragDropActivities.forEach(activity => {
        initDragDrop(activity.id);
    });
    
    // Init chat simulators
    const chatSimulators = document.querySelectorAll('[id^="chat-simulator-"]');
    chatSimulators.forEach(simulator => {
        initChatSimulator(simulator.id);
    });
});
