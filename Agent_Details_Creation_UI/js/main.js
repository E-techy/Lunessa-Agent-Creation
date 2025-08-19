// Main application entry point
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const itemsContainer = document.getElementById('itemsContainer');
    const addItemBtn = document.getElementById('addItemBtn');
    const progressFill = document.querySelector('.progress-fill');
    const progressPercent = document.querySelector('.progress-percent');
    const importContainer = document.getElementById('importContainer');
    const fileInput = document.getElementById('fileInput');
    const form = document.getElementById('companyAgentForm');

    // Initialize core components
    const progressTracker = new ProgressTracker(progressFill, progressPercent);
    const dynamicContentManager = new DynamicContentManager(progressTracker);
    const itemManager = new ItemManager(itemsContainer, progressTracker, dynamicContentManager);
    const fileHandler = new FileHandler(importContainer, fileInput, itemManager);
    const formController = new FormController(form, itemManager);
    const eventListeners = new EventListeners(itemManager, fileHandler, formController, progressTracker);

    // Make progressTracker globally available for DataPopulator
    window.progressTracker = progressTracker;

    // Inject required styles
    UIUtils.injectStyles();

    // Initial progress update
    progressTracker.updateProgress();
});
