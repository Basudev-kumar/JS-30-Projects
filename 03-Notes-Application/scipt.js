// DOM Elements
const btnEl = document.getElementById("btn");
const appEl = document.getElementById("App");
const themeToggle = document.querySelector(".theme-toggle");
const noteCountEl = document.getElementById("note-count");
const charCountEl = document.getElementById("char-count");
const notificationEl = document.getElementById("notification");

// Initialize app
function init() {
    loadTheme();
    renderNotes();
    updateStats();
    
    // Set up event listeners
    btnEl.addEventListener("click", addNote);
    themeToggle.addEventListener("click", toggleTheme);
    
    // Make notes draggable
    makeNotesDraggable();
}

// Theme management
function loadTheme() {
    const savedTheme = localStorage.getItem("notes-theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";
    
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("notes-theme", newTheme);
    updateThemeIcon(newTheme);
    showNotification(`Switched to ${newTheme} mode`);
}

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector("i");
    icon.className = theme === "dark" ? "fas fa-sun" : "fas fa-moon";
}

// Note management
function getNotes() {
    return JSON.parse(localStorage.getItem("note-app") || "[]");
}

function saveNote(notes) {
    localStorage.setItem("note-app", JSON.stringify(notes));
    updateStats();
}

function createNoteEl(id, content, color = "#6c5ce7") {
    const element = document.createElement("textarea");
    element.classList.add("note");
    element.placeholder = "Start writing...";
    element.value = content;
    element.setAttribute("aria-label", "Note content");
    
    // Create note container with color and actions
    const noteContainer = document.createElement("div");
    noteContainer.className = "note-container";
    noteContainer.innerHTML = `
        <div class="note-color" style="background: ${color}"></div>
        <div class="note-actions">
            <button class="note-action" aria-label="Change color">
                <i class="fas fa-palette"></i>
            </button>
            <button class="note-action" aria-label="Delete note">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    noteContainer.prepend(element);
    
    // Double click to delete (with confirmation)
    noteContainer.addEventListener("dblclick", (e) => {
        if (e.target.classList.contains("note-action")) return;
        confirmDeleteNote(id, noteContainer);
    });
    
    // Input event for saving
    element.addEventListener("input", () => {
        updateNote(id, element.value);
    });
    
    // Delete button
    const deleteBtn = noteContainer.querySelector(".fa-trash").parentElement;
    deleteBtn.addEventListener("click", () => confirmDeleteNote(id, noteContainer));
    
    // Color change button
    const colorBtn = noteContainer.querySelector(".fa-palette").parentElement;
    colorBtn.addEventListener("click", () => changeNoteColor(id, noteContainer));
    
    // Make draggable
    noteContainer.draggable = true;
    noteContainer.dataset.id = id;
    
    return noteContainer;
}

function confirmDeleteNote(id, element) {
    showNotification("Note deleted", "error");
    deleteNote(id, element);
}

function deleteNote(id, element) {
    const notes = getNotes().filter((note) => note.id != id);
    saveNote(notes);
    element.classList.add("fade-out");
    setTimeout(() => {
        appEl.removeChild(element);
    }, 300);
}

function updateNote(id, content) {
    const notes = getNotes();
    const target = notes.find((note) => note.id == id);
    if (target) {
        target.content = content;
        saveNote(notes);
    }
    updateStats();
}

function changeNoteColor(id, element) {
    const colors = ["#6c5ce7", "#00b894", "#fd79a8", "#fdcb6e", "#0984e3", "#e17055"];
    const notes = getNotes();
    const target = notes.find((note) => note.id == id);
    
    if (target) {
        const currentIndex = colors.indexOf(target.color || "#6c5ce7");
        const nextIndex = (currentIndex + 1) % colors.length;
        target.color = colors[nextIndex];
        saveNote(notes);
        
        const colorBar = element.querySelector(".note-color");
        colorBar.style.background = target.color;
        showNotification("Note color changed");
    }
}

function addNote() {
    const notes = getNotes();
    const colors = ["#6c5ce7", "#00b894", "#fd79a8", "#fdcb6e", "#0984e3", "#e17055"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const noteObj = {
        id: Math.floor(Math.random() * 100000),
        content: "",
        color: randomColor
    };
    
    const noteEl = createNoteEl(noteObj.id, noteObj.content, noteObj.color);
    appEl.insertBefore(noteEl, btnEl);
    
    notes.push(noteObj);
    saveNote(notes);
    showNotification("New note added");
    
    // Focus the new note
    setTimeout(() => {
        const textarea = noteEl.querySelector("textarea");
        textarea.focus();
    }, 0);
}

function renderNotes() {
    getNotes().forEach((note) => {
        const noteEl = createNoteEl(note.id, note.content, note.color);
        appEl.insertBefore(noteEl, btnEl);
    });
}

// Stats and counters
function updateStats() {
    const notes = getNotes();
    const totalChars = notes.reduce((sum, note) => sum + note.content.length, 0);
    
    noteCountEl.textContent = `${notes.length} ${notes.length === 1 ? "note" : "notes"}`;
    charCountEl.textContent = `${totalChars} characters`;
}

// Notification system
function showNotification(message, type = "success") {
    notificationEl.textContent = message;
    notificationEl.className = "notification show";
    
    // Add type class for different styles
    notificationEl.classList.add(type);
    
    setTimeout(() => {
        notificationEl.classList.remove("show");
        setTimeout(() => {
            notificationEl.classList.remove(type);
        }, 300);
    }, 3000);
}

// Drag and drop functionality
function makeNotesDraggable() {
    let draggedItem = null;
    
    appEl.addEventListener("dragstart", (e) => {
        if (e.target.classList.contains("note-container")) {
            draggedItem = e.target;
            setTimeout(() => {
                e.target.classList.add("dragging");
            }, 0);
        }
    });
    
    appEl.addEventListener("dragend", (e) => {
        if (e.target.classList.contains("note-container")) {
            e.target.classList.remove("dragging");
        }
    });
    
    appEl.addEventListener("dragover", (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(e.clientY);
        const currentNote = document.querySelector(".dragging");
        
        if (afterElement == null) {
            appEl.insertBefore(currentNote, btnEl);
        } else {
            appEl.insertBefore(currentNote, afterElement);
        }
    });
    
    // Save new order after drop
    appEl.addEventListener("dragend", () => {
        const notes = getNotes();
        const noteElements = Array.from(document.querySelectorAll(".note-container"));
        
        // Reorder notes array based on DOM order
        const reorderedNotes = noteElements.map(el => {
            return notes.find(note => note.id == el.dataset.id);
        }).filter(note => note); // Remove undefined
        
        saveNote(reorderedNotes);
    });
}

function getDragAfterElement(y) {
    const draggableElements = [...document.querySelectorAll(".note-container:not(.dragging)")];
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Initialize the app
init();
























// const btnEl = document.getElementById("btn");
// const appEl = document.getElementById("App");

// getNotes().forEach((note)=>{
//     const noteEl = createNoteEl(note.id,note.content);
//     appEl.insertBefore(noteEl,btnEl);
// });

// function createNoteEl(id,content){

//     const element = document.createElement("textarea");
//     element.classList.add("note");
//     element.placeholder = "Empty Note";
//     element.value = content;

//     element.addEventListener("dblclick",()=>{
//             const warning = confirm("Do you want to delete this note?");
//             if(warning){
//                 deleteNote(id,element)
//             }
//     });

//     element.addEventListener("input",()=>{
//         updateNote(id,element.value);
//     });


//     return element;

// }

// function deleteNote(id,element){

//     notes = getNotes().filter((note)=> note.id!=id);
//     saveNote(notes);
//     appEl.removeChild(element);

// }

// function updateNote(id,content){
//    const notes = getNotes();
//    const target = notes.filter((note)=> note.id==id)[0]; 
//    target.content = content; 
//    saveNote(notes);
// }



// function addNote(){
//     // id , content

//     const notes = getNotes();

//     const noteObj = {
//             id: Math.floor(Math.random() * 10000),
//             content: ""           
//     };

//     const noteEl = createNoteEl(noteObj.id,noteObj.content);
//     appEl.insertBefore(noteEl,btnEl);

//     notes.push(noteObj);

//     saveNote(notes)
// }

// function saveNote(notes){
//     localStorage.setItem("note-app",JSON.stringify(notes));
// }

// function getNotes(){
//     return JSON.parse(localStorage.getItem("note-app") || "[]");
// }


// btnEl.addEventListener("click",addNote);