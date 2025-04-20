document.addEventListener('DOMContentLoaded', () => {
  const linkDropdown = document.getElementById('linkDropdown');
  const linkInput = document.getElementById('linkInput');
  const testButton = document.getElementById('testButton');
  const resultDisplay = document.getElementById('resultDisplay');

  // Fetch all anchor links on the page and populate the dropdown
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        func: () => {
          return Array.from(document.querySelectorAll('a')).map(a => ({
            href: a.href,
            text: a.textContent.trim() || a.href
          }));
        },
      },
      (results) => {
        if (results && results[0] && results[0].result) {
          const links = results[0].result;
          links.forEach(link => {
            const option = document.createElement('option');
            option.value = link.href;
            option.textContent = link.text.length > 100 ? link.text.substring(0, 100) + '...' : link.text;
            linkDropdown.appendChild(option);
          });
        } else {
          console.error('Failed to fetch links from the page.');
        }
      }
    );
  });

  // Update the text field when a dropdown option is selected
  linkDropdown.addEventListener('change', () => {
    linkInput.value = linkDropdown.value;
  });

  // Handle the "Test" button click
  testButton.addEventListener('click', () => {
    const link = linkInput.value;
    if (link) {
      console.log(`Testing link: ${link}`);
      fetch('http://127.0.0.1:5001/makePrediction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: link }),
      })
        .then(response => response.json())
        .then(data => {
          resultDisplay.textContent = `Result: ${data.prediction}`;
        })
        .catch(error => {
          console.error('Error testing link:', error);
          resultDisplay.textContent = 'An error occurred while testing the link.';
        });
    } else {
      alert('Please select or enter a link.');
    }
  });
});
