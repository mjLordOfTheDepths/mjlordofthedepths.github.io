document.addEventListener("DOMContentLoaded", function() {
	var tabBars = document.querySelectorAll('.tab-bar');
	tabBars.forEach(function(tabBar) {
		var isDragging = false;
		var offsetX = 0;
		var offsetY = 0;
		var parentWindow = tabBar.closest('.windows-tab');
		if (!parentWindow) return;

		tabBar.addEventListener('mousedown', function(e) {
			isDragging = true;
			parentWindow.style.position = 'fixed';
			// Calculate offset between mouse and window top-left
			var rect = parentWindow.getBoundingClientRect();
			offsetX = e.clientX - rect.left;
			offsetY = e.clientY - rect.top;
			// Bring window to front
			parentWindow.style.zIndex = 1000;
            // Remove margins so window follows pointer directly
            parentWindow.style.marginLeft = '0';
            parentWindow.style.marginRight = '0';
			// Fix images inside tab from resizing
			var imgs = parentWindow.querySelectorAll('img');
			imgs.forEach(function(img) {
				// Only apply to images NOT inside .tab-bar
				var insideTabBar = false;
				var node = img.parentNode;
				while (node && node !== parentWindow) {
					if (node.classList && node.classList.contains('tab-bar')) {
						insideTabBar = true;
						break;
					}
					node = node.parentNode;
				}
				if (!insideTabBar) {
					img._originalWidth = img.naturalWidth;
					img._originalHeight = img.naturalHeight;
					img.style.width = img.naturalWidth + 'px';
					img.style.height = img.naturalHeight + 'px';
					img.style.maxWidth = img.naturalWidth + 'px';
					img.style.maxHeight = img.naturalHeight + 'px';
				}
			});
			// Lock window width during drag
			parentWindow._originalWidth = parentWindow.style.width;
			parentWindow.style.width = rect.width + 'px';
		});

		document.addEventListener('mousemove', function(e) {
			if (isDragging) {
				// Disable pointer events for everything except the dragged window
				document.body.style.pointerEvents = 'none';
				parentWindow.style.pointerEvents = 'auto';
				// Disable text/image selection
				document.body.style.userSelect = 'none';
				// Clamp window position and width to viewport
				var winWidth = parentWindow.offsetWidth;
				var winHeight = parentWindow.offsetHeight;
				var viewportWidth = window.innerWidth;
				var viewportHeight = window.innerHeight;
				var newLeft = e.clientX - offsetX;
				var newTop = e.clientY - offsetY;
				// Clamp width if window is wider than viewport
				if (winWidth > viewportWidth) {
					parentWindow.style.width = viewportWidth + 'px';
					winWidth = viewportWidth;
				}
				// Allow dragging window off the viewport (no clamping)
				// newLeft and newTop can be negative or beyond viewport
				parentWindow.style.left = newLeft + 'px';
				parentWindow.style.top = newTop + 'px';
				parentWindow.style.bottom = '';
				parentWindow.style.right = '';
                parentWindow.style.marginLeft = '0';
                // Special fix for clippy advice tab
                if (parentWindow.id === 'clippy-advice') {
                    parentWindow.style.bottom = 'auto';
                    parentWindow.style.right = 'auto';
                    parentWindow.style.marginLeft = '0';
                    parentWindow.style.width = 'auto';
                }
			}
		});

		document.addEventListener('mouseup', function() {
			isDragging = false;
            // Re-enable pointer events for everything
            document.body.style.pointerEvents = '';
		// Re-enable text/image selection
		document.body.style.userSelect = '';
			// Restore image size after dragging
			var imgs = parentWindow.querySelectorAll('img');
			imgs.forEach(function(img) {
				// Only apply to images NOT inside .tab-bar
				var insideTabBar = false;
				var node = img.parentNode;
				while (node && node !== parentWindow) {
					if (node.classList && node.classList.contains('tab-bar')) {
						insideTabBar = true;
						break;
					}
					node = node.parentNode;
				}
				if (!insideTabBar && img._originalWidth && img._originalHeight) {
					img.style.width = img._originalWidth + 'px';
					img.style.height = img._originalHeight + 'px';
					img.style.maxWidth = img._originalWidth + 'px';
					img.style.maxHeight = img._originalHeight + 'px';
				}
			});
			// Restore window width after drag
			if (parentWindow._originalWidth !== undefined) {
				parentWindow.style.width = parentWindow._originalWidth;
				delete parentWindow._originalWidth;
			} else {
				parentWindow.style.width = '';
			}
		});
	});
});

