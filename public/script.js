document.addEventListener('DOMContentLoaded', () => {
    const darkModeBtn = document.getElementById('darkModeBtn');
    const saveBtn = document.getElementById('saveBtn');
    const savePdfBtn = document.getElementById('savePdfBtn'); 
    const clearBtn = document.getElementById('clearBtn');
    const status = document.getElementById('status');
    const usernameInput = document.getElementById('username');
    const editor = document.getElementById('editor');
    const codeEditor = document.getElementById('codeEditor');

    let username = '';
    let socketId = Math.floor(Math.random() * 10000); 
    let userColor = `user-${(socketId % 4) + 1}`; 

   const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
   const socket = new WebSocket(`${protocol}://${window.location.host}`);


   
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

   
    window.addEventListener('load', () => {
        const saved = localStorage.getItem('collaborativeText');
        if (saved) {
            editor.value = saved;
        }
    });

    
    editor.addEventListener('input', () => {
        localStorage.setItem('collaborativeText', editor.value);

        
        socket.send(JSON.stringify({
            type: 'text-update',
            text: editor.value,
            sender: socketId,
            username: username
        }));
    });

    
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
            
        }
    });

    
    function highlightIncoming() {
        editor.classList.add('highlight');
        setTimeout(() => editor.classList.remove('highlight'), 500);
    }

   
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

    
    savePdfBtn.addEventListener('click', () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        
        const text = editor.value;
        doc.text(text, 10, 10);
        
       
        doc.save('shared_document.pdf');
    });

    
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

    
    document.getElementById('addStickyNote').addEventListener('click', createStickyNote);

   
    document.getElementById('clearBtn').addEventListener('click', () => {
        document.getElementById('stickyNotesContainer').innerHTML = '';
    });
});
