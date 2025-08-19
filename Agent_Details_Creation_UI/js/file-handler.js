// File import functionality
class FileHandler {
    constructor(importContainer, fileInput, itemManager) {
        this.importContainer = importContainer;
        this.fileInput = fileInput;
        this.itemManager = itemManager;
        this.dragCounter = 0;
        this.setupFileHandling();
    }
    
    setupFileHandling() {
        // Click to browse files
        this.importContainer.addEventListener('click', () => {
            this.fileInput.click();
        });

        // Global drag and drop functionality
        document.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
        
        document.addEventListener('dragenter', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.dragCounter++;
            if (this.dragCounter === 1) {
                this.importContainer.classList.add('dragover');
            }
        });
        
        document.addEventListener('dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.dragCounter--;
            if (this.dragCounter === 0) {
                this.importContainer.classList.remove('dragover');
            }
        });
        
        document.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.dragCounter = 0;
            this.importContainer.classList.remove('dragover');
            
            if (e.dataTransfer.files.length > 0) {
                const files = Array.from(e.dataTransfer.files);
                this.handleFiles(files);
            }
        });

        // Import container specific drag and drop
        this.importContainer.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });

        this.importContainer.addEventListener('dragenter', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });

        this.importContainer.addEventListener('dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });

        this.importContainer.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const files = Array.from(e.dataTransfer.files);
            this.handleFiles(files);
        });

        // File input change handler
        this.fileInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            this.handleFiles(files);
        });
    }
    
    handleFiles(files) {
        if (files.length === 0) {
            UIUtils.showNotification('No files selected', 'error');
            return;
        }
        
        const supportedFiles = [];
        const unsupportedFiles = [];
        
        files.forEach(file => {
            const isTextFile = file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt');
            const isJsonFile = file.type === 'application/json' || file.name.toLowerCase().endsWith('.json');
            
            if (isTextFile || isJsonFile) {
                supportedFiles.push(file);
            } else {
                unsupportedFiles.push(file.name);
            }
        });
        
        if (unsupportedFiles.length > 0) {
            UIUtils.showNotification(`Unsupported files: ${unsupportedFiles.join(', ')}. Only TXT and JSON files are supported.`, 'error');
        }
        
        if (supportedFiles.length === 0) {
            return;
        }
        
        // Process supported files with a small delay between each
        supportedFiles.forEach((file, index) => {
            setTimeout(() => {
                const isTextFile = file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt');
                if (isTextFile) {
                    this.readTextFile(file);
                } else {
                    this.readJsonFile(file);
                }
            }, index * CONFIG.ANIMATION_DELAY);
        });
        
        // Show processing notification for multiple files
        if (supportedFiles.length > 1) {
            UIUtils.showNotification(`Processing ${supportedFiles.length} files...`, 'success');
        }
    }
    
    readTextFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target.result;
                const parsedData = this.parseTxtFormat(content);
                if (parsedData) {
                    this.itemManager.addNewItem(parsedData);
                    UIUtils.showNotification(`✓ Successfully imported "${parsedData.itemName || parsedData.itemCode || 'Item'}" from ${file.name}`, 'success');
                }
            } catch (error) {
                UIUtils.showNotification(`Error reading ${file.name}: ${error.message}`, 'error');
            }
        };
        reader.readAsText(file);
    }
    
    readJsonFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = JSON.parse(e.target.result);
                let itemsAdded = 0;
                
                if (Array.isArray(content)) {
                    content.forEach((item, index) => {
                        setTimeout(() => {
                            this.itemManager.addNewItem(item);
                            itemsAdded++;
                            if (itemsAdded === content.length) {
                                UIUtils.showNotification(`Successfully imported ${itemsAdded} items from ${file.name}`, 'success');
                            }
                        }, index * CONFIG.STAGGER_DELAY);
                    });
                } else {
                    this.itemManager.addNewItem(content);
                    let itemName = '';
                    if (content.Item && content.Item.Name) {
                        itemName = content.Item.Name;
                    } else if (content.itemName) {
                        itemName = content.itemName;
                    } else if (content.name) {
                        itemName = content.name;
                    }
                    UIUtils.showNotification(`✓ Successfully imported "${itemName || 'Item'}" from ${file.name}`, 'success');
                }
            } catch (error) {
                UIUtils.showNotification(`Error parsing ${file.name}: Invalid JSON format - ${error.message}`, 'error');
            }
        };
        reader.readAsText(file);
    }
    
    parseTxtFormat(content) {
        const lines = content.split('\n').map(line => line.trim()).filter(line => line);
        const data = {
            itemName: '',
            itemCode: '',
            initialExplanation: '',
            steps: [],
            issues: [],
            solutions: []
        };

        let currentSection = '';
        let multiLineExplanation = '';

        for (const line of lines) {
            if (line.startsWith('Item Name:')) {
                data.itemName = line.replace('Item Name:', '').trim();
                currentSection = '';
            } else if (line.startsWith('Item Code:')) {
                data.itemCode = line.replace('Item Code:', '').trim();
                currentSection = '';
            } else if (line.startsWith('Initial Working Explanation:')) {
                const explanationText = line.replace('Initial Working Explanation:', '').trim();
                if (explanationText) {
                    data.initialExplanation = explanationText;
                }
                currentSection = 'explanation';
                multiLineExplanation = data.initialExplanation;
            } else if (line.startsWith('Implementation Steps:')) {
                currentSection = 'steps';
                // Finalize explanation if we were building it
                if (multiLineExplanation) {
                    data.initialExplanation = multiLineExplanation.trim();
                }
            } else if (line.startsWith('Common Issues & Solutions:')) {
                currentSection = 'issues';
            } else if (line.match(/^step\d+:/i)) {
                const stepText = line.replace(/^step\d+:\s*/i, '').trim();
                if (stepText) data.steps.push(stepText);
            } else if (line.match(/^issue\d+:/i)) {
                const issueText = line.replace(/^issue\d+:\s*/i, '').trim();
                if (issueText) data.issues.push(issueText);
            } else if (line.match(/^solution\d+:/i)) {
                const solutionText = line.replace(/^solution\d+:\s*/i, '').trim();
                if (solutionText) data.solutions.push(solutionText);
            } else if (currentSection === 'explanation' && line && 
                       !line.startsWith('Implementation Steps:') && 
                       !line.startsWith('Common Issues')) {
                // Continue adding to explanation if it's multi-line
                if (multiLineExplanation) {
                    multiLineExplanation += ' ' + line;
                } else {
                    multiLineExplanation = line;
                }
            }
        }

        // Finalize explanation if we were still building it
        if (currentSection === 'explanation' && multiLineExplanation) {
            data.initialExplanation = multiLineExplanation.trim();
        }

        // Validate required fields
        if (!data.itemName && !data.itemCode) {
            throw new Error('File must contain at least Item Name or Item Code');
        }

        return data;
    }
}
