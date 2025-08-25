// Dynamic content management for steps and issues
class DynamicContentManager {
  constructor(progressTracker) {
    this.progressTracker = progressTracker;
  }

  setupDynamicButtons(itemCard, itemId) {
    // Avoid double-binding on the same card
    if (itemCard.dataset.dcmWired === '1') return;
    itemCard.dataset.dcmWired = '1';

    const addStepBtn = itemCard.querySelector('.add-step-btn');
    const addIssueBtn = itemCard.querySelector('.add-issue-btn');

    // Safer if itemId might contain special chars
    const stepsContainer  = itemCard.querySelector(`#${CSS.escape(itemId)}-steps-container`);
    const issuesContainer = itemCard.querySelector(`#${CSS.escape(itemId)}-issues-container`);

    if (!addStepBtn || !addIssueBtn || !stepsContainer || !issuesContainer) return;

    // --- Initial normalization for edit mode ---
    this.renumberSteps(stepsContainer);
    this.renumberIssues(issuesContainer);
    this.toggleRemoveButtons(stepsContainer, '.remove-step-btn', '.step-input-group');
    this.toggleRemoveButtons(issuesContainer, '.remove-issue-btn', '.issue-solution-group');

    // --- Add step ---
    addStepBtn.addEventListener('click', () => {
      const nextIndex = stepsContainer.querySelectorAll('.step-input-group').length + 1;

      const stepGroup = document.createElement('div');
      stepGroup.className = 'step-input-group fade-in';
      stepGroup.innerHTML = TEMPLATES.stepInput(itemId, nextIndex);

      stepsContainer.appendChild(stepGroup);

      this.toggleRemoveButtons(stepsContainer, '.remove-step-btn', '.step-input-group');
      this.progressTracker.triggerUpdate();
    });

    // --- Add issue ---
    addIssueBtn.addEventListener('click', () => {
      const nextIndex = issuesContainer.querySelectorAll('.issue-solution-group').length + 1;

      const issueGroup = document.createElement('div');
      issueGroup.className = 'issue-solution-group fade-in';
      issueGroup.innerHTML = TEMPLATES.issueInput(itemId, nextIndex);

      issuesContainer.appendChild(issueGroup);

      this.toggleRemoveButtons(issuesContainer, '.remove-issue-btn', '.issue-solution-group');
      this.progressTracker.triggerUpdate();
    });

    // --- Remove step ---
    stepsContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.remove-step-btn');
      if (!btn) return;

      const stepGroup = btn.closest('.step-input-group');
      if (!stepGroup) return;

      UIUtils.animateRemoval(stepGroup, () => {
        stepGroup.remove();

        this.renumberSteps(stepsContainer);
        this.toggleRemoveButtons(stepsContainer, '.remove-step-btn', '.step-input-group');
        this.progressTracker.triggerUpdate();
      });
    });

    // --- Remove issue ---
    issuesContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.remove-issue-btn');
      if (!btn) return;

      const issueGroup = btn.closest('.issue-solution-group');
      if (!issueGroup) return;

      UIUtils.animateRemoval(issueGroup, () => {
        issueGroup.remove();

        this.renumberIssues(issuesContainer);
        this.toggleRemoveButtons(issuesContainer, '.remove-issue-btn', '.issue-solution-group');
        this.progressTracker.triggerUpdate();
      });
    });
  }

  toggleRemoveButtons(container, btnSelector, groupSelector) {
    const count = container.querySelectorAll(groupSelector).length;
    const show = count > 1;
    container.querySelectorAll(btnSelector).forEach((btn) => {
      btn.style.display = show ? 'flex' : 'none';
    });
  }

  renumberSteps(stepsContainer) {
    // Update placeholders (and optionally name/id if your templates depend on the index)
    stepsContainer.querySelectorAll('.step-input').forEach((input, i) => {
      const n = i + 1;
      input.placeholder = `Step ${n}: Enter implementation step`;
      input.dataset.index = String(n);
      // If needed:
      // input.name = `step_${n}`;
      // input.id = `step_${n}`;
    });
  }

  renumberIssues(issuesContainer) {
    issuesContainer.querySelectorAll('.issue-input').forEach((input, i) => {
      const n = i + 1;
      input.placeholder = `Issue ${n}: Describe the problem`;
      input.dataset.index = String(n);
    });
    issuesContainer.querySelectorAll('.solution-input').forEach((input, i) => {
      const n = i + 1;
      input.placeholder = `Solution ${n}: Describe the solution`;
      input.dataset.index = String(n);
    });
  }
}
