let sortableInstance = null;

// Load data from storage or fallback to urls.json
function loadData(callback) {
  chrome.storage.local.get(['urls'], (result) => {
    if (result.urls) {
      callback(result.urls);
    } else {
      fetch(chrome.runtime.getURL('urls.json'))
        .then(res => res.json())
        .then(callback)
        .catch(err => console.error('Failed to load urls.json:', err));
    }
  });
}

// Save data to storage
function saveData(data, callback) {
  chrome.storage.local.set({ urls: data }, callback);
}

// Render the list of URLs
function renderList(data) {
  const container = document.getElementById('container');
  container.innerHTML = '';

  data.forEach((entry, index) => {
    const item = document.createElement('div');
    item.className = 'item';
    item.dataset.index = index;

    const left = document.createElement('div');
    left.className = 'item-left';

    const favicon = document.createElement('img');
    favicon.src = `https://www.google.com/s2/favicons?domain=${new URL(entry.url).hostname}`;
    favicon.width = 16;
    favicon.height = 16;

    const label = document.createElement('span');
    label.textContent = entry.label;

    left.appendChild(favicon);
    left.appendChild(label);

    const button = document.createElement('button');
    button.className = 'copy-btn';
    button.innerHTML = `
      <span class="icon copy-icon">📋</span>
      <span class="icon check-icon" style="display: none;">✅</span>
    `;

    button.addEventListener('click', () => {
      navigator.clipboard.writeText(entry.url)
        .then(() => {
          const copyIcon = button.querySelector('.copy-icon');
          const checkIcon = button.querySelector('.check-icon');

          copyIcon.style.display = 'none';
          checkIcon.style.display = 'inline';
          button.classList.add('copied');
          item.classList.add('copied');

          setTimeout(() => {
            checkIcon.style.display = 'none';
            copyIcon.style.display = 'inline';
            button.classList.remove('copied');
            item.classList.remove('copied');
          }, 1200);
        })
        .catch(err => console.error('Failed to copy:', err));
    });

    item.appendChild(left);
    item.appendChild(button);
    container.appendChild(item);
  });
}

// Render the editable entries for managing links
function renderEditableEntries(data) {
  const container = document.getElementById('container');
  container.innerHTML = '';

  data.forEach((entry, index) => {
    const item = document.createElement('div');
    item.className = 'item editable';
    item.dataset.index = index;

    const left = document.createElement('div');
    left.className = 'item-left editable-left';

    const titleWrapper = document.createElement('div');
    titleWrapper.className = 'editable-field';
    const titleLabel = document.createElement('label');
    titleLabel.textContent = 'Title';
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.value = entry.label;
    titleInput.className = 'edit-title';
    titleWrapper.appendChild(titleLabel);
    titleWrapper.appendChild(titleInput);

    const urlWrapper = document.createElement('div');
    urlWrapper.className = 'editable-field';
    const urlLabel = document.createElement('label');
    urlLabel.textContent = 'Link URL';
    const urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.value = entry.url;
    urlInput.className = 'edit-url';
    urlWrapper.appendChild(urlLabel);
    urlWrapper.appendChild(urlInput);

    left.appendChild(titleWrapper);
    left.appendChild(urlWrapper);

    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'editable-wrapper';
    contentWrapper.appendChild(left);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '🗑️';
    deleteBtn.addEventListener('click', () => {
      data.splice(index, 1);
      saveData(data, () => renderEditableEntries(data));
    });

    contentWrapper.appendChild(deleteBtn);
    item.appendChild(contentWrapper);
    container.appendChild(item);
  });

  if (sortableInstance) {
    sortableInstance.destroy();
  }

  sortableInstance = new Sortable(container, {
    animation: 150,
    ghostClass: 'dragging',
  });
}

// Render the modal for adding a new link
function renderAddForm(data) {
	const overlay = document.getElementById('modal-overlay');
	overlay.style.display = 'flex';
}

let isManaging = false;
let isAdding = false;

// Load initial data and set up event listeners
loadData((data) => {
  renderList(data);

	const footer = document.getElementById('footer');
	const containerWrapper = document.getElementById('container-wrapper');
	const manageBtn = document.getElementById('manage-btn');
	const doneBtn = document.getElementById('done-btn');
	const addLinkBtn = document.getElementById('add-link-btn');
	const modalCancelBtn = document.getElementById('cancel-add');
	const modalSaveBtn = document.getElementById('save-add');

	// Add Manage button functionality
  manageBtn.addEventListener('click', () => {
		isManaging = true;
		renderEditableEntries(data);
		footer.classList.add('editing');
		manageBtn.style.display = 'none';
		doneBtn.style.display = 'flex';
		addLinkBtn.style.display = 'flex';
		containerWrapper.style.marginBottom = '70px'; // Adjust for footer height
		if (sortableInstance) {
			sortableInstance.destroy();
			sortableInstance = null;
		}
  });

	// Add Done button functionality
	doneBtn.addEventListener('click', () => {
		const edited = [];
		const items = document.querySelectorAll('#container .item');

		items.forEach(item => {
			const label = item.querySelector('.edit-title').value.trim();
			const url = item.querySelector('.edit-url').value.trim();
			if (label && url) {
				edited.push({ label, url });
			}
		});

		saveData(edited, () => {
			data = edited;
			isManaging = false;
			renderList(data);
			if (sortableInstance) {
				sortableInstance.destroy();
				sortableInstance = null;
			}
			footer.classList.remove('editing');
			manageBtn.style.display = 'flex';
			doneBtn.style.display = 'none';
			addLinkBtn.style.display = 'none';
			containerWrapper.style.marginBottom = '40px'; // Adjust for footer height
		});
	});

	// Add Add button functionality
	addLinkBtn.addEventListener('click', () => {
		isAdding = true;
		renderAddForm();
	});

	// Add Cancel button functionality in modal
	modalCancelBtn.addEventListener('click', () => {
		isAdding = false;
		document.getElementById('modal-overlay').style.display = 'none';
	});

	// Add Save button functionality in modal
	modalSaveBtn.addEventListener('click', () => {
		const titleInput = document.querySelector('.new-title');
		const urlInput = document.querySelector('.new-url');
		const label = titleInput.value.trim();
		const url = urlInput.value.trim();

		if (!label || !url) return;

		const updated = [...data, { label, url }];
		saveData(updated, () => {
			isAdding = false;
			document.getElementById('modal-overlay').style.display = 'none';
			renderEditableEntries(updated);
		});
	});
});
