document.addEventListener('DOMContentLoaded', () => {
    const darkModeBtn = document.getElementById('darkModeBtn');
    const saveBtn = document.getElementById('saveBtn');
    const savePdfBtn = document.getElementById('savePdfBtn');  // Fixed Save PDF button reference
    const clearBtn = document.getElementById('clearBtn');
    const status = document.getElementById('status');
    const usernameInput = document.getElementById('username');
    const editor = document.getElementById('editor');
    const codeEditor = document.getElementById('codeEditor');

    let username = '';
    let socketId = Math.floor(Math.random() * 10000); // Random ID for user
    let userColor = `user-${(socketId % 4) + 1}`; // Assign colors to users (4 colors)

    // WebSocket connection
    const socket = new WebSocket(`ws://${window.location.host}`);

    // User sets their username
    usernameInput.addEventListener('input', () => {
        username = usernameInput.value;
        if (username.trim() !== '') {
            socket.send(JSON.stringify({
                type: 'user-update',
                username: username,
                socketId: socketId
            }));
        }
    });

    // Auto load from localStorage
    window.addEventListener('load', () => {
        const saved = localStorage.getItem('collaborativeText');
        if (saved) {
            editor.value = saved;
        }
    });

    // Auto save to localStorage
    editor.addEventListener('input', () => {
        localStorage.setItem('collaborativeText', editor.value);

        // Notify others
        socket.send(JSON.stringify({
            type: 'text-update',
            text: editor.value,
            sender: socketId,
            username: username
        }));
    });

    // WebSocket events
    socket.addEventListener('open', () => {
        status.textContent = "Status: Connected ✅";
    });

    socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);

        if (data.type === 'text-update' && data.sender !== socketId) {
            highlightIncoming();
            editor.value = data.text;
            localStorage.setItem('collaborativeText', data.text);
        }

        if (data.type === 'user-update') {
            // Handle new user (could highlight their text or something else)
        }
    });

    // Highlight when incoming update
    function highlightIncoming() {
        editor.classList.add('highlight');
        setTimeout(() => editor.classList.remove('highlight'), 500);
    }

    // Dark mode toggle
    darkModeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });

 
    saveBtn.addEventListener('click', () => {
        const text = editor.value;
        const blob = new Blob([text], { type: "text/plain" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'shared_document.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });

    // Save document as PDF
    savePdfBtn.addEventListener('click', () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Get text from editor and add to PDF
        const text = editor.value;
        doc.text(text, 10, 10);
        
        // Save PDF file
        doc.save('shared_document.pdf');
    });

    // Clear document
    clearBtn.addEventListener('click', () => {
        editor.value = '';
        localStorage.setItem('collaborativeText', '');
        socket.send(JSON.stringify({
            type: 'text-update',
            text: '',
            sender: socketId,
            username: username
        }));
    });

    const cmEditor = CodeMirror.fromTextArea(codeEditor, {
        mode: "javascript",
        lineNumbers: true,
        theme: "default"
    });

    
    function createStickyNote() {
        const note = document.createElement('div');
        note.classList.add('sticky-note');
        note.innerHTML = `
            <div class="sticky-note-header">Sticky Note</div>
            <textarea placeholder="Write your note here..."></textarea>
        `;
        document.getElementById('stickyNotesContainer').appendChild(note);

        
        interact(note).draggable({
            onmove(event) {
                const { target } = event;
                const data = target.getBoundingClientRect();
                target.style.left = `${event.clientX - data.width / 2}px`;
                target.style.top = `${event.clientY - data.height / 2}px`;
            }
        });
    }

    // Add sticky note functionality
    document.getElementById('addStickyNote').addEventListener('click', createStickyNote);

    // Clear All Notes
    document.getElementById('clearBtn').addEventListener('click', () => {
        document.getElementById('stickyNotesContainer').innerHTML = '';
    });
});
