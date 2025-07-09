let sortableInstance = null;

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

function saveData(data, callback) {
  chrome.storage.local.set({ urls: data }, callback);
}

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

function renderEditableEntries(data) {
  const container = document.getElementById('container');
  container.innerHTML = '';

  data.forEach((entry, index) => {
    const item = document.createElement('div');
    item.className = 'item editable';
    item.dataset.index = index;

    const left = document.createElement('div');
    left.className = 'item-left editable-left';

    // -- title input --
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

    // -- url input --
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

		// Delete button
		const deleteBtn = document.createElement('button');
		deleteBtn.className = 'delete-btn';
		deleteBtn.innerHTML = '🗑️'; // You can use an SVG if you want

		deleteBtn.addEventListener('click', () => {
			data.splice(index, 1);
			saveData(data, () => renderEditableEntries(data));
		});

		contentWrapper.appendChild(deleteBtn);
		item.appendChild(contentWrapper);
    container.appendChild(item);
  });

	const addBtn = document.createElement('button');
  addBtn.textContent = 'Add Link';
  addBtn.className = 'text-btn';
  addBtn.style.marginTop = '12px';
  addBtn.style.alignSelf = 'center';

  addBtn.addEventListener('click', () => {
    renderAddForm(data);
  });

  container.appendChild(addBtn);

	if (sortableInstance) {
		sortableInstance.destroy();
	}

	sortableInstance = new Sortable(container, {
		animation: 150,
		ghostClass: 'dragging',
	});

  // 🧲 Enable drag-and-drop only in edit mode
  new Sortable(container, {
    animation: 150,
    ghostClass: 'dragging',
  });
}

// function setupAddForm(data) {
//   const addForm = document.getElementById('add-form');
//   const titleInput = document.getElementById('new-title');
//   const urlInput = document.getElementById('new-url');
//   const saveBtn = document.getElementById('save-add');
//   const cancelBtn = document.getElementById('cancel-add');

//   cancelBtn.addEventListener('click', () => {
//     addForm.style.display = 'none';
//     titleInput.value = '';
//     urlInput.value = '';
//   });

//   saveBtn.addEventListener('click', () => {
//     const title = titleInput.value.trim();
//     const url = urlInput.value.trim();
//     if (!title || !url) return;

//     const newData = [...data, { label: title, url }];
//     saveData(newData, () => {
//       addForm.style.display = 'none';
//       titleInput.value = '';
//       urlInput.value = '';
//       renderList(newData);
//     });
//   });
// }

function renderAddForm(data) {
  const container = document.getElementById('container');

  const form = document.createElement('div');
  form.className = 'add-form';

  const titleWrapper = document.createElement('div');
  titleWrapper.className = 'editable-field';
  const titleLabel = document.createElement('label');
  titleLabel.textContent = 'Link Title';
  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.className = 'edit-title';
  titleWrapper.appendChild(titleLabel);
  titleWrapper.appendChild(titleInput);

  const urlWrapper = document.createElement('div');
  urlWrapper.className = 'editable-field';
  const urlLabel = document.createElement('label');
  urlLabel.textContent = 'Link URL';
  const urlInput = document.createElement('input');
  urlInput.type = 'text';
  urlInput.className = 'edit-url';
  urlWrapper.appendChild(urlLabel);
  urlWrapper.appendChild(urlInput);

  const actions = document.createElement('div');
  actions.style.display = 'flex';
  actions.style.gap = '8px';

  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Save';
  saveBtn.className = 'text-btn';
  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Cancel';
  cancelBtn.className = 'text-btn';

  cancelBtn.addEventListener('click', () => form.remove());

  saveBtn.addEventListener('click', () => {
    const label = titleInput.value.trim();
    const url = urlInput.value.trim();
    if (!label || !url) return;

    const updated = [...data, { label, url }];
    saveData(updated, () => renderEditableEntries(updated));
  });

  actions.appendChild(saveBtn);
  actions.appendChild(cancelBtn);

  form.appendChild(titleWrapper);
  form.appendChild(urlWrapper);
  form.appendChild(actions);

  container.appendChild(form);
}

loadData((data) => {
  renderList(data);

  let isManaging = false;
  let isAdding = false;

  const manageBtn = document.getElementById('manage-btn');
  const addBtn = document.getElementById('add-btn');
  const addForm = document.getElementById('add-form');

  manageBtn.addEventListener('click', () => {
    if (isManaging) {
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
				isManaging = false;
				manageBtn.textContent = 'Manage List';
				renderList(edited);
			});

			if (sortableInstance) {
				sortableInstance.destroy();
				sortableInstance = null;
			}
		} else {
      isManaging = true;
      isAdding = false;
      addForm.style.display = 'none';
      manageBtn.textContent = 'Done';
      renderEditableEntries(data);
    }
  });

  addBtn.addEventListener('click', () => {
    isAdding = !isAdding;
    isManaging = false;
    manageBtn.textContent = 'Manage List';
    renderList(data);
    addForm.style.display = isAdding ? 'flex' : 'none';
  });

  setupAddForm(data);
});
