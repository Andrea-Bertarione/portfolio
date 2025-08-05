<script>
    import { onMount } from 'svelte';

    let links = $state([
        {
            name: "Github",
            link: "https://github.com/Andrea-Bertarione",
            color: "#000000",
            icon: "/icongithub.svg",
        },
        {
            name: "Discord",
            link: "https://discord.com/users/1402182554219712573",
            color: "#5865F2",
            icon: "/icondiscord.svg",
        },
        {
            name: "Contact me via Email",
            link: "mailto:Andrea.bertarione@gmail.com?subject=Interested%20in%20working%20with%20you&body=Hi Andrea,%20Im%20interested%20in%20working%20with%20you!",
            color: "#f20606",
            icon: "/iconmail.svg",
        },
        {
            name: "Take a look at my CV",
            link: "/Andrea Bertarione CV 2025.pdf",
            color: "#4da23f",
            icon: "/iconcv.svg",
        },
    ]);

    let showHero = $state(false);
    let showModal = $state(false);
    let formData = $state({
        name: '',
        email: '',
        reason: '',
        description: ''
    });
    let submissionStatus = $state('');
    let formErrors = $state({});

    onMount(async () => {
        showHero = true;
    });

    // Add this function to your existing script section
    function handleOverlayKeydown(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            if (event.target === event.currentTarget) {
                closeModal();
            }
        }
    }

    function openDetailsModal(event) {
        event.preventDefault();
        
        // Get form data from the initial form
        const form = event.target;
        const formDataObj = new FormData(form);
        
        // Validate required fields
        const errors = {};
        if (!formDataObj.get('email')) {
            errors.email = 'Email is required';
        }
        if (!formDataObj.get('reason')) {
            errors.reason = 'Please select a reason';
        }
        
        if (Object.keys(errors).length > 0) {
            formErrors = errors;
            return;
        }
        
        // Clear errors and populate form data
        formErrors = {};
        formData = {
            name: formDataObj.get('name') || '',
            email: formDataObj.get('email'),
            reason: formDataObj.get('reason'),
            description: formDataObj.get('description') || ''
        };
        
        showModal = true;
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        showModal = false;
        document.body.style.overflow = 'auto';
        submissionStatus = '';
    }

    async function handleFinalSubmit(event) {
        event.preventDefault();
        
        if (!formData.description.trim()) {
            formErrors = { description: 'Please enter your message' };
            return;
        }
        
        submissionStatus = 'submitting';
        
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                submissionStatus = 'success';
                setTimeout(() => {
                    closeModal();
                    document.getElementById('quick-contact-form').reset();
                    formData = { name: '', email: '', reason: '', description: '' };
                }, 3000);
            } else {
                submissionStatus = 'error';
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            submissionStatus = 'error';
        }
    }

    // Close modal when clicking outside
    function handleModalClick(event) {
        if (event.target === event.currentTarget) {
            closeModal();
        }
    }

    // Handle escape key
    function handleKeydown(event) {
        if (event.key === 'Escape' && showModal) {
            closeModal();
        }
    }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if showHero}
    <section id="Contacts"> 
        <h2>Contacts</h2>
        <div class="separator">
            <article class="form">
                <h3 class="gradient-text">Send me your idea</h3>
                <div class="box">
                    <form id="quick-contact-form" onsubmit={openDetailsModal}>
                        <textarea 
                            name="description" 
                            placeholder="Type here your ideas"
                            rows="6"
                        ></textarea>
                        <div class="wrap">
                            <input 
                                class="hero-gradient" 
                                type="text" 
                                name="name" 
                                placeholder="Your name"
                            >
                            <input 
                                class="hero-gradient" 
                                type="email" 
                                name="email" 
                                required 
                                placeholder="Your email"
                                class:error={formErrors.email}
                            >
                            <select 
                                class="hero-gradient reason" 
                                name="reason" 
                                required
                                class:error={formErrors.reason}
                            >
                                <option value="" disabled selected>Select reason...</option>
                                <option value="project">Project Inquiry</option>
                                <option value="job">Job Opportunity</option>
                                <option value="collaboration">Collaboration/Partner Up</option>
                                <option value="freelance">Freelance/Contract Work</option>
                                <option value="question">General Question</option>
                                <option value="feedback">Portfolio Feedback</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        
                        {#if formErrors.email || formErrors.reason}
                            <div class="error-messages">
                                {#if formErrors.email}<p class="error-text">{formErrors.email}</p>{/if}
                                {#if formErrors.reason}<p class="error-text">{formErrors.reason}</p>{/if}
                            </div>
                        {/if}
                        
                        <input type="submit" value="Next" class="submit-btn">
                    </form>
                </div>
            </article>
            <article class="links">
                {#each links as ref}
                    <a href={ref.link} style="color: {ref.color};">
                        <img src={ref.icon} alt={ref.name} width="28" height="28">
                        {ref.name}
                    </a>
                {/each}
            </article>    
        </div>
    </section>
{/if}

<!-- Modal -->
{#if showModal}
    <div 
        class="modal-overlay" 
        onclick={handleModalClick} 
        onkeydown={handleOverlayKeydown}
        role="dialog" 
        aria-modal="true" 
        tabindex="-1"
    >
        <div class="modal-content">
            <div class="modal-header">
                <h3>Complete Your Message</h3>
                <button 
                    class="close-btn" 
                    onclick={closeModal} 
                    aria-label="Close modal"
                    type="button"
                >&times;</button>
            </div>
            
            <div class="modal-body">
                {#if submissionStatus === 'submitting'}
                    <div class="status-message submitting">
                        <p>Sending your message...</p>
                        <div class="spinner"></div>
                    </div>
                {:else if submissionStatus === 'success'}
                    <div class="status-message success">
                        <p>✓ Message sent successfully!</p>
                        <p>I'll get back to you soon.</p>
                    </div>
                {:else if submissionStatus === 'error'}
                    <div class="status-message error">
                        <p>✗ Failed to send message.</p>
                        <p>Please try again or contact me directly.</p>
                        <button onclick={() => submissionStatus = ''} class="retry-btn">Try Again</button>
                    </div>
                {:else}
                    <div class="form-summary">
                        <p><strong>Name:</strong> {formData.name || 'Not provided'}</p>
                        <p><strong>Email:</strong> {formData.email}</p>
                        <p><strong>Reason:</strong> {formData.reason}</p>
                    </div>
                    
                    <form onsubmit={handleFinalSubmit}>
                        <label for="modal-message">Your detailed message:</label>
                        <textarea 
                            id="modal-message"
                            bind:value={formData.description}
                            placeholder="Please provide more details about your inquiry..."
                            rows="8"
                            required
                            class:error={formErrors.description}
                        ></textarea>
                        
                        {#if formErrors.description}
                            <p class="error-text">{formErrors.description}</p>
                        {/if}
                        
                        <div class="modal-actions">
                            <button type="button" onclick={closeModal} class="cancel-btn">Cancel</button>
                            <button type="submit" class="send-btn">Send Message</button>
                        </div>
                    </form>
                {/if}
            </div>
        </div>
    </div>
{/if}

<style>
    section {
        display: flex;
        flex-direction: column;
        max-width: 100%;
        width: 100%;
        min-height: 100vh;
        justify-content: start;
        align-items: center;
        background: #f7f8fa;
    }

    h2 {
        font-size: 3rem;
        font-weight: 900;
        margin-bottom: 2rem;
    }

    .separator {
        display: flex;
        align-items: flex-start;
        justify-content: center;
        width: 100%;
        height: 100%;
        gap: 2rem;
    }

    .form {
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: center;
        width: 75%;
        height: 100%;
    }

    .links {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 25%;
        gap: 1.5rem;
    }

    .links a {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        text-decoration: none;
        font-weight: 600;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        transition: all 0.3s ease;
        background: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.3);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .links a:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        background: rgba(255, 255, 255, 0.95);
    }

    h3 {
        font-size: 1.8rem;
        font-weight: 900;
        margin-bottom: 2rem;
    }

    /* Form container with glass effect */
    .box {
        width: 70%;
        min-height: 500px;
        border-radius: 20px;
        padding: 2.5rem;
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(15px);
        border: 1px solid rgba(255, 255, 255, 0.25);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    #quick-contact-form {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    /* Textarea with gradient background */
    #quick-contact-form textarea {
        width: 100%;
        min-height: 150px;
        padding: 1.5rem;
        box-sizing: border-box;
        background: linear-gradient(135deg, hsl(222, 47%, 11%) 0%, hsl(215, 25%, 27%) 50%, hsl(215, 20%, 65%) 100%);
        border: none;
        border-radius: 16px;
        font-family: inherit;
        font-size: 1rem;
        color: #ffffff;
        resize: vertical;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }

    #quick-contact-form textarea::placeholder {
        color: rgba(255, 255, 255, 0.7);
    }

    #quick-contact-form textarea:focus {
        outline: none;
        box-shadow: 0 4px 20px rgba(34, 102, 255, 0.3);
        transform: translateY(-2px);
    }

    /* Form row with inputs */
    .wrap {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        gap: 1rem;
    }

    .wrap > * {
        border-radius: 16px;
        border: none;
        text-align: center;
        flex: 1;
        padding: 1rem;
        font-size: 1rem;
        font-weight: 500;
        color: #ffffff;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }

    .wrap > *::placeholder {
        color: rgba(255, 255, 255, 0.7);
    }

    .wrap > *:focus {
        outline: none;
        box-shadow: 0 4px 20px rgba(34, 102, 255, 0.4);
        transform: translateY(-2px);
    }

    /* Autofill styles - matching your gradient */
    #quick-contact-form .wrap input:-webkit-autofill,
    #quick-contact-form .wrap input:-webkit-autofill:focus,
    #quick-contact-form .wrap input:-webkit-autofill:hover,
    #quick-contact-form .wrap input:-webkit-autofill:active {
        -webkit-box-shadow: 0 0 0 100px hsl(215, 25%, 27%) inset !important;
        box-shadow: 0 0 0 100px hsl(215, 25%, 27%) inset !important;
        -webkit-text-fill-color: #ffffff !important;
        caret-color: #ffffff !important;
    }

    /* Select dropdown styling */
    .reason {
        appearance: base-select;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
            Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
        cursor: pointer;
        background-image: url("data:image/svg+xml,%3Csvg width='18' height='18' fill='none' stroke='%23ffffff' stroke-width='2' viewBox='0 0 24 24'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 1rem center;
        background-size: 1.2rem;
        padding-right: 3rem !important;
        color: #000;
    }

    .reason:hover {
        box-shadow: 0 4px 20px rgba(67, 156, 255, 0.3);
        transform: translateY(-2px);
    }

    .reason:focus {
        box-shadow: 0 4px 25px rgba(67, 156, 255, 0.5);
        transform: translateY(-2px);
    }

    .reason::picker(select) {
        animation: fadeInDropdown 0.25s ease forwards;
        appearance: base-select;
        border-radius: 12px;
        background: linear-gradient(135deg, hsl(222, 47%, 11%) 0%, hsl(215, 25%, 27%) 50%, hsl(215, 20%, 65%) 100%);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: #ffffff;
        font-size: 1rem;
        padding: 0.5rem 0;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }

    .reason option {
        background: hsl(215, 25%, 27%);
        color: #ffffff;
        padding: 0.75rem 1rem;
    }

    .reason option:checked {
        background: linear-gradient(135deg, hsl(221, 83%, 53%), hsl(43, 96%, 56%));
        font-weight: 600;
        color: #ffffff;
    }

    @keyframes fadeInDropdown {
        from {
            opacity: 0;
            transform: scaleY(0.85);
        }
        to {
            opacity: 1;
            transform: scaleY(1);
        }
    }

    /* Submit button with gradient */
    .submit-btn {
        background: linear-gradient(135deg, hsl(221, 83%, 53%), hsl(43, 96%, 56%));
        color: white;
        border: none;
        justify-self: flex-end;
        align-self: flex-end;
        margin-top: auto;
        padding: 1.25rem 3rem;
        border-radius: 16px;
        font-size: 1.2rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 20px rgba(67, 156, 255, 0.3);
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .submit-btn:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 30px rgba(67, 156, 255, 0.4);
    }

    .submit-btn:active {
        transform: translateY(-1px);
    }

    /* Error styling */
    .wrap > *.error {
        box-shadow: 0 4px 20px rgba(220, 53, 69, 0.4) !important;
        animation: shake 0.5s ease-in-out;
    }

    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }

    .error-messages {
        background: rgba(220, 53, 69, 0.1);
        border: 1px solid rgba(220, 53, 69, 0.3);
        border-radius: 12px;
        padding: 1rem;
        backdrop-filter: blur(10px);
    }

    .error-text {
        color: #dc3545;
        font-size: 0.9rem;
        font-weight: 600;
        margin: 0;
    }

    /* Modal styling with your color scheme */
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(34, 41, 69, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        backdrop-filter: blur(8px);
        animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    .modal-content {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 24px;
        max-width: 800px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        animation: slideIn 0.3s ease;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-50px) scale(0.9);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 2rem 2.5rem 1rem;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }

    .modal-header h3 {
        margin: 0;
        font-size: 1.8rem;
        background: linear-gradient(270deg, hsl(221, 83%, 53%), hsl(43, 96%, 56%));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .close-btn {
        background: none;
        border: none;
        font-size: 2rem;
        cursor: pointer;
        color: #666;
        transition: all 0.2s ease;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .close-btn:hover {
        background: rgba(220, 53, 69, 0.1);
        color: #dc3545;
    }

    .modal-body {
        padding: 2rem 2.5rem;
    }

    .form-summary {
        width: 40%;
        background: linear-gradient(135deg, hsl(222, 47%, 11%) 0%, hsl(215, 25%, 27%) 50%, hsl(215, 20%, 65%) 100%);
        border-radius: 16px;
        padding: 1.5rem;
        margin-bottom: 2rem;
        color: white;
    }

    .form-summary p {
        margin: 0.75rem 0;
        font-weight: 500;
    }

    .modal-body textarea {
        width: 90%;
        min-height: 150px;
        padding: 1.5rem;
        background: linear-gradient(135deg, hsl(222, 47%, 11%) 0%, hsl(215, 25%, 27%) 50%, hsl(215, 20%, 65%) 100%);
        color: white;
        border: none;
        border-radius: 16px;
        font-family: inherit;
        font-size: 1rem;
        resize: vertical;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    }

    .modal-body textarea::placeholder {
        color: rgba(255, 255, 255, 0.7);
    }

    .modal-body textarea:focus {
        outline: none;
        box-shadow: 0 4px 25px rgba(67, 156, 255, 0.4);
        transform: translateY(-2px);
    }

    .modal-body label {
        display: block;
        margin-bottom: 1rem;
        font-weight: 600;
        color: #333;
    }

    .modal-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
        margin-top: 2rem;
    }

    .cancel-btn, .send-btn, .retry-btn {
        padding: 1rem 2rem;
        border-radius: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        border: none;
        font-size: 1rem;
    }

    .cancel-btn {
        background: rgba(108, 117, 125, 0.2);
        color: #6c757d;
        backdrop-filter: blur(10px);
    }

    .cancel-btn:hover {
        background: rgba(108, 117, 125, 0.3);
        transform: translateY(-2px);
    }

    .send-btn {
        background: linear-gradient(135deg, hsl(221, 83%, 53%), hsl(43, 96%, 56%));
        color: white;
    }

    .send-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(67, 156, 255, 0.4);
    }

    .retry-btn {
        background: #17a2b8;
        color: white;
        margin-top: 1rem;
    }

    .retry-btn:hover {
        background: #138496;
        transform: translateY(-2px);
    }

    /* Status messages */
    .status-message {
        text-align: center;
        padding: 3rem 2rem;
        font-size: 1.1rem;
    }

    .status-message.success {
        color: #28a745;
    }

    .status-message.error {
        color: #dc3545;
    }

    .status-message.submitting {
        background: linear-gradient(270deg, hsl(221, 83%, 53%), hsl(43, 96%, 56%));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .spinner {
        border: 3px solid rgba(67, 156, 255, 0.3);
        border-top: 3px solid hsl(221, 83%, 53%);
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
        margin: 1.5rem auto;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    /* Responsive design */
    @media (max-width: 768px) {
        .separator {
            flex-direction: column;
            gap: 2rem;
            margin-bottom: 20px;
        }
        
        .form, .links {
            width: 100%;
        }
        
        .wrap {
            flex-direction: column;
        }

        .form-summary {
            width: 90%;
        }
        
        .modal-content {
            width: 95%;
            margin: 1rem;
        }
        
        .modal-header, .modal-body {
            padding: 1.5rem;
        }
        
        .box {
            width: 90%;
        }

        h2 {
            font-size: 2.5rem;
        }

        h3 {
            font-size: 1.5rem;
        }

        .submit-btn {
            justify-self: center;
            align-self: center;
            margin-top: 20px;
        }
    }
</style>
