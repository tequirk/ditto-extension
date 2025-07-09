fetch(chrome.runtime.getURL('urls.json'))
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById('container');

    data.forEach((entry, index) => {
			const item = document.createElement('div');
			item.className = 'item';
			item.dataset.index = index;

			const left = document.createElement('div');
			left.className = 'item-left'; // Add class for styling

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
				<span class="icon copy-icon">
					<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 25 25">
						<path d="M16 1H4a2 2 0 0 0-2 2v14h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 18H8V7h11v16z"/>
					</svg>
				</span>
				<span class="icon check-icon" style="display: none;">
					<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 22 22" fill="currentColor">
						<path d="M9 16.2l-3.5-3.5L4 14.2 9 19 20 8l-1.4-1.4z"/>
					</svg>
				</span>
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
							button.classList.remove('copied')
							item.classList.remove('copied');
						}, 1200);
					})
					.catch(err => console.error('Failed to copy:', err));
			});

			item.appendChild(left);
			item.appendChild(button);
			container.appendChild(item);
		});

		// Initialize SortableJS
    new Sortable(container, {
      animation: 150,
      ghostClass: 'dragging',
    });
  }).catch(err => console.error('Failed to load URLs:', err));
