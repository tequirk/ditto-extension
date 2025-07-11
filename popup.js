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
		try {
    	favicon.src = `https://www.google.com/s2/favicons?domain=${new URL(entry.url).hostname}`;
		} catch (e) {
			favicon.src = 'https://www.google.com/s2/favicons?domain=example.com'; // Fallback favicon
		}
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
	const addLinkBtn = document.getElementById('add-link-btn');
  container.innerHTML = '';

  data.forEach((entry, index) => {
    const item = document.createElement('div');
    item.className = 'item editable';
    item.dataset.index = index;
		let validationMessage = '';

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

		// Create per-item error message bar
		const validationBar = document.createElement('p');
		validationBar.className = 'error-message';
		validationBar.style.display = 'none';
		left.appendChild(validationBar);

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
			addLinkBtn.disabled = false;
			addLinkBtn.classList.remove('disabled');
		addLinkBtn.textContent = '+ New Link';
    });

	contentWrapper.appendChild(deleteBtn);
	item.appendChild(contentWrapper);
	container.appendChild(item);

	// Validation logic for each item
	function validateFields() {
	  const label = titleInput.value.trim();
	  const url = urlInput.value.trim();
	  if (!label) {
			validationMessage = 'A link title is required.';
			titleInput.classList.add('error');
			validationBar.textContent = validationMessage;
			validationBar.style.display = 'flex';
			return false;
	  } else if (!url) {
			titleInput.classList.remove('error');
			urlInput.classList.add('error');
			validationMessage = 'A link URL is required.';
			validationBar.textContent = validationMessage;
			validationBar.style.display = 'flex';
			return false;
	  } else if (data.some((entry, i) => i !== index && (entry.label === label || entry.url === url))) {
			titleInput.classList.add('error');
			urlInput.classList.add('error');
			validationMessage = 'A link with this title or URL already exists.';
			validationBar.textContent = validationMessage;
			validationBar.style.display = 'flex';
			titleInput.focus();
			return;
		} else if (!/^https?:\/\//i.test(url)) {
			titleInput.classList.remove('error');
			urlInput.classList.add('error');
			validationMessage = 'URL must start with http:// or https://';
			validationBar.textContent = validationMessage;
			validationBar.style.display = 'flex';
			return false;
	  } else {
			titleInput.classList.remove('error');
			urlInput.classList.remove('error');
			validationBar.textContent = '';
			validationBar.style.display = 'none';
			return true;
	  }
	}

	titleInput.addEventListener('input', validateFields);
	urlInput.addEventListener('input', validateFields);

  });

  if (sortableInstance) {
    sortableInstance.destroy();
  }

  sortableInstance = new Sortable(container, {
    animation: 150,
    ghostClass: 'dragging',
  });

	// Disable add link button if maximum entries reached
	if (data.length >= 6) {
		addLinkBtn.disabled = true;
		addLinkBtn.classList.add('disabled');
		addLinkBtn.textContent = 'Max 6 links reached';
	}
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

	let validationMessage = '';

	// Add Manage button functionality
  manageBtn.addEventListener('click', () => {
		isManaging = true;
		renderEditableEntries(data);
		footer.classList.add('editing');
		manageBtn.style.display = 'none';
		doneBtn.style.display = 'flex';
		addLinkBtn.style.display = 'flex';
		containerWrapper.style.marginBottom = '70px'; // Adjust for footer height
  });

	// Add Done button functionality
  doneBtn.addEventListener('click', () => {
	const edited = [];
	const items = document.querySelectorAll('#container .item');
	let hasError = false;

	items.forEach(item => {
	  const label = item.querySelector('.edit-title').value.trim();
	  const url = item.querySelector('.edit-url').value.trim();
	  const validationBar = item.querySelector('.error-message');
	  // Trigger validation for each item
	  if (item.querySelector('.edit-title')) {
		item.querySelector('.edit-title').dispatchEvent(new Event('input'));
	  }
	  if (item.querySelector('.edit-url')) {
		item.querySelector('.edit-url').dispatchEvent(new Event('input'));
	  }
	  // If error message is visible, block saving
	  if (validationBar && validationBar.style.display !== 'none' && validationBar.textContent) {
		hasError = true;
		validationBar.style.display = 'flex';
	  }
	  if (label && url) {
		edited.push({ label, url });
	  }
	});

	if (hasError) {
	  // Optionally, you can show a general message or highlight errors
	  // For now, just block saving
	  return;
	}

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
		document.querySelector('.new-title').focus();
	});

	// Add Cancel button functionality in modal
	modalCancelBtn.addEventListener('click', () => {
		isAdding = false;
		document.getElementById('modal-overlay').style.display = 'none';
		document.querySelector('.new-title').classList.remove('error');
		document.querySelector('.new-url').classList.remove('error');
		document.querySelector('.error-message').textContent = '';
		document.querySelector('.error-message').style.display = 'none';
		validationMessage = '';
		document.querySelector('.new-title').value = '';
		document.querySelector('.new-url').value = '';
	});

	// Add Save button functionality in modal
	modalSaveBtn.addEventListener('click', () => {
		const titleInput = document.querySelector('.new-title');
		const urlInput = document.querySelector('.new-url');
		const validationBar = document.querySelector('.new-error-message');
		const label = titleInput.value.trim();
		const url = urlInput.value.trim();

		if (!label) {
			validationMessage = 'A link title is required.';
			titleInput.classList.add('error');
			validationBar.textContent = validationMessage;
			validationBar.style.display = 'flex';
			titleInput.focus();
			return;
		} else if (!url) {
			titleInput.classList.remove('error');
			validationMessage = 'A link URL is required.';
			urlInput.classList.add('error');
			validationBar.textContent = validationMessage;
			validationBar.style.display = 'flex';
			urlInput.focus();
			return;
		} else if (data.some(entry => entry.label === label || entry.url === url)) {
			titleInput.classList.add('error');
			urlInput.classList.add('error');
			validationMessage = 'A link with this title or URL already exists.';
			validationBar.textContent = validationMessage;
			validationBar.style.display = 'flex';
			titleInput.focus();
			return;
		} else if (!/^https?:\/\//i.test(url)) {
			titleInput.classList.remove('error');
			urlInput.classList.add('error');
			validationMessage = 'URL must start with http:// or https://';
			validationBar.textContent = validationMessage;
			validationBar.style.display = 'flex';
			urlInput.focus();
			return;
		} else {
			urlInput.classList.remove('error');
			validationMessage = '';
			validationBar.style.display = 'none';
		}

		const updated = [...data, { label, url }];
		saveData(updated, () => {
			data = updated;
			isAdding = false;
			document.getElementById('modal-overlay').style.display = 'none';
			renderEditableEntries(data);
		});

		titleInput.value = '';
		urlInput.value = '';
		validationBar.textContent = '';
	});
});
